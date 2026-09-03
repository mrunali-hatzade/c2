package com.cakeplatform.api.modules.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);
    Optional<Order> findByIdAndShopId(Long id, Long shopId);
    long countByShopId(Long shopId);
    long countByShopIdAndOrderStatus(Long shopId, String orderStatus);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.shop.id = :shopId AND o.paymentStatus = 'COMPLETED'")
    BigDecimal sumRevenueByShopId(@Param("shopId") Long shopId);

    List<Order> findByShopIdAndCustomerEmailOrderByCreatedAtDesc(Long shopId, String customerEmail);

    @Query("SELECT DISTINCT o.customerEmail FROM Order o WHERE o.shop.id = :shopId AND o.customerEmail IS NOT NULL")
    List<String> findUniqueCustomerEmailsByShopId(@Param("shopId") Long shopId);
}
