package com.cakeplatform.api.modules.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShopId(Long shopId);
    Optional<Product> findByIdAndShopId(Long id, Long shopId);
    long countByShopId(Long shopId);
    long countByShopIdAndStatusAndAvailability(Long shopId, String status, Boolean availability);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    long countByCategoryId(@org.springframework.data.repository.query.Param("categoryId") Long categoryId);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.category.id = :categoryId")
    List<Product> findByShopIdAndCategoryId(@org.springframework.data.repository.query.Param("shopId") Long shopId, @org.springframework.data.repository.query.Param("categoryId") Long categoryId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Product p SET p.category.id = :targetId WHERE p.category.id = :sourceId AND p.shop.id = :shopId")
    int reassignCategory(@org.springframework.data.repository.query.Param("sourceId") Long sourceId,
                         @org.springframework.data.repository.query.Param("targetId") Long targetId,
                         @org.springframework.data.repository.query.Param("shopId") Long shopId);
}
