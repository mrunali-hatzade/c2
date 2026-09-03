package com.cakeplatform.api.modules.order.service;

import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.shop.Shop;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final com.cakeplatform.api.modules.security.ShopAccessValidator shopAccessValidator;
    private final ActivityLoggerService activityLogger;

    private Shop getShopByOwnerId(Long ownerId) {
        return shopAccessValidator.getValidShopForOwner(ownerId);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        Shop shop = getShopByOwnerId(userId);
        return orderRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());
    }

    public Order getOrderDetails(Long userId, Long orderId) {
        Shop shop = getShopByOwnerId(userId);
        return orderRepository.findByIdAndShopId(orderId, shop.getId())
                .orElseThrow(() -> new RuntimeException("Order not found or unauthorized"));
    }

    @Transactional
    public Order updateOrderStatus(Long userId, Long orderId, String newStatus) {
        Shop shop = getShopByOwnerId(userId);
        Order order = orderRepository.findByIdAndShopId(orderId, shop.getId())
                .orElseThrow(() -> new RuntimeException("Order not found or unauthorized"));

        order.setOrderStatus(newStatus);
        Order updated = orderRepository.save(order);
        
        activityLogger.logActivity(userId, shop.getId(), "ORDER_STATUS_CHANGED", "ORDER", updated.getId(), "Status: " + newStatus);
        return updated;
    }
}
