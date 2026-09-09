package com.cakeplatform.api.modules.payment.controller;

import com.cakeplatform.api.modules.notification.NotificationService;
import com.cakeplatform.api.modules.notification.NotificationType;
import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.payment.Payment;
import com.cakeplatform.api.modules.payment.PaymentRepository;
import com.cakeplatform.api.modules.payment.RazorpayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/storefront/orders")
@RequiredArgsConstructor
@Slf4j
public class CustomerPaymentController {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;
    private final NotificationService notificationService;

    /**
     * C1: Create / initialize a Razorpay payment order for a customer order.
     * The payable amount is strictly authoritative from the server-side Order entity.
     */
    @PostMapping("/{orderNumber}/create-payment-order")
    public ResponseEntity<Map<String, Object>> createCustomerPaymentOrder(
            @PathVariable String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new IllegalStateException("Cannot initiate payment for a cancelled order");
        }
        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new IllegalStateException("Order is already paid");
        }

        BigDecimal authoritativeAmount = order.getTotalAmount();
        long amountPaise = authoritativeAmount.multiply(BigDecimal.valueOf(100)).longValue();
        String razorpayOrderId = "order_cust_" + UUID.randomUUID().toString().substring(0, 10);

        return ResponseEntity.ok(Map.of(
                "orderNumber", order.getOrderNumber(),
                "razorpayOrderId", razorpayOrderId,
                "amount", authoritativeAmount,
                "amountPaise", amountPaise,
                "currency", "INR",
                "keyId", razorpayService.getKeyId(),
                "shopName", order.getShop() != null ? order.getShop().getBusinessName() : "CakeStore",
                "customerName", order.getCustomerName() != null ? order.getCustomerName() : "",
                "customerEmail", order.getCustomerEmail() != null ? order.getCustomerEmail() : "",
                "customerPhone", order.getCustomerPhone() != null ? order.getCustomerPhone() : ""
        ));
    }

    /**
     * C1: Verify payment signature for customer order and update state idempotently.
     */
    @PostMapping("/{orderNumber}/verify-payment")
    public ResponseEntity<Map<String, Object>> verifyCustomerPayment(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> payload) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        String razorpayOrderId = payload.get("razorpayOrderId");
        String razorpayPaymentId = payload.get("razorpayPaymentId");
        String razorpaySignature = payload.get("razorpaySignature");

        if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
            throw new IllegalArgumentException("Missing required payment verification parameters");
        }

        // Signature check when credentials are configured
        if (razorpayService.isConfigured()) {
            boolean valid = razorpayService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            if (!valid) {
                log.warn("Payment verification failed for customer order {}", orderNumber);
                throw new IllegalArgumentException("Payment verification failed. Invalid signature.");
            }
        }

        // Idempotency: if already PAID, return success without duplicate actions
        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Order already verified and paid",
                    "orderNumber", order.getOrderNumber()
            ));
        }

        // Update Order
        order.setPaymentStatus("PAID");
        order.setPaymentMethod("RAZORPAY");
        order.setTransactionId(razorpayPaymentId);
        order.setPaidAt(LocalDateTime.now());
        if ("NEW".equalsIgnoreCase(order.getOrderStatus())) {
            order.setOrderStatus("CONFIRMED");
        }
        orderRepository.save(order);

        // Record Payment
        Payment payment = new Payment();
        payment.setShop(order.getShop());
        payment.setAmount(order.getTotalAmount());
        payment.setCurrency("INR");
        payment.setProvider("RAZORPAY");
        payment.setProviderOrderId(razorpayOrderId);
        payment.setProviderPaymentId(razorpayPaymentId);
        payment.setStatus("COMPLETED");
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Dispatch Notification to Bakery Owner
        if (order.getShop() != null && order.getShop().getOwner() != null && notificationService != null) {
            notificationService.createNotification(
                    order.getShop().getOwner(),
                    NotificationType.NEW_ORDER,
                    "Payment Received (Razorpay)",
                    String.format("Payment of ₹%s for Order %s has been confirmed.", order.getTotalAmount(), order.getOrderNumber()),
                    order.getId().toString(),
                    true
            );
        }

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Payment verified and order confirmed",
                "orderNumber", order.getOrderNumber(),
                "paymentId", payment.getId()
        ));
    }
}
