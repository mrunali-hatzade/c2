package com.cakeplatform.api.modules.shop;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopDeliverySlotRepository extends JpaRepository<ShopDeliverySlot, Long> {
    List<ShopDeliverySlot> findByShopIdAndIsActiveTrue(Long shopId);
    List<ShopDeliverySlot> findByShopId(Long shopId);
}
