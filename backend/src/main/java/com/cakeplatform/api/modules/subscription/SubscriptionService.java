package com.cakeplatform.api.modules.subscription;

import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import com.cakeplatform.api.modules.payment.Payment;
import com.cakeplatform.api.modules.payment.PaymentRepository;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.ShopStatusManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final ShopRepository shopRepository;
    private final ShopStatusManager shopStatusManager;
    private final ActivityLoggerService activityLogger;
    private final com.cakeplatform.api.modules.notification.NotificationService notificationService;

    private Shop getShopByOwnerId(Long ownerId) {
        List<Shop> shops = shopRepository.findByOwnerId(ownerId);
        if (shops.isEmpty()) {
            throw new IllegalArgumentException("Shop not found for this user");
        }
        return shops.get(0);
    }

    public Subscription getActiveSubscription(Long userId) {
        Shop shop = getShopByOwnerId(userId);
        
        return subscriptionRepository.findFirstByShopIdAndStatusOrderByCreatedAtDesc(shop.getId(), SubscriptionStatus.ACTIVE)
                .orElse(null);
    }

    @Transactional
    public Payment processSuccessfulPayment(Long userId, BigDecimal amount, String providerOrderId, String providerPaymentId, Integer durationDays) {
        Shop shop = getShopByOwnerId(userId);

        int days = (durationDays != null && durationDays > 0) ? durationDays : 30;

        // 1. Create/Update Subscription
        Subscription subscription = new Subscription();
        subscription.setShop(shop);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setAmount(amount);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setExpiryDate(LocalDateTime.now().plusDays(days));
        
        subscription = subscriptionRepository.save(subscription);

        activityLogger.logActivity(userId, shop.getId(), "SUBSCRIPTION_ACTIVATED", "SUBSCRIPTION", subscription.getId(), days + " days");

        // 2. Create Payment Record
        Payment payment = new Payment();
        payment.setShop(shop);
        payment.setSubscription(subscription);
        payment.setAmount(amount);
        payment.setCurrency("INR");
        payment.setProvider("RAZORPAY");
        payment.setProviderOrderId(providerOrderId);
        payment.setProviderPaymentId(providerPaymentId);
        payment.setStatus("COMPLETED");
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        activityLogger.logActivity(userId, shop.getId(), "PAYMENT_COMPLETED", "PAYMENT", savedPayment.getId(), "Amount: " + amount);

        // 3. Update Shop Status (with strict suspension & KYC precedence)
        if (shop.getStatus() == com.cakeplatform.api.modules.shop.ShopStatus.SUSPENDED) {
            log.info("Shop {} is SUSPENDED by admin. Subscription renewed but shop remains SUSPENDED.", shop.getId());
        } else if (shop.getVerificationStatus() == com.cakeplatform.api.modules.shop.VerificationStatus.VERIFIED) {
            shopStatusManager.activateShop(shop.getId(), userId);
        } else {
            log.info("Shop {} is not VERIFIED (status: {}). Subscription renewed but shop remains non-active pending KYC.",
                    shop.getId(), shop.getVerificationStatus());
        }

        // Notify owner of successful subscription renewal
        if (shop.getOwner() != null && notificationService != null) {
            notificationService.createNotification(
                    shop.getOwner(),
                    com.cakeplatform.api.modules.notification.NotificationType.SUBSCRIPTION_EXPIRING,
                    "Subscription Activated",
                    String.format("Your subscription for %s is now ACTIVE for %d days. Thank you for your payment!", shop.getBusinessName(), days),
                    subscription.getId() != null ? subscription.getId().toString() : "",
                    false
            );
        }

        return savedPayment;
    }

    @Transactional
    public Payment processSuccessfulPayment(Long userId, BigDecimal amount, String providerOrderId, String providerPaymentId) {
        return processSuccessfulPayment(userId, amount, providerOrderId, providerPaymentId, 30);
    }
    
    @Transactional
    public void expireSubscription(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        Shop shop = subscription.getShop();
        
        // Idempotency: if already expired and shop inactive, nothing to do
        if (subscription.getStatus() == SubscriptionStatus.EXPIRED && shop.getStatus() == com.cakeplatform.api.modules.shop.ShopStatus.INACTIVE) {
            return;
        }

        subscription.setStatus(SubscriptionStatus.EXPIRED);
        subscriptionRepository.save(subscription);
        
        activityLogger.logActivity(null, shop.getId(), "SUBSCRIPTION_EXPIRED", "SUBSCRIPTION", subscription.getId(), "Daily scheduled or manual expiration");
        
        // Transition associated shop to INACTIVE
        shopStatusManager.markShopInactive(shop.getId(), null);

        // Notify the owner
        if (shop.getOwner() != null && notificationService != null) {
            String message = String.format("Your subscription for %s has expired. Your shop is now hidden from customers.", shop.getBusinessName());
            notificationService.createNotification(
                    shop.getOwner(),
                    com.cakeplatform.api.modules.notification.NotificationType.SUBSCRIPTION_EXPIRED,
                    "Subscription Expired",
                    message,
                    subscription.getId().toString(),
                    true
            );
        }
    }
}
