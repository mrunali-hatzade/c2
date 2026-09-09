package com.cakeplatform.api.modules.order;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByShopIdOrderByCreatedAtDesc(Long shopId);
    Optional<Order> findByIdAndShopId(Long id, Long shopId);
    Optional<Order> findByOrderNumber(String orderNumber);
    long countByShopId(Long shopId);
    long countByShopIdAndOrderStatus(Long shopId, String orderStatus);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.shop.id = :shopId " +
           "  AND o.orderStatus != 'CANCELLED' " +
           "  AND (o.paymentStatus IN ('PAID', 'COMPLETED') OR o.orderStatus IN ('COMPLETED', 'DELIVERED')) " +
           "  AND o.paymentStatus NOT IN ('REFUNDED', 'FAILED')")
    BigDecimal sumRevenueByShopId(@Param("shopId") Long shopId);

    @Query("SELECT o FROM Order o " +
           "WHERE o.shop.id = :shopId " +
           "  AND o.createdAt >= :startDate " +
           "  AND o.orderStatus != 'CANCELLED' " +
           "  AND (o.paymentStatus IN ('PAID', 'COMPLETED') OR o.orderStatus IN ('COMPLETED', 'DELIVERED')) " +
           "  AND o.paymentStatus NOT IN ('REFUNDED', 'FAILED')")
    List<Order> findRecentRealizedOrders(@Param("shopId") Long shopId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT oi.productNameSnapshot, SUM(oi.quantity) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.shop.id = :shopId " +
           "  AND oi.order.orderStatus != 'CANCELLED' " +
           "  AND (oi.order.paymentStatus IN ('PAID', 'COMPLETED') OR oi.order.orderStatus IN ('COMPLETED', 'DELIVERED')) " +
           "  AND oi.order.paymentStatus NOT IN ('REFUNDED', 'FAILED') " +
           "GROUP BY oi.productNameSnapshot " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProductsByShopId(@Param("shopId") Long shopId, Pageable pageable);

    List<Order> findByShopIdAndCustomerEmailOrderByCreatedAtDesc(Long shopId, String customerEmail);

    @Query("SELECT DISTINCT o.customerEmail FROM Order o WHERE o.shop.id = :shopId AND o.customerEmail IS NOT NULL")
    List<String> findUniqueCustomerEmailsByShopId(@Param("shopId") Long shopId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.createdAt >= :startDate " +
           "  AND o.orderStatus != 'CANCELLED' " +
           "  AND (o.paymentStatus IN ('PAID', 'COMPLETED') OR o.orderStatus IN ('COMPLETED', 'DELIVERED')) " +
           "  AND o.paymentStatus NOT IN ('REFUNDED', 'FAILED')")
    BigDecimal sumMonthlyRealizedRevenue(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COALESCE(SUM(o.discountAmount), 0) FROM Order o WHERE o.shop.id = :shopId AND o.orderStatus != 'CANCELLED'")
    BigDecimal sumTotalDiscountByShopId(@Param("shopId") Long shopId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = :shopId AND o.couponCode IS NOT NULL AND o.orderStatus != 'CANCELLED'")
    long countCouponOrdersByShopId(@Param("shopId") Long shopId);
}

