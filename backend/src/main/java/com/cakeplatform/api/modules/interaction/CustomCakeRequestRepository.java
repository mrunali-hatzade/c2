package com.cakeplatform.api.modules.interaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomCakeRequestRepository extends JpaRepository<CustomCakeRequest, Long> {
    List<CustomCakeRequest> findByShopIdOrderByCreatedAtDesc(Long shopId);
    Optional<CustomCakeRequest> findByIdAndShopId(Long id, Long shopId);
    void deleteByShopId(Long shopId);
}
