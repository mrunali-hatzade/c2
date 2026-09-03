package com.cakeplatform.api.modules.shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DocumentUploadRequest {
    @NotBlank(message = "Document type is required")
    private String documentType;
    
    @NotBlank(message = "File URL is required")
    private String fileUrl;
}
