package com.cakeplatform.api.modules.shop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OwnerDashboardStatsResponse {
    private long totalProducts;
    private long activeProducts;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;
    private String shopStatus;
    private String subscriptionStatus;
}
