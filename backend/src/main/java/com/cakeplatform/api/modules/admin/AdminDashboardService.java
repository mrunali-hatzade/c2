package com.cakeplatform.api.modules.admin;

import com.cakeplatform.api.modules.admin.dto.AdminShopDetailsResponse;
import com.cakeplatform.api.modules.admin.dto.AdminShopSummaryResponse;
import com.cakeplatform.api.modules.admin.dto.DashboardStatsResponse;
import com.cakeplatform.api.modules.audit.ActivityLogRepository;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.payment.PaymentRepository;
import com.cakeplatform.api.modules.product.ProductRepository;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopStatus;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.ShopStatusManager;
import com.cakeplatform.api.modules.subscription.SubscriptionRepository;
import com.cakeplatform.api.modules.user.User;
import com.cakeplatform.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ShopStatusManager shopStatusManager;

    public DashboardStatsResponse getPlatformStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalShops(shopRepository.count());
        stats.setActiveShops(shopRepository.countByStatus(ShopStatus.ACTIVE));
        stats.setSuspendedShops(shopRepository.countByStatus(ShopStatus.SUSPENDED));
        stats.setPendingShops(shopRepository.countByStatus(ShopStatus.PENDING));
        stats.setTotalUsers(userRepository.count());

        BigDecimal revenue = paymentRepository.getTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        return stats;
    }

    public List<AdminShopSummaryResponse> getAllShops() {
        return shopRepository.findAll().stream().map(shop -> {
            AdminShopSummaryResponse summary = new AdminShopSummaryResponse();
            summary.setShopId(shop.getId());
            summary.setBusinessName(shop.getBusinessName());
            summary.setShopStatus(shop.getStatus().name());
            summary.setRegisteredAt(shop.getCreatedAt());

            User owner = shop.getOwner();
            if (owner != null) {
                summary.setOwnerName(owner.getFullName());
                summary.setOwnerEmail(owner.getEmail());
            }

            return summary;
        }).collect(Collectors.toList());
    }

    public AdminShopDetailsResponse getShopDetails(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        AdminShopDetailsResponse details = new AdminShopDetailsResponse();
        details.setShop(shop);
        details.setSubscriptions(subscriptionRepository.findByShopId(shopId));
        details.setPayments(paymentRepository.findByShopId(shopId));
        details.setActivityLogs(activityLogRepository.findByShopIdOrderByTimestampDesc(shopId));
        details.setTotalProducts(productRepository.countByShopId(shopId));
        details.setTotalOrders(orderRepository.countByShopId(shopId));

        return details;
    }

    @Transactional
    public Shop updateShopStatus(Long shopId, String status) {
        if ("SUSPENDED".equals(status)) {
            shopStatusManager.suspendShop(shopId, null);
        } else if ("ACTIVE".equals(status)) {
            // Admin forcefully re-activating a shop
            shopStatusManager.activateShop(shopId, null);
        } else if ("INACTIVE".equals(status)) {
            shopStatusManager.markShopInactive(shopId, null);
        }
        return shopRepository.findById(shopId).orElseThrow();
    }
}
