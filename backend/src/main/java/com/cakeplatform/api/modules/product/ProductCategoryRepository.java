package com.cakeplatform.api.modules.product;

import com.cakeplatform.api.modules.product.dto.CategoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

    List<ProductCategory> findByShopIdOrderByDisplayOrderAscNameAsc(Long shopId);

    Optional<ProductCategory> findByIdAndShopId(Long id, Long shopId);

    @Query("SELECT new com.cakeplatform.api.modules.product.dto.CategoryResponse(" +
           "c.id, c.shop.id, c.name, c.slug, c.displayOrder, COUNT(p.id), c.createdAt) " +
           "FROM ProductCategory c LEFT JOIN Product p ON p.category.id = c.id " +
           "WHERE c.shop.id = :shopId " +
           "GROUP BY c.id, c.shop.id, c.name, c.slug, c.displayOrder, c.createdAt " +
           "ORDER BY c.displayOrder ASC, c.name ASC")
    List<CategoryResponse> findAllByShopIdWithCounts(@Param("shopId") Long shopId);

    @Query("SELECT new com.cakeplatform.api.modules.product.dto.CategoryResponse(" +
           "c.id, c.shop.id, c.name, c.slug, c.displayOrder, COUNT(p.id), c.createdAt) " +
           "FROM ProductCategory c JOIN Product p ON p.category.id = c.id " +
           "WHERE c.shop.id = :shopId AND p.status = 'ACTIVE' AND p.availability = true " +
           "GROUP BY c.id, c.shop.id, c.name, c.slug, c.displayOrder, c.createdAt " +
           "HAVING COUNT(p.id) > 0 " +
           "ORDER BY c.displayOrder ASC, c.name ASC")
    List<CategoryResponse> findNonEmptyByShopId(@Param("shopId") Long shopId);

    @Query("SELECT COUNT(c) > 0 FROM ProductCategory c WHERE c.shop.id = :shopId AND LOWER(TRIM(c.name)) = LOWER(TRIM(:name))")
    boolean existsByShopIdAndLowerTrimmedName(@Param("shopId") Long shopId, @Param("name") String name);

    @Query("SELECT COUNT(c) > 0 FROM ProductCategory c WHERE c.shop.id = :shopId AND LOWER(TRIM(c.name)) = LOWER(TRIM(:name)) AND c.id != :excludeId")
    boolean existsByShopIdAndLowerTrimmedNameExcludingId(@Param("shopId") Long shopId, @Param("name") String name, @Param("excludeId") Long excludeId);
}
