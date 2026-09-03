package com.cakeplatform.api.modules.shop.controller;

import com.cakeplatform.api.modules.shop.Coupon;
import com.cakeplatform.api.modules.shop.CouponRepository;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.security.ShopAccessValidator;
import com.cakeplatform.api.modules.shop.dto.CouponRequest;
import com.cakeplatform.api.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/coupons")
@PreAuthorize("hasRole('SHOP_OWNER')")
@RequiredArgsConstructor
public class OwnerCouponController {

    private final CouponRepository couponRepository;
    private final ShopAccessValidator shopAccessValidator;

    @GetMapping
    public ResponseEntity<List<Coupon>> getCoupons(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Shop shop = shopAccessValidator.getValidShopForOwner(userDetails.getId());
        return ResponseEntity.ok(couponRepository.findByShopId(shop.getId()));
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CouponRequest request) {
            
        Shop shop = shopAccessValidator.getValidShopForOwner(userDetails.getId());
        
        // Ensure code is uppercase and unique for this shop
        String code = request.getCode().toUpperCase().trim();
        if (couponRepository.findByShopIdAndCode(shop.getId(), code).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        Coupon coupon = new Coupon();
        coupon.setShop(shop);
        coupon.setCode(code);
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderValue(request.getMinOrderValue());
        coupon.setMaxDiscountCap(request.getMaxDiscountCap());
        coupon.setStartDate(request.getStartDate());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        
        return ResponseEntity.ok(couponRepository.save(coupon));
    }
}
