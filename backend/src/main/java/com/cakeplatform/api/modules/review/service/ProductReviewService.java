package com.cakeplatform.api.modules.review.service;

import com.cakeplatform.api.modules.notification.NotificationService;
import com.cakeplatform.api.modules.notification.NotificationType;
import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderItem;
import com.cakeplatform.api.modules.order.OrderItemRepository;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.product.Product;
import com.cakeplatform.api.modules.product.ProductRepository;
import com.cakeplatform.api.modules.review.ProductReview;
import com.cakeplatform.api.modules.review.ProductReviewRepository;
import com.cakeplatform.api.modules.review.dto.*;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.ShopStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ShopRepository shopRepository;
    private final NotificationService notificationService;

    private Shop getActiveShop(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new IllegalArgumentException("Bakery not found"));
        if (shop.getStatus() != ShopStatus.ACTIVE) {
            throw new IllegalStateException("Bakery is currently unavailable");
        }
        return shop;
    }

    private String normalizePhone(String phone) {
        if (phone == null) return "";
        String clean = phone.replaceAll("\\D", "");
        if (clean.startsWith("0")) clean = clean.substring(1);
        if (clean.startsWith("91") && clean.length() == 12) clean = clean.substring(2);
        return clean;
    }

    private String getMaskedDisplayName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "Verified Customer";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0];
        return parts[0] + " " + parts[parts.length - 1].charAt(0) + ".";
    }

    @Transactional
    public PublicProductReviewResponse submitReview(Long shopId, Long productId, SubmitProductReviewRequest request) {
        // 1. Resolve & verify Shop
        Shop shop = getActiveShop(shopId);

        // 2. Resolve & verify Product belongs to Shop
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (product.getShop() == null || !product.getShop().getId().equals(shop.getId())) {
            throw new IllegalArgumentException("Product does not belong to this bakery");
        }

        // 3. Resolve & verify Order belongs to Shop
        Order order = orderRepository.findByOrderNumber(request.getOrderNumber().trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with the provided order number"));
        if (order.getShop() == null || !order.getShop().getId().equals(shop.getId())) {
            throw new IllegalArgumentException("Order does not belong to this bakery");
        }

        // 4. Verify Order Status is DELIVERED or COMPLETED
        String status = order.getOrderStatus() != null ? order.getOrderStatus().trim().toUpperCase() : "";
        if (!"DELIVERED".equals(status) && !"COMPLETED".equals(status)) {
            throw new IllegalStateException("Only delivered or completed celebration orders can be reviewed. Current status: " + status);
        }

        // 5. Verify Customer Identity via normalized phone
        String inputPhoneNorm = normalizePhone(request.getCustomerPhone());
        String orderPhoneNorm = normalizePhone(order.getCustomerPhone());
        if (!inputPhoneNorm.isEmpty() && !orderPhoneNorm.isEmpty() && !inputPhoneNorm.equals(orderPhoneNorm)) {
            throw new SecurityException("Provided customer phone number does not match the delivery record for this order");
        }

        // 6. Resolve & verify OrderItem belongs to Order
        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new IllegalArgumentException("Purchased item not found in order"));
        if (orderItem.getOrder() == null || !orderItem.getOrder().getId().equals(order.getId())) {
            throw new IllegalArgumentException("Purchased item does not belong to the specified order");
        }

        // 7. Verify OrderItem belongs to requested Product
        if (orderItem.getProduct() != null && !orderItem.getProduct().getId().equals(product.getId())) {
            throw new IllegalArgumentException("Purchased item does not match the product being reviewed");
        }

        // 8. Verify OrderItem has NOT already been reviewed
        if (productReviewRepository.existsByOrderItemId(orderItem.getId())) {
            throw new IllegalStateException("A verified review has already been submitted for this purchased cake item");
        }

        // 9. Derive Customer Name from verified Order
        String customerName = order.getCustomerName() != null && !order.getCustomerName().isBlank()
                ? order.getCustomerName().trim()
                : "Verified Customer";

        // 10. Persist Verified Review
        ProductReview review = ProductReview.builder()
                .shop(shop)
                .product(product)
                .order(order)
                .orderItem(orderItem)
                .customerName(customerName)
                .customerPhone(order.getCustomerPhone())
                .rating(request.getRating())
                .reviewText(request.getReviewText() != null ? request.getReviewText().trim() : "")
                .isVerifiedPurchase(true)
                .build();

        ProductReview saved = productReviewRepository.save(review);

        // 11. Notify Bakery Owner
        try {
            notificationService.createNotification(
                    shop.getOwner(),
                    NotificationType.NEW_FEEDBACK,
                    "New Verified Product Review",
                    "Received a " + saved.getRating() + "-star review for '" + product.getName() + "' on Order #" + order.getOrderNumber(),
                    saved.getId().toString(),
                    true
            );
        } catch (Exception ex) {
            log.warn("Failed to dispatch owner notification for review: {}", ex.getMessage());
        }

        return PublicProductReviewResponse.builder()
                .id(saved.getId())
                .customerDisplayName(getMaskedDisplayName(saved.getCustomerName()))
                .rating(saved.getRating())
                .reviewText(saved.getReviewText())
                .isVerifiedPurchase(saved.getIsVerifiedPurchase())
                .ownerReply(saved.getOwnerReply())
                .ownerRepliedAt(saved.getOwnerRepliedAt())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductReviewsSummaryResponse getProductReviewsSummary(Long shopId, Long productId) {
        getActiveShop(shopId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (product.getShop() == null || !product.getShop().getId().equals(shopId)) {
            throw new IllegalArgumentException("Product does not belong to this bakery");
        }

        List<ProductReview> reviews = productReviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        long totalCount = reviews.size();
        double avg = totalCount > 0
                ? reviews.stream().mapToInt(ProductReview::getRating).average().orElse(0.0)
                : 0.0;
        double roundedAvg = Math.round(avg * 10.0) / 10.0;

        Map<Integer, Long> breakdown = new HashMap<>();
        for (int i = 1; i <= 5; i++) breakdown.put(i, 0L);
        for (ProductReview r : reviews) {
            int rating = r.getRating() != null ? r.getRating() : 5;
            breakdown.put(rating, breakdown.getOrDefault(rating, 0L) + 1);
        }

        List<PublicProductReviewResponse> publicList = reviews.stream()
                .map(r -> PublicProductReviewResponse.builder()
                        .id(r.getId())
                        .customerDisplayName(getMaskedDisplayName(r.getCustomerName()))
                        .rating(r.getRating())
                        .reviewText(r.getReviewText())
                        .isVerifiedPurchase(r.getIsVerifiedPurchase())
                        .ownerReply(r.getOwnerReply())
                        .ownerRepliedAt(r.getOwnerRepliedAt())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ProductReviewsSummaryResponse.builder()
                .productId(productId)
                .averageRating(roundedAvg)
                .totalReviews(totalCount)
                .ratingBreakdown(breakdown)
                .reviews(publicList)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderItemEligibilityResponse> checkOrderEligibility(Long shopId, String orderNumber, String phone) {
        getActiveShop(shopId);

        Order order = orderRepository.findByOrderNumber(orderNumber.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with number: " + orderNumber));

        if (order.getShop() == null || !order.getShop().getId().equals(shopId)) {
            throw new IllegalArgumentException("Order does not belong to this bakery");
        }

        String inputPhoneNorm = normalizePhone(phone);
        String orderPhoneNorm = normalizePhone(order.getCustomerPhone());
        if (!inputPhoneNorm.isEmpty() && !orderPhoneNorm.isEmpty() && !inputPhoneNorm.equals(orderPhoneNorm)) {
            throw new SecurityException("Provided customer phone number does not match order record");
        }

        String status = order.getOrderStatus() != null ? order.getOrderStatus().trim().toUpperCase() : "";
        boolean isDelivered = "DELIVERED".equals(status) || "COMPLETED".equals(status);

        List<OrderItemEligibilityResponse> results = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                Optional<ProductReview> existing = productReviewRepository.findByOrderItemId(item.getId());
                boolean hasReviewed = existing.isPresent();

                results.add(OrderItemEligibilityResponse.builder()
                        .orderItemId(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductNameSnapshot())
                        .variantName(item.getVariantName())
                        .isDelivered(isDelivered)
                        .hasReviewed(hasReviewed)
                        .isEligible(isDelivered && !hasReviewed)
                        .existingReviewId(existing.map(ProductReview::getId).orElse(null))
                        .existingRating(existing.map(ProductReview::getRating).orElse(null))
                        .build());
            }
        }

        return results;
    }

    @Transactional(readOnly = true)
    public List<OwnerProductReviewResponse> getOwnerProductReviews(Long ownerUserId) {
        Shop shop = shopRepository.findByOwnerId(ownerUserId).stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Shop not found for authenticated owner"));

        List<ProductReview> reviews = productReviewRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());

        return reviews.stream()
                .map(r -> OwnerProductReviewResponse.builder()
                        .id(r.getId())
                        .productId(r.getProduct() != null ? r.getProduct().getId() : null)
                        .productName(r.getProduct() != null ? r.getProduct().getName() : (r.getOrderItem() != null ? r.getOrderItem().getProductNameSnapshot() : "Artisanal Cake"))
                        .productImage(r.getProduct() != null ? r.getProduct().getImageUrl() : null)
                        .orderNumber(r.getOrder() != null ? r.getOrder().getOrderNumber() : "N/A")
                        .customerName(r.getCustomerName())
                        .rating(r.getRating())
                        .reviewText(r.getReviewText())
                        .isVerifiedPurchase(r.getIsVerifiedPurchase())
                        .ownerReply(r.getOwnerReply())
                        .ownerRepliedAt(r.getOwnerRepliedAt())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public OwnerProductReviewResponse replyToProductReview(Long ownerUserId, Long reviewId, OwnerReviewReplyRequest request) {
        Shop shop = shopRepository.findByOwnerId(ownerUserId).stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Shop not found for authenticated owner"));

        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Strict multi-tenant verification: review must belong to owner's shop
        if (review.getShop() == null || !review.getShop().getId().equals(shop.getId())) {
            throw new SecurityException("Unauthorized: Review does not belong to your bakery");
        }

        review.setOwnerReply(request.getReply().trim());
        review.setOwnerRepliedAt(LocalDateTime.now());
        ProductReview updated = productReviewRepository.save(review);

        return OwnerProductReviewResponse.builder()
                .id(updated.getId())
                .productId(updated.getProduct() != null ? updated.getProduct().getId() : null)
                .productName(updated.getProduct() != null ? updated.getProduct().getName() : "Artisanal Cake")
                .productImage(updated.getProduct() != null ? updated.getProduct().getImageUrl() : null)
                .orderNumber(updated.getOrder() != null ? updated.getOrder().getOrderNumber() : "N/A")
                .customerName(updated.getCustomerName())
                .rating(updated.getRating())
                .reviewText(updated.getReviewText())
                .isVerifiedPurchase(updated.getIsVerifiedPurchase())
                .ownerReply(updated.getOwnerReply())
                .ownerRepliedAt(updated.getOwnerRepliedAt())
                .createdAt(updated.getCreatedAt())
                .build();
    }
}
