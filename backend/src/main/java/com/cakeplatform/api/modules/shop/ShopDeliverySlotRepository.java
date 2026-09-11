package com.cakeplatform.api.modules.shop;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopDeliverySlotRepository extends JpaRepository<ShopDeliverySlot, Long> {
    List<ShopDeliverySlot> findByShopIdAndIsActiveTrue(Long shopId);
    List<ShopDeliverySlot> findByShopId(Long shopId);
    Optional<ShopDeliverySlot> findByIdAndShopId(Long id, Long shopId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ShopDeliverySlot s WHERE s.id = :id AND s.shop.id = :shopId")
    Optional<ShopDeliverySlot> findByIdAndShopIdWithLock(@Param("id") Long id, @Param("shopId") Long shopId);

    void deleteByShopId(Long shopId);
}

