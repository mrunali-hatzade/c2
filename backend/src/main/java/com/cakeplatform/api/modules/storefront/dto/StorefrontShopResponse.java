package com.cakeplatform.api.modules.storefront.dto;

import com.cakeplatform.api.modules.shop.BusinessType;
import lombok.Data;

@Data
public class StorefrontShopResponse {
    private Long id;
    private String businessName;
    private String description;
    private String businessCategory;
    private BusinessType businessType;
    private String logoUrl;
    private String coverImageUrl;
    private String phone;
    private String address;
    private String area;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String status;
    private Integer yearsInBusiness;
    private String fssaiRegistration;
    private String verificationStatus;
}
