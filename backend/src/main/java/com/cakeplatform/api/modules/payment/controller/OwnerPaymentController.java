package com.cakeplatform.api.modules.payment.controller;

import com.cakeplatform.api.modules.order.InvoiceService;
import com.cakeplatform.api.modules.payment.Payment;
import com.cakeplatform.api.modules.payment.PaymentRepository;
import com.cakeplatform.api.modules.payment.RazorpayService;
import com.cakeplatform.api.modules.payment.dto.OwnerPaymentResponse;
import com.cakeplatform.api.modules.security.ShopAccessValidator;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.subscription.SubscriptionPlan;
import com.cakeplatform.api.modules.subscription.SubscriptionPlanRepository;
import com.cakeplatform.api.modules.subscription.SubscriptionService;
import com.cakeplatform.api.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/owner/payments")
@PreAuthorize("hasRole('SHOP_OWNER')")
@RequiredArgsConstructor
@Slf4j
public class OwnerPaymentController {

    private final SubscriptionService subscriptionService;
    private final PaymentRepository paymentRepository;
    private final ShopAccessValidator shopAccessValidator;
    private final RazorpayService razorpayService;
    private final InvoiceService invoiceService;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    /**
     * C3: Retrieve billing and payment history for the authenticated shop owner.
     * Enforces database-level tenant isolation.
     */
    @GetMapping
    public ResponseEntity<List<OwnerPaymentResponse>> getMyPayments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Shop shop = shopAccessValidator.getShopByOwnerId(userDetails.getId());
        List<Payment> payments = paymentRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());

        List<OwnerPaymentResponse> response = payments.stream().map(p -> {
            String planName = "Pro Baker Studio";
            if (p.getSubscription() != null && p.getSubscription().getPlan() != null) {
                planName = p.getSubscription().getPlan().getName();
            }
            return OwnerPaymentResponse.builder()
                    .id(p.getId())
                    .amount(p.getAmount())
                    .currency(p.getCurrency() != null ? p.getCurrency() : "INR")
                    .provider(p.getProvider())
                    .providerOrderId(p.getProviderOrderId())
                    .providerPaymentId(p.getProviderPaymentId())
                    .status(p.getStatus())
                    .failureReason(p.getFailureReason())
                    .paidAt(p.getPaidAt())
                    .createdAt(p.getCreatedAt())
                    .subscriptionPlanName(planName)
                    .invoiceAvailable("COMPLETED".equalsIgnoreCase(p.getStatus()))
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * C5: Download official tax invoice PDF for a specific subscription payment.
     * Enforces tenant isolation (payment must belong to owner's shop).
     */
    @GetMapping("/{paymentId}/invoice")
    public ResponseEntity<byte[]> downloadSubscriptionInvoice(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long paymentId) throws Exception {
        Shop shop = shopAccessValidator.getShopByOwnerId(userDetails.getId());
        Payment payment = paymentRepository.findByIdAndShopId(paymentId, shop.getId())
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found or does not belong to your bakery"));

        if (!"COMPLETED".equalsIgnoreCase(payment.getStatus())) {
            throw new IllegalStateException("Invoice is only available for completed payments");
        }

        byte[] pdfBytes = invoiceService.generateSubscriptionInvoice(payment);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-SUB-" + payment.getId() + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    /**
     * C1: Initiate subscription payment with server-authoritative pricing.
     */
    @PostMapping("/initiate-subscription")
    public ResponseEntity<Map<String, Object>> initiateSubscriptionPayment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Object> payload) {
        Shop shop = shopAccessValidator.getShopByOwnerId(userDetails.getId());

        String billingCycle = (String) payload.getOrDefault("billingCycle", "monthly");
        BigDecimal amount = "yearly".equalsIgnoreCase(billingCycle)
                ? BigDecimal.valueOf(3500.00)
                : BigDecimal.valueOf(350.00);
        int durationDays = "yearly".equalsIgnoreCase(billingCycle) ? 365 : 30;

        String orderId = "order_sub_" + UUID.randomUUID().toString().substring(0, 10);

        return ResponseEntity.ok(Map.of(
                "razorpayOrderId", orderId,
                "amount", amount,
                "amountPaise", amount.multiply(BigDecimal.valueOf(100)).longValue(),
                "currency", "INR",
                "keyId", razorpayService.getKeyId(),
                "durationDays", durationDays,
                "shopName", shop.getBusinessName()
        ));
    }

    /**
     * C1: Verify subscription payment signature and update subscription & shop state.
     */
    @PostMapping("/verify-subscription")
    public ResponseEntity<Map<String, Object>> verifySubscriptionPayment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> payload) {
        String razorpayOrderId = payload.get("razorpayOrderId");
        String razorpayPaymentId = payload.get("razorpayPaymentId");
        String razorpaySignature = payload.get("razorpaySignature");
        String billingCycle = payload.getOrDefault("billingCycle", "monthly");

        if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
            throw new IllegalArgumentException("Missing required payment verification parameters");
        }

        // Signature verification (unless in test mock mode where placeholder credentials are active)
        if (razorpayService.isConfigured()) {
            boolean valid = razorpayService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            if (!valid) {
                log.warn("Subscription payment signature verification failed for user {}", userDetails.getId());
                throw new IllegalArgumentException("Payment verification failed. Invalid signature.");
            }
        }

        BigDecimal authoritativeAmount = "yearly".equalsIgnoreCase(billingCycle)
                ? BigDecimal.valueOf(3500.00)
                : BigDecimal.valueOf(350.00);
        int durationDays = "yearly".equalsIgnoreCase(billingCycle) ? 365 : 30;

        Payment payment = subscriptionService.processSuccessfulPayment(
                userDetails.getId(),
                authoritativeAmount,
                razorpayOrderId,
                razorpayPaymentId,
                durationDays
        );

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Subscription payment verified successfully",
                "paymentId", payment.getId(),
                "providerPaymentId", razorpayPaymentId
        ));
    }

    /**
     * Preserved mock checkout for offline testing / sandbox simulation.
     * Uses authoritative pricing and respects suspension & KYC precedence.
     */
    @PostMapping("/mock-checkout")
    public ResponseEntity<?> processMockCheckout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Object> payload) {
        String billingCycle = (String) payload.getOrDefault("billingCycle", "monthly");
        BigDecimal amount = "yearly".equalsIgnoreCase(billingCycle)
                ? BigDecimal.valueOf(3500.00)
                : BigDecimal.valueOf(350.00);
        int durationDays = "yearly".equalsIgnoreCase(billingCycle) ? 365 : 30;

        String mockOrderId = "order_mock_" + UUID.randomUUID().toString().substring(0, 8);
        String mockPaymentId = "pay_mock_" + UUID.randomUUID().toString().substring(0, 8);

        Payment payment = subscriptionService.processSuccessfulPayment(
                userDetails.getId(),
                amount,
                mockOrderId,
                mockPaymentId,
                durationDays
        );

        return ResponseEntity.ok(Map.of(
                "message", "Payment processed successfully. Subscription updated.",
                "orderId", mockOrderId,
                "paymentId", mockPaymentId,
                "recordId", payment.getId()
        ));
    }
}

