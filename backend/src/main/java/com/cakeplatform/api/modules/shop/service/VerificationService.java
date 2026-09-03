package com.cakeplatform.api.modules.shop.service;

import com.cakeplatform.api.modules.shop.*;
import com.cakeplatform.api.modules.shop.dto.DocumentUploadRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final ShopRepository shopRepository;
    private final BusinessDocumentRepository documentRepository;

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
        
        // MVP: Trigger automated verification immediately
        triggerAutomatedVerification(shop);
        
        return savedDoc;
    }

    private void triggerAutomatedVerification(Shop shop) {
        // Mock OCR and verification logic
        // If shop has documents, mark as VERIFIED
        List<BusinessDocument> docs = documentRepository.findByShopId(shop.getId());
        
        if (!docs.isEmpty()) {
            // Update document status
            for (BusinessDocument doc : docs) {
                doc.setStatus(VerificationStatus.VERIFIED);
                documentRepository.save(doc);
            }
            
            // Update shop verification status
            shop.setVerificationStatus(VerificationStatus.VERIFIED);
            shopRepository.save(shop);
        }
    }
    
    public List<BusinessDocument> getMyDocuments(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Shop not found"));
                
        return documentRepository.findByShopId(shop.getId());
    }
}
