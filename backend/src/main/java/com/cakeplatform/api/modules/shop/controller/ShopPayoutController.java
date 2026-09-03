package com.cakeplatform.api.modules.shop.controller;

import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopPayoutDetails;
import com.cakeplatform.api.modules.shop.ShopPayoutDetailsRepository;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shops/my-shop/payouts")
@RequiredArgsConstructor
public class ShopPayoutController {

    private final ShopRepository shopRepository;
    private final ShopPayoutDetailsRepository payoutRepository;

    @GetMapping
    public ResponseEntity<ShopPayoutDetails> getPayoutDetails(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Shop shop = shopRepository.findByOwnerId(userDetails.getId()).stream().findFirst().orElseThrow();
        return payoutRepository.findByShopId(shop.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ShopPayoutDetails> updatePayoutDetails(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ShopPayoutDetails updates) {
        
        Shop shop = shopRepository.findByOwnerId(userDetails.getId()).stream().findFirst().orElseThrow();
        
        ShopPayoutDetails details = payoutRepository.findByShopId(shop.getId()).orElse(new ShopPayoutDetails());
        details.setShop(shop);
        
        if (updates.getBankAccountNumber() != null) details.setBankAccountNumber(updates.getBankAccountNumber());
        if (updates.getIfscCode() != null) details.setIfscCode(updates.getIfscCode());
        if (updates.getBeneficiaryName() != null) details.setBeneficiaryName(updates.getBeneficiaryName());
        if (updates.getUpiId() != null) details.setUpiId(updates.getUpiId());
        
        // Mock generation of Razorpay Account ID if they provided bank details
        if (details.getRazorpayAccountId() == null && details.getBankAccountNumber() != null) {
            details.setRazorpayAccountId("acc_mock_" + System.currentTimeMillis());
        }
        
        return ResponseEntity.ok(payoutRepository.save(details));
    }
}
