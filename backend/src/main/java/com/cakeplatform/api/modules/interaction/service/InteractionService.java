package com.cakeplatform.api.modules.interaction.service;

import com.cakeplatform.api.modules.interaction.*;
import com.cakeplatform.api.modules.interaction.dto.*;
import com.cakeplatform.api.modules.notification.NotificationService;
import com.cakeplatform.api.modules.notification.NotificationType;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.ShopStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final FeedbackRepository feedbackRepository;
    private final EnquiryRepository enquiryRepository;
    private final CustomCakeRequestRepository customCakeRequestRepository;
    private final ShopRepository shopRepository;
    private final NotificationService notificationService;

    private Shop getActiveShop(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        if (shop.getStatus() != ShopStatus.ACTIVE) {
            throw new RuntimeException("Shop is currently unavailable");
        }
        return shop;
    }

    @Transactional
    public Feedback submitFeedback(Long shopId, FeedbackRequest request) {
        Shop shop = getActiveShop(shopId);
        
        Feedback feedback = new Feedback();
        feedback.setShop(shop);
        feedback.setCustomerDisplayName(request.getCustomerDisplayName());
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setOrderReference(request.getOrderReference());
        
        Feedback saved = feedbackRepository.save(feedback);

        notificationService.createNotification(
                shop.getOwner(),
                NotificationType.NEW_FEEDBACK,
                "New Feedback",
                "You have received a new " + request.getRating() + "-star rating.",
                saved.getId() != null ? saved.getId().toString() : "0",
                true
        );

        return saved;
    }

    @Transactional
    public Enquiry submitEnquiry(Long shopId, EnquiryRequest request) {
        Shop shop = getActiveShop(shopId);

        Enquiry enquiry = new Enquiry();
        enquiry.setShop(shop);
        enquiry.setCustomerName(request.getCustomerName());
        enquiry.setCustomerEmail(request.getCustomerEmail());
        enquiry.setEnquiryType(request.getEnquiryType());
        enquiry.setMessage(request.getMessage());
        
        Enquiry saved = enquiryRepository.save(enquiry);

        notificationService.createNotification(
                shop.getOwner(),
                NotificationType.NEW_ENQUIRY,
                "New Enquiry",
                "You have received a new " + request.getEnquiryType() + " enquiry from " + request.getCustomerName(),
                saved.getId() != null ? saved.getId().toString() : "0",
                true
        );

        return saved;
    }

    @Transactional
    public CustomCakeRequest submitCustomCakeRequest(Long shopId, CustomCakeDto request) {
        Shop shop = getActiveShop(shopId);

        CustomCakeRequest cakeRequest = new CustomCakeRequest();
        cakeRequest.setShop(shop);
        cakeRequest.setCustomerName(request.getCustomerName());
        cakeRequest.setCustomerEmail(request.getCustomerEmail());
        cakeRequest.setCustomerMobile(request.getCustomerMobile());
        cakeRequest.setOccasion(request.getOccasion());
        cakeRequest.setCakeType(request.getCakeType());
        cakeRequest.setFlavour(request.getFlavour());
        cakeRequest.setServings(request.getServings());
        cakeRequest.setDesignDescription(request.getDesignDescription());
        cakeRequest.setReferenceImageUrl(request.getReferenceImageUrl());
        cakeRequest.setBudget(request.getBudget());
        cakeRequest.setRequiredDate(request.getRequiredDate());
        cakeRequest.setDeliveryPreference(request.getDeliveryPreference());

        CustomCakeRequest saved = customCakeRequestRepository.save(cakeRequest);

        notificationService.createNotification(
                shop.getOwner(),
                NotificationType.CUSTOM_ORDER_REQUEST,
                "Custom Cake Request",
                "New custom cake request received from " + request.getCustomerName(),
                saved.getId() != null ? saved.getId().toString() : "0",
                true
        );

        return saved;
    }
}
