package com.cakeplatform.api.modules.product.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private Long shopId;
    private String name;
    private String slug;
    private Integer displayOrder;
    private Long productCount;
    private LocalDateTime createdAt;
}
