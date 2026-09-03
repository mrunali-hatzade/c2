package com.cakeplatform.api.modules.security;

import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.VerificationStatus;
import com.cakeplatform.api.modules.subscription.Subscription;
import com.cakeplatform.api.modules.subscription.SubscriptionRepository;
import com.cakeplatform.api.modules.subscription.SubscriptionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopAccessValidator {

    private final ShopRepository shopRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Transactional(readOnly = true)
    public Shop getValidShopForOwner(Long ownerId) {
        List<Shop> shops = shopRepository.findByOwnerId(ownerId);
        if (shops.isEmpty()) {
            throw new IllegalArgumentException("Shop not found for this user");
        }
        
        Shop shop = shops.get(0);
        
        // TEMPORARILY DISABLED FOR LOCAL TESTING:
        // // Check 1: Must be VERIFIED
        // if (shop.getVerificationStatus() != VerificationStatus.VERIFIED) {
        //     throw new com.cakeplatform.api.exception.SubscriptionExpiredException("Shop is not verified yet.");
        // }
        // 
        // // Check 2: Active Subscription
        // Subscription latestSub = subscriptionRepository.findFirstByShopIdOrderByCreatedAtDesc(shop.getId())
        //     .orElseThrow(() -> new com.cakeplatform.api.exception.SubscriptionExpiredException("No subscription found. Please subscribe to a plan."));
        // 
        // if (latestSub.getStatus() == SubscriptionStatus.EXPIRED || 
        //     latestSub.getStatus() == SubscriptionStatus.SUSPENDED || 
        //     latestSub.getStatus() == SubscriptionStatus.CANCELLED) {
        //     throw new com.cakeplatform.api.exception.SubscriptionExpiredException("Subscription is " + latestSub.getStatus().name() + ". Please renew to access this feature.");
        // }
        
        return shop;
    }
}
