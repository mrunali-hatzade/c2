package com.cakeplatform.api.modules.shop.dto;

import com.cakeplatform.api.modules.shop.Coupon.DiscountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponRequest {
    @NotBlank
    private String code;
    
    @NotNull
    private DiscountType discountType;
    
    @NotNull
    private BigDecimal discountValue;
    
    private BigDecimal minOrderValue;
    
    private BigDecimal maxDiscountCap;
    
    private LocalDateTime startDate;
    
    private LocalDateTime expiryDate;
    
    private Integer usageLimit;
    
    private Boolean isActive = true;
}
