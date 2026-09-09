package com.cakeplatform.api.modules.product.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    private String name;
    
    private String description;
    
    @NotNull
    private BigDecimal price;
    
    private String imageUrl;
    
    private Boolean availability = true;
    
    private Long categoryId;
    
    private java.util.List<VariantDto> variants;
    private java.util.List<AddonDto> addons;

    @Data
    public static class VariantDto {
        private Long id; // Optional, for updates
        @NotBlank private String name;
        @NotNull private BigDecimal price;
        private Boolean isAvailable = true;
    }

    @Data
    public static class AddonDto {
        private Long id; // Optional, for updates
        @NotBlank private String name;
        @NotNull private BigDecimal price;
        private Boolean isAvailable = true;
    }
}
