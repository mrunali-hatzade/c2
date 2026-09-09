package com.cakeplatform.api.modules.order.controller;

import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import com.cakeplatform.api.modules.notification.NotificationService;
import com.cakeplatform.api.modules.notification.NotificationType;
import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.payment.Payment;
import com.cakeplatform.api.modules.payment.PaymentRepository;
import com.cakeplatform.api.modules.payment.RazorpayService;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.subscription.SubscriptionService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionService subscriptionService;
    private final ShopRepository shopRepository;
    private final RazorpayService razorpayService;
    private final NotificationService notificationService;
    private final ActivityLoggerService activityLogger;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * C2: Secure Razorpay Webhook Handler.
     * Computes HMAC-SHA256 signature against the exact unmodified raw request body.
     */
    @PostMapping("/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody String rawPayload) {

        // 1. Validate signature presence
        if (signature == null || signature.trim().isEmpty()) {
            log.warn("Webhook rejected: missing X-Razorpay-Signature header");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing signature");
        }

        // 2. Validate HMAC-SHA256 signature against exact raw payload
        boolean isValid = razorpayService.verifyWebhookSignature(rawPayload, signature);
        if (!isValid) {
            log.warn("Webhook rejected: HMAC-SHA256 signature verification failed");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid webhook signature");
        }

        try {
            // 3. Parse JSON event
            Map<String, Object> payload = objectMapper.readValue(rawPayload, new TypeReference<Map<String, Object>>() {});
            String event = (String) payload.get("event");
            @SuppressWarnings("unchecked")
            Map<String, Object> payloadData = (Map<String, Object>) payload.get("payload");

            if (payloadData == null) {
                log.warn("Webhook payloadData is null for event: {}", event);
                return ResponseEntity.ok("Webhook ignored (no payload data)");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> paymentWrapper = (Map<String, Object>) payloadData.get("payment");
            if (paymentWrapper == null) {
                log.info("Webhook event {} does not contain payment entity, returning 200 OK", event);
                return ResponseEntity.ok("Webhook acknowledged");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> entity = (Map<String, Object>) paymentWrapper.get("entity");
            if (entity == null) {
                return ResponseEntity.ok("Webhook acknowledged (no entity)");
            }

            String transactionId = (String) entity.get("id");
            String razorpayOrderId = (String) entity.get("order_id");
            @SuppressWarnings("unchecked")
            Map<String, Object> notes = (Map<String, Object>) entity.get("notes");

            // =========================================================================
            // Event: payment.captured
            // =========================================================================
            if ("payment.captured".equals(event)) {
                log.info("Processing webhook payment.captured: txId={}, orderId={}", transactionId, razorpayOrderId);

                // Case A: Customer Order Payment
                String orderNumber = null;
                if (notes != null) {
                    if (notes.containsKey("internal_order_number")) {
                        orderNumber = String.valueOf(notes.get("internal_order_number"));
                    } else if (notes.containsKey("order_number")) {
                        orderNumber = String.valueOf(notes.get("order_number"));
                    }
                }

                if (orderNumber != null) {
                    Order order = orderRepository.findByOrderNumber(orderNumber).orElse(null);
                    if (order != null) {
                        // Idempotency check: if order is already PAID, do nothing
                        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
                            log.info("Webhook idempotency: Order {} is already marked PAID. Skipping duplicate update.", orderNumber);
                            return ResponseEntity.ok("Webhook processed (idempotent, order already paid)");
                        }

                        order.setPaymentStatus("PAID");
                        order.setTransactionId(transactionId);
                        order.setPaidAt(LocalDateTime.now());
                        if ("NEW".equalsIgnoreCase(order.getOrderStatus())) {
                            order.setOrderStatus("CONFIRMED");
                        }
                        orderRepository.save(order);

                        // Save Payment record idempotently
                        if (paymentRepository.findByProviderPaymentId(transactionId).isEmpty()) {
                            Payment payment = new Payment();
                            payment.setShop(order.getShop());
                            payment.setAmount(order.getTotalAmount());
                            payment.setCurrency("INR");
                            payment.setProvider("RAZORPAY");
                            payment.setProviderOrderId(razorpayOrderId);
                            payment.setProviderPaymentId(transactionId);
                            payment.setStatus("COMPLETED");
                            payment.setPaidAt(LocalDateTime.now());
                            paymentRepository.save(payment);
                        }

                        // Send Notification to Owner
                        if (order.getShop() != null && order.getShop().getOwner() != null && notificationService != null) {
                            notificationService.createNotification(
                                    order.getShop().getOwner(),
                                    NotificationType.NEW_ORDER,
                                    "Payment Confirmed (Webhook)",
                                    String.format("Payment for Order %s (₹%s) was confirmed via Razorpay webhook.",
                                            order.getOrderNumber(), order.getTotalAmount()),
                                    order.getId().toString(),
                                    true
                            );
                        }

                        activityLogger.logActivity(null, order.getShop().getId(), "PAYMENT_CAPTURED_WEBHOOK", "ORDER", order.getId(), "Tx: " + transactionId);
                        return ResponseEntity.ok("Webhook processed (order confirmed)");
                    }
                }

                // Case B: Owner Subscription Payment
                String shopIdStr = null;
                if (notes != null) {
                    if (notes.containsKey("subscription_shop_id")) {
                        shopIdStr = String.valueOf(notes.get("subscription_shop_id"));
                    } else if (notes.containsKey("shop_id")) {
                        shopIdStr = String.valueOf(notes.get("shop_id"));
                    }
                }

                if (shopIdStr != null) {
                    try {
                        Long shopId = Long.parseLong(shopIdStr);
                        Shop shop = shopRepository.findById(shopId).orElse(null);

                        if (shop != null && shop.getOwner() != null) {
                            // Idempotency: check if payment ID is already recorded
                            if (paymentRepository.findByProviderPaymentId(transactionId).isPresent()) {
                                log.info("Webhook idempotency: Subscription payment {} already recorded. Skipping duplicate.", transactionId);
                                return ResponseEntity.ok("Webhook processed (idempotent, subscription already active)");
                            }

                            int durationDays = 30;
                            if (notes.containsKey("duration_days")) {
                                try {
                                    durationDays = Integer.parseInt(String.valueOf(notes.get("duration_days")));
                                } catch (Exception ignored) {}
                            }

                            Number amountNum = (Number) entity.get("amount");
                            BigDecimal amount = amountNum != null
                                    ? BigDecimal.valueOf(amountNum.longValue()).divide(BigDecimal.valueOf(100))
                                    : BigDecimal.valueOf(350.00);

                            subscriptionService.processSuccessfulPayment(
                                    shop.getOwner().getId(),
                                    amount,
                                    razorpayOrderId,
                                    transactionId,
                                    durationDays
                            );

                            return ResponseEntity.ok("Webhook processed (subscription activated)");
                        }
                    } catch (NumberFormatException e) {
                        log.warn("Invalid shop_id in subscription webhook notes: {}", shopIdStr);
                    }
                }
            }

            // =========================================================================
            // Event: payment.failed
            // =========================================================================
            if ("payment.failed".equals(event)) {
                log.info("Processing webhook payment.failed: txId={}", transactionId);
                String errorDescription = "Payment failed at gateway";
                @SuppressWarnings("unchecked")
                Map<String, Object> errorObj = (Map<String, Object>) entity.get("error_description");
                if (errorObj != null) {
                    errorDescription = String.valueOf(errorObj);
                }

                // If customer order, keep order as PENDING/NEW but record failure in activity log
                if (notes != null && notes.containsKey("internal_order_number")) {
                    String orderNumber = String.valueOf(notes.get("internal_order_number"));
                    Order order = orderRepository.findByOrderNumber(orderNumber).orElse(null);
                    if (order != null) {
                        activityLogger.logActivity(null, order.getShop().getId(), "PAYMENT_FAILED_WEBHOOK", "ORDER", order.getId(), errorDescription);
                    }
                }
            }

            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            log.error("Error processing Razorpay webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook processing error");
        }
    }
}

