package com.cakeplatform.api.modules.shop;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessDocumentRepository extends JpaRepository<BusinessDocument, Long> {
    List<BusinessDocument> findByShopId(Long shopId);
    void deleteByShopId(Long shopId);
}
