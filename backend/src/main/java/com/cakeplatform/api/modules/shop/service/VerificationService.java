package com.cakeplatform.api.modules.shop.service;

import com.cakeplatform.api.modules.audit.ActivityLog;
import com.cakeplatform.api.modules.audit.ActivityLogRepository;
import com.cakeplatform.api.modules.shop.*;
import com.cakeplatform.api.modules.shop.dto.DocumentUploadRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final ShopRepository shopRepository;
    private final BusinessDocumentRepository documentRepository;
    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public BusinessDocument uploadDocument(Long ownerId, DocumentUploadRequest request) {
        Shop shop = shopRepository.findByOwnerId(ownerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        BusinessDocument doc = new BusinessDocument();
        doc.setShop(shop);
        doc.setDocumentType(DocumentType.valueOf(request.getDocumentType().toUpperCase()));
        doc.setFileUrl(request.getFileUrl());
        doc.setStatus(VerificationStatus.PROCESSING);
        
        BusinessDocument savedDoc = documentRepository.save(doc);
        
        // If shop is not already verified, mark verification status as PROCESSING awaiting admin review
        if (shop.getVerificationStatus() != VerificationStatus.VERIFIED) {
            shop.setVerificationStatus(VerificationStatus.PROCESSING);
            shopRepository.save(shop);
        }
        
        return savedDoc;
    }
    
    public List<BusinessDocument> getMyDocuments(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Shop not found"));
                
        return documentRepository.findByShopId(shop.getId());
    }

    public Map<String, Object> getVerificationStatus(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Shop not found for owner: " + ownerId));

        Map<String, Object> response = new HashMap<>();
        response.put("shopId", shop.getId());
        response.put("businessName", shop.getBusinessName());
        response.put("verificationStatus", shop.getVerificationStatus().name());

        List<BusinessDocument> docs = documentRepository.findByShopId(shop.getId());
        response.put("documents", docs);

        if (shop.getVerificationStatus() == VerificationStatus.REJECTED || shop.getVerificationStatus() == VerificationStatus.ACTION_REQUIRED) {
            List<ActivityLog> logs = activityLogRepository.findByShopIdOrderByTimestampDesc(shop.getId());
            for (ActivityLog log : logs) {
                if ("KYC_REJECTED".equals(log.getAction())) {
                    response.put("rejectionReason", log.getMetadata());
                    break;
                }
            }
        }

        return response;
    }
}

