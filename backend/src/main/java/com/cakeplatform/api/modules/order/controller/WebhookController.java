package com.cakeplatform.api.modules.order.controller;

import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final OrderRepository orderRepository;
    
    // In a real app, this comes from application.yml
    private final String RAZORPAY_SECRET = "mock_razorpay_secret_123";

    @PostMapping("/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody Map<String, Object> payload) {

        // 1. Validate Signature (Mock implementation for MVP)
        // In production, we would stringify the payload and run HMAC SHA256 against RAZORPAY_SECRET
        if (signature == null) {
            return ResponseEntity.badRequest().body("Missing signature");
        }

        try {
            // 2. Parse Event
            String event = (String) payload.get("event");
            Map<String, Object> payloadData = (Map<String, Object>) payload.get("payload");
            
            if ("payment.captured".equals(event)) {
                Map<String, Object> payment = (Map<String, Object>) payloadData.get("payment");
                Map<String, Object> entity = (Map<String, Object>) payment.get("entity");
                
                // Assuming order notes contain our internal order ID or UUID
                Map<String, String> notes = (Map<String, String>) entity.get("notes");
                String orderNumber = notes.get("internal_order_number");
                String transactionId = (String) entity.get("id");
                
                if (orderNumber != null) {
                    // 3. Idempotency & Update
                    Order order = orderRepository.findAll().stream()
                            .filter(o -> orderNumber.equals(o.getOrderNumber()))
                            .findFirst()
                            .orElse(null);
                            
                    if (order != null && !"PAID".equals(order.getPaymentStatus())) {
                        order.setPaymentStatus("PAID");
                        order.setTransactionId(transactionId);
                        order.setPaidAt(java.time.LocalDateTime.now());
                        
                        if ("NEW".equals(order.getOrderStatus())) {
                            order.setOrderStatus("CONFIRMED");
                        }
                        
                        orderRepository.save(order);
                    }
                }
            }
            
            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Webhook error");
        }
    }
}
