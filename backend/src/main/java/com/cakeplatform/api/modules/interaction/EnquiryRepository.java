package com.cakeplatform.api.modules.interaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByShopIdOrderByCreatedAtDesc(Long shopId);
    Optional<Enquiry> findByIdAndShopId(Long id, Long shopId);
    void deleteByShopId(Long shopId);
}
