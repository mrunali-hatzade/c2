package com.cakeplatform.api.modules.shop;

import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShopStatusManager {

    private final ShopRepository shopRepository;
    private final ActivityLoggerService activityLogger;

    @Transactional
    public void activateShop(Long shopId, Long actorUserId) {
        changeShopStatus(shopId, ShopStatus.ACTIVE, actorUserId, "SHOP_ACTIVATED");
    }

    @Transactional
    public void markShopInactive(Long shopId, Long actorUserId) {
        changeShopStatus(shopId, ShopStatus.INACTIVE, actorUserId, "SHOP_BECAME_INACTIVE");
    }

    @Transactional
    public void suspendShop(Long shopId, Long actorUserId, String reason) {
        String metadata = (reason != null && !reason.trim().isEmpty())
                ? "Suspended: " + reason.trim()
                : "Status changed to SUSPENDED";
        changeShopStatus(shopId, ShopStatus.SUSPENDED, actorUserId, "SHOP_SUSPENDED", metadata);
    }

    @Transactional
    public void suspendShop(Long shopId, Long actorUserId) {
        suspendShop(shopId, actorUserId, null);
    }

    private void changeShopStatus(Long shopId, ShopStatus newStatus, Long actorUserId, String action) {
        changeShopStatus(shopId, newStatus, actorUserId, action, "Status changed to " + newStatus.name());
    }

    private void changeShopStatus(Long shopId, ShopStatus newStatus, Long actorUserId, String action, String metadata) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        
        shop.setStatus(newStatus);
        shopRepository.save(shop);

        activityLogger.logActivity(
                actorUserId,
                shopId,
                action,
                "SHOP",
                shopId,
                metadata
        );
    }
}
