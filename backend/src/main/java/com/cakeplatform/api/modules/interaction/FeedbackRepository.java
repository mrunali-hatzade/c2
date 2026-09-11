package com.cakeplatform.api.modules.interaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByShopIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long shopId);
    Optional<Feedback> findByIdAndShopId(Long id, Long shopId);
    void deleteByShopId(Long shopId);
}
