package com.cakeplatform.api.modules.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<ProductReview> findByShopIdOrderByCreatedAtDesc(Long shopId);

    Optional<ProductReview> findByOrderItemId(Long orderItemId);

    boolean existsByOrderItemId(Long orderItemId);

    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId")
    Double calculateAverageRatingByProductId(@Param("productId") Long productId);

    long countByProductId(Long productId);

    long countByShopId(Long shopId);

    @Query("SELECT r.rating, COUNT(r) FROM ProductReview r WHERE r.product.id = :productId GROUP BY r.rating")
    List<Object[]> getRatingBreakdownByProductId(@Param("productId") Long productId);

    List<ProductReview> findByOrderId(Long orderId);
}
