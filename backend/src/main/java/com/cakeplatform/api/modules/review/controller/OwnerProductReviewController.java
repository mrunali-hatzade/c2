package com.cakeplatform.api.modules.review.controller;

import com.cakeplatform.api.modules.review.dto.OwnerProductReviewResponse;
import com.cakeplatform.api.modules.review.dto.OwnerReviewReplyRequest;
import com.cakeplatform.api.modules.review.service.ProductReviewService;
import com.cakeplatform.api.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/product-reviews")
@PreAuthorize("hasRole('SHOP_OWNER')")
@RequiredArgsConstructor
public class OwnerProductReviewController {

    private final ProductReviewService productReviewService;

    @GetMapping
    public ResponseEntity<List<OwnerProductReviewResponse>> getMyProductReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(productReviewService.getOwnerProductReviews(userDetails.getId()));
    }

    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<OwnerProductReviewResponse> replyToProductReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody OwnerReviewReplyRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(productReviewService.replyToProductReview(userDetails.getId(), reviewId, request));
    }
}
