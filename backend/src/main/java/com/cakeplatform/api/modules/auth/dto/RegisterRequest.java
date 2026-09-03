package com.cakeplatform.api.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotBlank(message = "Business name is required")
    private String businessName;

    // New Fields for Phase 1 Registration
    private String businessType;
    private String businessDescription;
    private String businessPhone;
    private String businessEmail;
    private Integer yearsInBusiness;
    private String fssaiRegistration;
    
    // Address fields
    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;
    
    private String addressLine2;
    private String area;
    
    @NotBlank(message = "City is required")
    private String city;
    
    private String district;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Pincode is required")
    private String pincode;
    
    private Double latitude;
    private Double longitude;

    private org.springframework.web.multipart.MultipartFile verificationFile;
}
