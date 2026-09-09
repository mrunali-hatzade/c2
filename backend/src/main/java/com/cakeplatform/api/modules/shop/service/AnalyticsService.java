package com.cakeplatform.api.modules.shop.service;

import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.shop.CouponRepository;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.security.ShopAccessValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final ShopAccessValidator shopAccessValidator;

    @Value("${app.business.default-timezone:Asia/Kolkata}")
    private String configuredTimezone;

    public ZoneId getOperationalZone() {
        try {
            return ZoneId.of(configuredTimezone);
        } catch (Exception e) {
            return ZoneId.systemDefault();
        }
    }

    public Map<String, Object> getDashboardAnalytics(Long userId) {
        Shop shop = shopAccessValidator.getValidShopForOwner(userId);
        Long shopId = shop.getId();

        // 1. Total lifetime order count for this shop
        long totalOrders = orderRepository.countByShopId(shopId);

        // 2. Realized Revenue calculated strictly by the approved single business rule
        BigDecimal totalRevenue = orderRepository.sumRevenueByShopId(shopId);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        // 3. Exactly 7 calendar days velocity (today + previous 6 calendar days)
        ZoneId zone = getOperationalZone();
        LocalDate today = LocalDate.now(zone);
        LocalDate startDate = today.minusDays(6);
        LocalDateTime startDateTime = startDate.atStartOfDay();

        // Pre-populate all 7 chronological days with 0.00 so zero-sales days are represented
        Map<String, BigDecimal> salesByDay = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate d = startDate.plusDays(i);
            String dayName = d.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            salesByDay.put(dayName, BigDecimal.ZERO);
        }

        // Query real realized orders in this 7-day window for this shop
        List<Order> recentOrders = orderRepository.findRecentRealizedOrders(shopId, startDateTime);
        for (Order o : recentOrders) {
            if (o.getCreatedAt() != null && o.getTotalAmount() != null) {
                LocalDate orderDate = o.getCreatedAt().toLocalDate();
                if (!orderDate.isBefore(startDate) && !orderDate.isAfter(today)) {
                    String dayName = orderDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                    salesByDay.put(dayName, salesByDay.getOrDefault(dayName, BigDecimal.ZERO).add(o.getTotalAmount()));
                }
            }
        }

        // 4. Real Top-selling products from OrderItem snapshots (top 5, excluding cancelled orders)
        List<Object[]> topProductsRaw = orderRepository.findTopSellingProductsByShopId(shopId, PageRequest.of(0, 5));
        Map<String, Integer> topSellingProducts = new LinkedHashMap<>();
        for (Object[] row : topProductsRaw) {
            String productName = (String) row[0];
            Number qty = (Number) row[1];
            if (productName != null) {
                topSellingProducts.put(productName, qty != null ? qty.intValue() : 0);
            }
        }

        // 5. Coupon performance metrics
        long totalCoupons = couponRepository.countByShopId(shopId);
        long activeCoupons = couponRepository.countByShopIdAndIsActiveTrue(shopId);
        BigDecimal totalDiscountGranted = orderRepository.sumTotalDiscountByShopId(shopId);
        if (totalDiscountGranted == null) {
            totalDiscountGranted = BigDecimal.ZERO;
        }
        long totalCouponOrders = orderRepository.countCouponOrdersByShopId(shopId);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("shopId", shopId);
        analytics.put("totalOrders", totalOrders);
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("topSellingProducts", topSellingProducts);
        analytics.put("salesByDay", salesByDay);
        analytics.put("totalCoupons", totalCoupons);
        analytics.put("activeCoupons", activeCoupons);
        analytics.put("totalDiscountGranted", totalDiscountGranted);
        analytics.put("totalCouponOrders", totalCouponOrders);

        return analytics;
    }
}
