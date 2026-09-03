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
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final ShopRepository shopRepository;
    private final ShopStatusManager shopStatusManager;
    private final ActivityLoggerService activityLogger;

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
    public void processSuccessfulPayment(Long userId, BigDecimal amount, String providerOrderId, String providerPaymentId) {
        Shop shop = getShopByOwnerId(userId);

        // 1. Create/Update Subscription
        Subscription subscription = new Subscription();
        subscription.setShop(shop);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setAmount(amount);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setExpiryDate(LocalDateTime.now().plusDays(30)); // Configurable in real scenario
        
        subscription = subscriptionRepository.save(subscription);

        activityLogger.logActivity(userId, shop.getId(), "SUBSCRIPTION_ACTIVATED", "SUBSCRIPTION", subscription.getId(), "30 days");

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

        paymentRepository.save(payment);

        activityLogger.logActivity(userId, shop.getId(), "PAYMENT_COMPLETED", "PAYMENT", payment.getId(), "Amount: " + amount);

        // 3. Update Shop Status
        shopStatusManager.activateShop(shop.getId(), userId);
    }
    
    @Transactional
    public void expireSubscription(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
                
        subscription.setStatus(SubscriptionStatus.EXPIRED);
        subscriptionRepository.save(subscription);
        
        activityLogger.logActivity(null, subscription.getShop().getId(), "SUBSCRIPTION_EXPIRED", "SUBSCRIPTION", subscription.getId(), null);
        
        shopStatusManager.markShopInactive(subscription.getShop().getId(), null);
    }
}
