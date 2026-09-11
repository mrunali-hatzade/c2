package com.cakeplatform.api.modules.review.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OwnerReviewReplyRequest {
    @NotBlank(message = "Reply text is required")
    @Size(max = 1000, message = "Reply cannot exceed 1000 characters")
    private String reply;
}
