package com.cakeplatform.api.modules.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewsSummaryResponse {
    private Long productId;
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> ratingBreakdown;
    private List<PublicProductReviewResponse> reviews;
}
