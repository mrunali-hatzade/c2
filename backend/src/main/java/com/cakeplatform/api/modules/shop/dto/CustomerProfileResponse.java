package com.cakeplatform.api.modules.shop.dto;

import com.cakeplatform.api.modules.order.Order;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CustomerProfileResponse {
    private String name;
    private String email;
    private String mobile;
    private String address;
    private long totalOrders;
    private BigDecimal totalSpent;
    private LocalDateTime lastOrderDate;
    private List<Order> orderHistory;
}
