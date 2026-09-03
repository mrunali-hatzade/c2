package com.cakeplatform.api.modules.storefront;

import com.cakeplatform.api.modules.interaction.CustomCakeRequest;
import com.cakeplatform.api.modules.storefront.dto.ProductEnquiryRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/storefront/enquiries")
@RequiredArgsConstructor
public class CustomerStorefrontEnquiryController {

    private final CustomerStorefrontService storefrontService;

    @PostMapping
    public ResponseEntity<CustomCakeRequest> submitEnquiry(@Valid @RequestBody ProductEnquiryRequest request) {
        return ResponseEntity.ok(storefrontService.submitProductEnquiry(request));
    }
}
