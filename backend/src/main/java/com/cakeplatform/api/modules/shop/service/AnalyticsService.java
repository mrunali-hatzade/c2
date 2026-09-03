package com.cakeplatform.api.modules.shop.service;

import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.security.ShopAccessValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ShopAccessValidator shopAccessValidator;

    public Map<String, Object> getDashboardAnalytics(Long userId) {
        Shop shop = shopAccessValidator.getValidShopForOwner(userId);
        
        // This is a simplified analytics implementation for MVP
        // In a real application, we would use complex SQL group-by queries to get
        // top-selling items, revenue by day/month, etc.
        
        long totalOrders = orderRepository.countByShopId(shop.getId());
        
        // Aggregate manually for MVP to avoid creating complex custom queries right now
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getShop().getId().equals(shop.getId()))
                .filter(o -> "COMPLETED".equals(o.getOrderStatus()) || "DELIVERED".equals(o.getOrderStatus()) || "PAID".equals(o.getPaymentStatus()))
                .map(o -> o.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("shopId", shop.getId());
        analytics.put("totalOrders", totalOrders);
        analytics.put("totalRevenue", totalRevenue);
        
        // Mock data for charts
        analytics.put("topSellingProducts", Map.of(
            "Chocolate Truffle Cake", 45,
            "Strawberry Shortcake", 30,
            "Red Velvet", 15
        ));
        
        analytics.put("salesByDay", Map.of(
            "Monday", 120.50,
            "Tuesday", 90.00,
            "Wednesday", 210.00,
            "Thursday", 150.75,
            "Friday", 300.20,
            "Saturday", 500.00,
            "Sunday", 450.00
        ));
        
        return analytics;
    }
}
