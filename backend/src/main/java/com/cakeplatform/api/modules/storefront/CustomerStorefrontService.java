package com.cakeplatform.api.modules.storefront;

import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderItem;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.product.Product;
import com.cakeplatform.api.modules.product.ProductRepository;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.ShopStatus;
import com.cakeplatform.api.modules.storefront.dto.GuestOrderRequest;
import com.cakeplatform.api.modules.storefront.dto.StorefrontShopResponse;
import com.cakeplatform.api.modules.storefront.dto.StorefrontOrderItem;
import com.cakeplatform.api.modules.storefront.dto.StorefrontDeliverySlotResponse;
import com.cakeplatform.api.modules.storefront.dto.ValidateCouponRequest;
import com.cakeplatform.api.modules.storefront.dto.ValidateCouponResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerStorefrontService {

    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final com.cakeplatform.api.modules.shop.CouponRepository couponRepository;
    private final com.cakeplatform.api.modules.notification.NotificationService notificationService;
    private final com.cakeplatform.api.modules.interaction.CustomCakeRequestRepository customCakeRequestRepository;
    private final com.cakeplatform.api.modules.product.ProductCategoryRepository categoryRepository;

    private Shop getActiveShop(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        if (shop.getStatus() != ShopStatus.ACTIVE) {
            throw new RuntimeException("Shop is currently unavailable");
        }
        return shop;
    }

    @org.springframework.cache.annotation.Cacheable(value = "shopDetails", key = "#shopId")
    public StorefrontShopResponse getShopDetails(Long shopId) {
        Shop shop = getActiveShop(shopId);
        return mapToStorefrontShopResponse(shop);
    }

    public List<StorefrontShopResponse> searchShops(
            String state,
            String district,
            String city,
            String area,
            com.cakeplatform.api.modules.shop.BusinessType businessType,
            String search,
            String location
    ) {
        org.springframework.data.jpa.domain.Specification<Shop> spec =
                com.cakeplatform.api.modules.shop.ShopSpecification.filterShops(
                        state, district, city, area, businessType, search, location
                );
        return shopRepository.findAll(spec)
                .stream()
                .map(this::mapToStorefrontShopResponse)
                .collect(Collectors.toList());
    }

    public List<StorefrontShopResponse> searchShopsByLocation(String location) {
        return searchShops(null, null, null, null, null, null, location);
    }

    public List<com.cakeplatform.api.modules.product.dto.CategoryResponse> getShopCategories(Long shopId) {
        getActiveShop(shopId);
        return categoryRepository.findNonEmptyByShopId(shopId);
    }

    private StorefrontShopResponse mapToStorefrontShopResponse(Shop shop) {
        StorefrontShopResponse response = new StorefrontShopResponse();
        response.setId(shop.getId());
        response.setBusinessName(shop.getBusinessName());
        response.setDescription(shop.getDescription());
        response.setBusinessCategory(shop.getBusinessCategory());
        response.setBusinessType(shop.getBusinessType());
        response.setLogoUrl(shop.getLogoUrl());
        response.setCoverImageUrl(shop.getCoverImageUrl());
        response.setPhone(shop.getPhone());
        response.setAddress(shop.getAddress());
        response.setArea(shop.getArea());
        response.setCity(shop.getCity());
        response.setDistrict(shop.getDistrict());
        response.setState(shop.getState());
        response.setPincode(shop.getPincode());
        response.setLatitude(shop.getLatitude());
        response.setLongitude(shop.getLongitude());
        response.setStatus(shop.getStatus() != null ? shop.getStatus().name() : null);
        response.setYearsInBusiness(shop.getYearsInBusiness());
        response.setFssaiRegistration(shop.getFssaiRegistration());
        response.setVerificationStatus(shop.getVerificationStatus() != null ? shop.getVerificationStatus().name() : null);
        return response;
    }


    public List<StorefrontDeliverySlotResponse> getShopDeliverySlots(Long shopId) {
        Shop shop = getActiveShop(shopId);
        return shop.getDeliverySlots().stream()
                .filter(com.cakeplatform.api.modules.shop.ShopDeliverySlot::getIsActive)
                .map(slot -> {
                    StorefrontDeliverySlotResponse response = new StorefrontDeliverySlotResponse();
                    response.setId(slot.getId());
                    response.setDayOfWeek(slot.getDayOfWeek());
                    response.setStartTime(slot.getStartTime());
                    response.setEndTime(slot.getEndTime());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @org.springframework.cache.annotation.Cacheable(value = "shopProducts", key = "#shopId")
    public List<Product> getShopProducts(Long shopId) {
        // Enforce active shop check
        getActiveShop(shopId);
        
        // Return only active products for the storefront
        return productRepository.findByShopId(shopId).stream()
                .filter(p -> p.getAvailability() && "ACTIVE".equals(p.getStatus()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Order placeGuestOrder(Long shopId, GuestOrderRequest request) {
        Shop shop = getActiveShop(shopId);
        
        com.cakeplatform.api.modules.shop.ShopDeliverySlot slot = null;
        if (request.getDeliverySlotId() != null) {
            slot = shop.getDeliverySlots().stream()
                .filter(s -> s.getId().equals(request.getDeliverySlotId()) && s.getIsActive())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid or inactive delivery slot"));
                
            // In a real production system, you'd check orderRepository.countByDeliveryDateAndSlot(request.getDeliveryDate(), slot.getId())
            // and compare it against slot.getMaxOrders().
        }

        Order order = new Order();
        order.setShop(shop);
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setPaymentStatus("PENDING");
        order.setOrderStatus("NEW");
        order.setDeliveryDate(request.getDeliveryDate());
        order.setDeliverySlot(slot);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (StorefrontOrderItem itemRequest : request.getItems()) {
            Product product = productRepository.findByIdAndShopId(itemRequest.getProductId(), shopId)
                    .orElseThrow(() -> new RuntimeException("Product not found or does not belong to shop"));

            if (!product.getAvailability() || !"ACTIVE".equals(product.getStatus())) {
                throw new RuntimeException("Product " + product.getName() + " is currently unavailable");
            }
            
            BigDecimal basePrice = product.getPrice();
            String variantName = null;
            
            if (itemRequest.getVariantId() != null) {
                com.cakeplatform.api.modules.product.ProductVariant variant = product.getVariants().stream()
                    .filter(v -> v.getId().equals(itemRequest.getVariantId()) && v.getIsAvailable())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Variant unavailable"));
                basePrice = variant.getPrice();
                variantName = variant.getName();
            }
            
            // Addon processing
            BigDecimal addonsTotal = BigDecimal.ZERO;
            StringBuilder addonsSummary = new StringBuilder();
            if (itemRequest.getAddonIds() != null && !itemRequest.getAddonIds().isEmpty()) {
                for (Long addonId : itemRequest.getAddonIds()) {
                    com.cakeplatform.api.modules.product.ProductAddon addon = product.getAddons().stream()
                        .filter(a -> a.getId().equals(addonId) && a.getIsAvailable())
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Addon unavailable"));
                    addonsTotal = addonsTotal.add(addon.getPrice());
                    if (addonsSummary.length() > 0) addonsSummary.append(", ");
                    addonsSummary.append(addon.getName()).append(" (+$").append(addon.getPrice()).append(")");
                }
            }

            // Dietary upcharge (Hardcoded logic for MVP, normally this is database driven)
            BigDecimal dietaryUpcharge = BigDecimal.ZERO;
            if ("EGGLESS".equalsIgnoreCase(itemRequest.getDietaryPreference())) {
                dietaryUpcharge = BigDecimal.valueOf(5.00); // e.g. $5 extra for eggless
            } else if ("GLUTEN_FREE".equalsIgnoreCase(itemRequest.getDietaryPreference())) {
                dietaryUpcharge = BigDecimal.valueOf(10.00);
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductNameSnapshot(product.getName());
            
            BigDecimal unitPrice = basePrice.add(addonsTotal).add(dietaryUpcharge);
            orderItem.setUnitPrice(unitPrice);
            orderItem.setQuantity(itemRequest.getQuantity());
            
            orderItem.setVariantName(variantName);
            orderItem.setDietaryPreference(itemRequest.getDietaryPreference());
            orderItem.setCakeMessage(itemRequest.getCakeMessage());
            orderItem.setPhotoReferenceUrl(itemRequest.getPhotoReferenceUrl());
            orderItem.setAddonsSummary(addonsSummary.toString());

            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            orderItem.setTotalPrice(itemTotal);
            subtotal = subtotal.add(itemTotal);

            order.getItems().add(orderItem);
        }

        order.setSubtotal(subtotal);
        order.setDeliveryCharge(BigDecimal.valueOf(50.00)); // Flat delivery charge for MVP
        
        BigDecimal discount = BigDecimal.ZERO;
        
        // Coupon Validation & Atomic Concurrency Update
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            String cleanCode = request.getCouponCode().trim().toUpperCase();
            com.cakeplatform.api.modules.shop.Coupon coupon = couponRepository.findByShopIdAndCodeIgnoreCase(shopId, cleanCode)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));
                
            if (!Boolean.TRUE.equals(coupon.getIsActive())) {
                throw new RuntimeException("Coupon is inactive");
            }
            
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            if (coupon.getStartDate() != null && coupon.getStartDate().isAfter(now)) {
                throw new RuntimeException("Coupon is not active yet");
            }
            
            if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(now)) {
                throw new RuntimeException("Coupon has expired");
            }
            
            if (coupon.getMinOrderValue() != null && subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
                throw new RuntimeException("Minimum order value of ₹" + coupon.getMinOrderValue() + " required for this coupon");
            }
            
            // Server-side Authoritative Discount Calculation
            if (coupon.getDiscountType() == com.cakeplatform.api.modules.shop.Coupon.DiscountType.FLAT) {
                discount = coupon.getDiscountValue();
            } else if (coupon.getDiscountType() == com.cakeplatform.api.modules.shop.Coupon.DiscountType.PERCENTAGE) {
                discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                if (coupon.getMaxDiscountCap() != null && discount.compareTo(coupon.getMaxDiscountCap()) > 0) {
                    discount = coupon.getMaxDiscountCap();
                }
            }
            
            if (discount.compareTo(subtotal) > 0) {
                discount = subtotal;
            }
            if (discount.compareTo(BigDecimal.ZERO) < 0) {
                discount = BigDecimal.ZERO;
            }

            // Atomic Concurrency Protection: Increment used_count only if within usage_limit
            int updated = couponRepository.incrementUsedCountIfWithinLimit(coupon.getId());
            if (updated == 0) {
                throw new RuntimeException("Coupon usage limit reached");
            }
            
            order.setCouponCode(coupon.getCode());
        }
        
        // Ensure discount doesn't exceed subtotal
        if (discount.compareTo(subtotal) > 0) discount = subtotal;
        if (discount.compareTo(BigDecimal.ZERO) < 0) discount = BigDecimal.ZERO;
        
        order.setDiscountAmount(discount);
        BigDecimal calculatedTotal = subtotal.subtract(discount).add(order.getDeliveryCharge());
        if (calculatedTotal.compareTo(BigDecimal.ZERO) < 0) {
            calculatedTotal = BigDecimal.ZERO;
        }
        order.setTotalAmount(calculatedTotal);

        Order savedOrder = orderRepository.save(order);

        // Send Notification
        notificationService.createNotification(
                shop.getOwner(),
                com.cakeplatform.api.modules.notification.NotificationType.NEW_ORDER,
                "New Order Received!",
                "You have received a new order (" + savedOrder.getOrderNumber() + ") from " + savedOrder.getCustomerName(),
                savedOrder.getId().toString(),
                true
        );
        
        // Send SMS to Customer
        try {
            org.springframework.web.context.request.RequestAttributes attrs = org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
            if (attrs instanceof org.springframework.web.context.request.ServletRequestAttributes servletAttrs) {
                com.cakeplatform.api.modules.notification.SmsService smsService = org.springframework.web.context.support.WebApplicationContextUtils
                    .getRequiredWebApplicationContext(servletAttrs.getRequest().getServletContext())
                    .getBean(com.cakeplatform.api.modules.notification.SmsService.class);
                if (smsService != null) {
                    smsService.sendSms(savedOrder.getCustomerPhone(), "Hi " + savedOrder.getCustomerName() + ", your Cake Platform order " + savedOrder.getOrderNumber() + " has been received! 🎂");
                }
            }
        } catch (Exception ignored) {
            // Non-blocking SMS dispatch
        }

        return savedOrder;
    }

    public Order getGuestOrder(String orderNumber) {
        return orderRepository.findAll().stream()
                .filter(o -> orderNumber.equals(o.getOrderNumber()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found or invalid order number"));
    }

    public Product getShopProductDetails(Long shopId, Long productId) {
        Shop shop = getActiveShop(shopId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getShop() == null || !product.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Product does not belong to this bakery");
        }

        if (!Boolean.TRUE.equals(product.getAvailability()) || !"ACTIVE".equalsIgnoreCase(product.getStatus())) {
            throw new RuntimeException("Product is currently unavailable");
        }

        return product;
    }

    @Transactional
    public com.cakeplatform.api.modules.interaction.CustomCakeRequest submitProductEnquiry(com.cakeplatform.api.modules.storefront.dto.ProductEnquiryRequest request) {
        Shop shop = getActiveShop(request.getShopId());

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getShop() == null || !product.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Product does not belong to this bakery");
        }

        if (!Boolean.TRUE.equals(product.getAvailability()) || !"ACTIVE".equalsIgnoreCase(product.getStatus())) {
            throw new RuntimeException("Product is currently unavailable");
        }

        com.cakeplatform.api.modules.interaction.CustomCakeRequest cakeRequest = new com.cakeplatform.api.modules.interaction.CustomCakeRequest();
        cakeRequest.setShop(shop);
        cakeRequest.setCustomerName(request.getCustomerName().trim());
        cakeRequest.setCustomerEmail(request.getCustomerEmail().trim());
        cakeRequest.setCustomerMobile(request.getCustomerPhone().trim());
        cakeRequest.setCakeType(product.getName());
        int servings = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;
        cakeRequest.setServings(servings);
        if (product.getPrice() != null) {
            cakeRequest.setBudget(product.getPrice().multiply(BigDecimal.valueOf(servings)));
        }
        cakeRequest.setRequiredDate(request.getPreferredDate());
        cakeRequest.setReferenceImageUrl(product.getImageUrl());

        StringBuilder noteBuilder = new StringBuilder();
        noteBuilder.append("Product Enquiry for '").append(product.getName()).append("' (Product ID: ").append(product.getId()).append(")");
        if (request.getMessage() != null && !request.getMessage().isBlank()) {
            noteBuilder.append("\nCustomer Note: ").append(request.getMessage().trim());
        }
        cakeRequest.setDesignDescription(noteBuilder.toString());
        cakeRequest.setStatus("PENDING");

        com.cakeplatform.api.modules.interaction.CustomCakeRequest saved = customCakeRequestRepository.save(cakeRequest);

        try {
            notificationService.createNotification(
                    shop.getOwner(),
                    com.cakeplatform.api.modules.notification.NotificationType.CUSTOM_ORDER_REQUEST,
                    "Product Cake Enquiry",
                    "New enquiry received for '" + product.getName() + "' from " + request.getCustomerName(),
                    saved.getId().toString(),
                    true
            );
        } catch (Exception ignored) {
            // Do not abort customer enquiry if owner notification dispatch fails
        }

        return saved;
    }

    public ValidateCouponResponse validateCouponForStorefront(Long shopId, ValidateCouponRequest request) {
        if (request == null || request.getCode() == null || request.getCode().isBlank()) {
            return ValidateCouponResponse.builder()
                    .valid(false)
                    .message("Coupon code is required")
                    .discountAmount(BigDecimal.ZERO)
                    .build();
        }

        getActiveShop(shopId);

        BigDecimal subtotal = request.getSubtotal() != null ? request.getSubtotal() : BigDecimal.ZERO;
        String cleanCode = request.getCode().trim().toUpperCase();

        var couponOpt = couponRepository.findByShopIdAndCodeIgnoreCase(shopId, cleanCode);
        if (couponOpt.isEmpty()) {
            return ValidateCouponResponse.builder()
                    .valid(false)
                    .code(cleanCode)
                    .discountAmount(BigDecimal.ZERO)
                    .message("Invalid coupon code")
                    .build();
        }

        com.cakeplatform.api.modules.shop.Coupon coupon = couponOpt.get();

        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            return ValidateCouponResponse.builder()
                    .valid(false)
                    .code(coupon.getCode())
                    .discountAmount(BigDecimal.ZERO)
                    .message("Coupon is inactive")
                    .build();
        }

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (coupon.getStartDate() != null && coupon.getStartDate().isAfter(now)) {
            return ValidateCouponResponse.builder()
                    .valid(false)
                    .code(coupon.getCode())
                    .discountAmount(BigDecimal.ZERO)
                    .message("Coupon is not active yet")
                    .build();
        }

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(now)) {
            return ValidateCouponResponse.builder()
                    .valid(false)
                    .code(coupon.getCode())
                    .discountAmount(BigDecimal.ZERO)
                    .message("Coupon has expired")
                    .build();
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return ValidateCouponResponse.builder()
                    .valid(false)
                    .code(coupon.getCode())
                    .discountAmount(BigDecimal.ZERO)
                    .message("Coupon usage limit reached")
                    .build();
        }

        if (coupon.getMinOrderValue() != null && subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
            return ValidateCouponResponse.builder()
                    .valid(false)
                    .code(coupon.getCode())
                    .discountAmount(BigDecimal.ZERO)
                    .minOrderValue(coupon.getMinOrderValue())
                    .message("Minimum order value of ₹" + coupon.getMinOrderValue() + " required")
                    .build();
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (coupon.getDiscountType() == com.cakeplatform.api.modules.shop.Coupon.DiscountType.FLAT) {
            discount = coupon.getDiscountValue();
        } else if (coupon.getDiscountType() == com.cakeplatform.api.modules.shop.Coupon.DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountCap() != null && discount.compareTo(coupon.getMaxDiscountCap()) > 0) {
                discount = coupon.getMaxDiscountCap();
            }
        }

        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            discount = BigDecimal.ZERO;
        }

        BigDecimal newSubtotal = subtotal.subtract(discount);
        if (newSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            newSubtotal = BigDecimal.ZERO;
        }

        return ValidateCouponResponse.builder()
                .valid(true)
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType().name())
                .discountValue(coupon.getDiscountValue())
                .discountAmount(discount)
                .minOrderValue(coupon.getMinOrderValue())
                .maxDiscountCap(coupon.getMaxDiscountCap())
                .newSubtotal(newSubtotal)
                .message("Coupon applied successfully")
                .build();
    }
}
