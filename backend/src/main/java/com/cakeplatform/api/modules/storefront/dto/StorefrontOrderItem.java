package com.cakeplatform.api.modules.storefront.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StorefrontOrderItem {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private Long variantId;
    private String dietaryPreference; // EGGLESS, SUGAR_FREE
    private String cakeMessage;
    private String photoReferenceUrl;
    private java.util.List<Long> addonIds;
}
