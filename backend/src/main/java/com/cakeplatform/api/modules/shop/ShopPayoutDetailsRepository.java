package com.cakeplatform.api.modules.shop;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopPayoutDetailsRepository extends JpaRepository<ShopPayoutDetails, Long> {
    Optional<ShopPayoutDetails> findByShopId(Long shopId);
}
