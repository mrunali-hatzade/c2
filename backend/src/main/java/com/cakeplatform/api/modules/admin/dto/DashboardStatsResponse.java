package com.cakeplatform.api.modules.admin.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DashboardStatsResponse {
    private long totalShops;
    private long activeShops;
    private long suspendedShops;
    private long pendingShops;
    private long totalUsers;
    private BigDecimal totalRevenue;
}
