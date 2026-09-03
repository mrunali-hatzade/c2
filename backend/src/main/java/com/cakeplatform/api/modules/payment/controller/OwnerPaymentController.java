package com.cakeplatform.api.modules.payment.controller;

import com.cakeplatform.api.modules.subscription.SubscriptionService;
import com.cakeplatform.api.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/owner/payments")
@PreAuthorize("hasRole('SHOP_OWNER')")
@RequiredArgsConstructor
public class OwnerPaymentController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/mock-checkout")
    public ResponseEntity<?> processMockCheckout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Object> payload) {
        
        // In a real app, you would verify Razorpay signature here.
        // For testing, we mock a successful payment to activate the shop.
        
        BigDecimal amount = new BigDecimal(payload.getOrDefault("amount", "999.00").toString());
        String mockOrderId = "order_" + UUID.randomUUID().toString().substring(0, 8);
        String mockPaymentId = "pay_" + UUID.randomUUID().toString().substring(0, 8);

        subscriptionService.processSuccessfulPayment(userDetails.getId(), amount, mockOrderId, mockPaymentId);

        return ResponseEntity.ok(Map.of(
                "message", "Payment processed successfully. Shop activated.",
                "orderId", mockOrderId,
                "paymentId", mockPaymentId
        ));
    }
}
