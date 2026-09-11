package com.cakeplatform.api.modules.communication.controller;

import com.cakeplatform.api.modules.communication.ContactEnquiry;
import com.cakeplatform.api.modules.communication.ContactEnquiryService;
import com.cakeplatform.api.modules.communication.dto.CreateContactEnquiryRequest;
import com.cakeplatform.api.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact/enquiries")
@RequiredArgsConstructor
@Slf4j
public class PublicContactController {

    private final ContactEnquiryService enquiryService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitEnquiry(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateContactEnquiryRequest request) {

        Long userId = userDetails != null ? userDetails.getId() : null;
        log.info("Public contact enquiry received from: {} ({}), authenticated user: {}",
                request.getName(), request.getEmail(), userId);

        ContactEnquiry enquiry = enquiryService.submitEnquiry(request, userId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Contact enquiry submitted successfully",
                "id", enquiry.getId()
        ));
    }
}
