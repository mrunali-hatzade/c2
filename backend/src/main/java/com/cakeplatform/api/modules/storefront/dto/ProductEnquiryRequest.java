package com.cakeplatform.api.modules.storefront.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProductEnquiryRequest {

    @NotNull(message = "Shop ID is required")
    private Long shopId;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email address format")
    private String customerEmail;

    @Positive(message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private LocalDate preferredDate;

    private String message;
}
