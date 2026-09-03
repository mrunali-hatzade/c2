package com.cakeplatform.api.modules.storefront.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class StorefrontDeliverySlotResponse {
    private Long id;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
