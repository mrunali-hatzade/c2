package com.cakeplatform.api.modules.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OwnerPaymentResponse {
    private Long id;
    private BigDecimal amount;
    private String currency;
    private String provider;
    private String providerOrderId;
    private String providerPaymentId;
    private String status;
    private String failureReason;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private String subscriptionPlanName;
    private boolean invoiceAvailable;
}
