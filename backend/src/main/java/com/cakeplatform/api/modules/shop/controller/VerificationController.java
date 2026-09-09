package com.cakeplatform.api.modules.shop.controller;

import com.cakeplatform.api.modules.shop.BusinessDocument;
import com.cakeplatform.api.modules.shop.dto.DocumentUploadRequest;
import com.cakeplatform.api.modules.shop.service.VerificationService;
import com.cakeplatform.api.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/documents")
    public ResponseEntity<BusinessDocument> uploadDocument(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody DocumentUploadRequest request) {
        return ResponseEntity.ok(verificationService.uploadDocument(userDetails.getId(), request));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<BusinessDocument>> getMyDocuments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(verificationService.getMyDocuments(userDetails.getId()));
    }

    @GetMapping("/status")
    public ResponseEntity<java.util.Map<String, Object>> getVerificationStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(verificationService.getVerificationStatus(userDetails.getId()));
    }
}
