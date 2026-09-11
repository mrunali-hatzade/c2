package com.cakeplatform.api.modules.review.controller;

import com.cakeplatform.api.modules.review.dto.OrderItemEligibilityResponse;
import com.cakeplatform.api.modules.review.dto.ProductReviewsSummaryResponse;
import com.cakeplatform.api.modules.review.dto.PublicProductReviewResponse;
import com.cakeplatform.api.modules.review.dto.SubmitProductReviewRequest;
import com.cakeplatform.api.modules.review.service.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storefront/shops/{shopId}")
@RequiredArgsConstructor
public class CustomerProductReviewController {

    private final ProductReviewService productReviewService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<ProductReviewsSummaryResponse> getProductReviews(
            @PathVariable Long shopId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(productReviewService.getProductReviewsSummary(shopId, productId));
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<PublicProductReviewResponse> submitProductReview(
            @PathVariable Long shopId,
            @PathVariable Long productId,
            @Valid @RequestBody SubmitProductReviewRequest request) {
        return ResponseEntity.ok(productReviewService.submitReview(shopId, productId, request));
    }

    @GetMapping("/reviews/eligibility")
    public ResponseEntity<List<OrderItemEligibilityResponse>> checkEligibility(
            @PathVariable Long shopId,
            @RequestParam String orderNumber,
            @RequestParam(required = false, defaultValue = "") String phone) {
        return ResponseEntity.ok(productReviewService.checkOrderEligibility(shopId, orderNumber, phone));
    }
}
