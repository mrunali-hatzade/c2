package com.cakeplatform.api.modules.payment;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

@Service
@Slf4j
@Getter
public class RazorpayService {

    private final String keyId;
    private final String keySecret;
    private final String webhookSecret;

    public RazorpayService(
            @Value("${razorpay.key-id:rzp_test_placeholder}") String keyId,
            @Value("${razorpay.key-secret:secret_placeholder}") String keySecret,
            @Value("${razorpay.webhook-secret:webhook_secret_placeholder}") String webhookSecret) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.webhookSecret = webhookSecret;
    }

    /**
     * Verifies the payment signature returned by the client-side Razorpay checkout.
     * Expected signature payload: HMAC_SHA256(orderId + "|" + paymentId, keySecret).
     */
    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
            log.warn("Missing payment signature component: orderId={}, paymentId={}, signature={}",
                    razorpayOrderId, razorpayPaymentId, (razorpaySignature != null ? "[PRESENT]" : "[NULL]"));
            return false;
        }

        String data = razorpayOrderId + "|" + razorpayPaymentId;
        String expectedSignature = calculateHmacSha256(data, keySecret);
        if (expectedSignature == null) {
            return false;
        }

        return constantTimeEquals(expectedSignature, razorpaySignature.trim());
    }

    /**
     * Verifies the signature of an incoming Razorpay webhook against the exact raw request payload.
     * Expected signature payload: HMAC_SHA256(rawPayload, webhookSecret).
     */
    public boolean verifyWebhookSignature(String rawPayload, String signatureHeader) {
        if (rawPayload == null || signatureHeader == null || signatureHeader.trim().isEmpty()) {
            log.warn("Missing webhook payload or signature header");
            return false;
        }

        String expectedSignature = calculateHmacSha256(rawPayload, webhookSecret);
        if (expectedSignature == null) {
            return false;
        }

        return constantTimeEquals(expectedSignature, signatureHeader.trim());
    }

    /**
     * Calculates an HMAC-SHA256 hex digest for the given input and secret.
     */
    public String calculateHmacSha256(String data, String secret) {
        if (data == null || secret == null) {
            return null;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            log.error("Failed to calculate HMAC-SHA256: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Constant-time comparison to prevent timing attacks.
     */
    public static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        return MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8),
                b.getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Returns true if production or non-placeholder credentials have been configured.
     */
    public boolean isConfigured() {
        return keyId != null && !keyId.isBlank() && !keyId.contains("placeholder")
                && keySecret != null && !keySecret.isBlank() && !keySecret.contains("placeholder");
    }
}
