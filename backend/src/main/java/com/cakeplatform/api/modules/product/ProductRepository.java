package com.cakeplatform.api.modules.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShopId(Long shopId);
    Optional<Product> findByIdAndShopId(Long id, Long shopId);
    long countByShopId(Long shopId);
    long countByShopIdAndStatusAndAvailability(Long shopId, String status, Boolean availability);
}
