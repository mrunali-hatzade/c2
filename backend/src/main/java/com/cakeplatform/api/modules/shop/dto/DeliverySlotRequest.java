package com.cakeplatform.api.modules.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class DeliverySlotRequest {
    @NotBlank
    private String dayOfWeek;
    
    @NotNull
    private LocalTime startTime;
    
    @NotNull
    private LocalTime endTime;
    
    private Integer maxOrders = 10;
    
    private Boolean isActive = true;
}
