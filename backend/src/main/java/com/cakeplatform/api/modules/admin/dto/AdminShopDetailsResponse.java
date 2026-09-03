package com.cakeplatform.api.modules.admin.dto;

import com.cakeplatform.api.modules.audit.ActivityLog;
import com.cakeplatform.api.modules.payment.Payment;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.subscription.Subscription;
import lombok.Data;

import java.util.List;

@Data
public class AdminShopDetailsResponse {
    private Shop shop;
    private List<Subscription> subscriptions;
    private List<Payment> payments;
    private List<ActivityLog> activityLogs;
    private long totalProducts;
    private long totalOrders;
}
