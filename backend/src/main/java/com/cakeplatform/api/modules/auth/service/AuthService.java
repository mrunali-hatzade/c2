package com.cakeplatform.api.modules.auth.service;

import com.cakeplatform.api.modules.auth.dto.AuthResponse;
import com.cakeplatform.api.modules.auth.dto.LoginRequest;
import com.cakeplatform.api.modules.auth.dto.RegisterRequest;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.ShopStatus;
import com.cakeplatform.api.modules.user.User;
import com.cakeplatform.api.modules.user.UserRepository;
import com.cakeplatform.api.modules.user.UserRole;
import com.cakeplatform.api.modules.user.UserStatus;
import com.cakeplatform.api.security.CustomUserDetails;
import com.cakeplatform.api.security.JwtService;
import com.cakeplatform.api.modules.media.MediaUploadService;
import com.cakeplatform.api.modules.shop.BusinessDocument;
import com.cakeplatform.api.modules.shop.BusinessDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final com.cakeplatform.api.modules.subscription.SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MediaUploadService mediaUploadService;
    private final BusinessDocumentRepository businessDocumentRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // 1. Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setMobile(request.getMobile());
        user.setRole(UserRole.SHOP_OWNER);
        user.setStatus(UserStatus.ACTIVE);
        
        User savedUser = userRepository.save(user);

        // 2. Create Shop (PENDING)
        Shop shop = new Shop();
        shop.setOwner(savedUser);
        shop.setBusinessName(request.getBusinessName());
        
        // Use provided business phone/email or fallback to user's
        shop.setPhone(request.getBusinessPhone() != null ? request.getBusinessPhone() : request.getMobile());
        shop.setEmail(request.getBusinessEmail() != null ? request.getBusinessEmail() : request.getEmail());
        
        shop.setDescription(request.getBusinessDescription());
        shop.setYearsInBusiness(request.getYearsInBusiness());
        shop.setFssaiRegistration(request.getFssaiRegistration());
        
        try {
            if (request.getBusinessType() != null) {
                shop.setBusinessType(com.cakeplatform.api.modules.shop.BusinessType.valueOf(request.getBusinessType().toUpperCase()));
            }
        } catch (IllegalArgumentException e) {
            // ignore or log
        }
        
        shop.setAddressLine1(request.getAddressLine1());
        shop.setAddressLine2(request.getAddressLine2());
        shop.setArea(request.getArea());
        shop.setCity(request.getCity());
        shop.setDistrict(request.getDistrict());
        shop.setState(request.getState());
        shop.setPincode(request.getPincode());
        shop.setLatitude(request.getLatitude());
        shop.setLongitude(request.getLongitude());
        
        // Also combine into existing full address field for backward compatibility
        String fullAddress = request.getAddressLine1();
        if (request.getAddressLine2() != null && !request.getAddressLine2().isEmpty()) {
            fullAddress += ", " + request.getAddressLine2();
        }
        shop.setAddress(fullAddress);
        
        shop.setStatus(ShopStatus.PENDING); // Explicitly set to PENDING
        shop.setVerificationStatus(com.cakeplatform.api.modules.shop.VerificationStatus.PROCESSING);

        shopRepository.save(shop);

        // 3. Process Verification Document
        if (request.getVerificationFile() != null && !request.getVerificationFile().isEmpty()) {
            String fileUrl = mediaUploadService.storeFile(request.getVerificationFile(), "verifications");
            
            BusinessDocument doc = new BusinessDocument();
            doc.setShop(shop);
            doc.setDocumentType(com.cakeplatform.api.modules.shop.DocumentType.FSSAI_CERTIFICATE);
            doc.setFileUrl(fileUrl);
            doc.setStatus(com.cakeplatform.api.modules.shop.VerificationStatus.PROCESSING);
            
            businessDocumentRepository.save(doc);
        }

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .fullName(savedUser.getFullName())
                .shopStatus(shop.getStatus().name())
                .subscriptionStatus("NONE")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
                
        // Fetch shop status for the response
        List<Shop> shops = shopRepository.findByOwnerId(user.getId());
        String shopStatus = null;
        String subscriptionStatus = "NONE";
        
        if (!shops.isEmpty()) {
            shopStatus = shops.get(0).getStatus().name();
            var latestSub = subscriptionRepository.findFirstByShopIdOrderByCreatedAtDesc(shops.get(0).getId());
            if (latestSub.isPresent()) {
                subscriptionStatus = latestSub.get().getStatus().name();
            }
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .shopStatus(shopStatus)
                .subscriptionStatus(subscriptionStatus)
                .build();
    }

    @Transactional
    public String makeAdmin(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(UserRole.ADMIN);
        userRepository.save(user);
        return "User " + email + " is now an ADMIN!";
    }
}
