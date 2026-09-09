package com.cakeplatform.api.modules.product.service;

import com.cakeplatform.api.exception.CategoryNotEmptyException;
import com.cakeplatform.api.exception.DuplicateResourceException;
import com.cakeplatform.api.exception.ResourceNotFoundException;
import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import com.cakeplatform.api.modules.product.ProductCategory;
import com.cakeplatform.api.modules.product.ProductCategoryRepository;
import com.cakeplatform.api.modules.product.ProductRepository;
import com.cakeplatform.api.modules.product.dto.CategoryRequest;
import com.cakeplatform.api.modules.product.dto.CategoryResponse;
import com.cakeplatform.api.modules.security.ShopAccessValidator;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final ShopAccessValidator shopAccessValidator;
    private final ActivityLoggerService activityLogger;

    private Shop getShopByOwnerId(Long ownerId) {
        return shopAccessValidator.getValidShopForOwner(ownerId);
    }

    private String toSlug(String input) {
        if (input == null) return "";
        return input.trim().toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getOwnerCategories(Long userId) {
        Shop shop = getShopByOwnerId(userId);
        return categoryRepository.findAllByShopIdWithCounts(shop.getId());
    }

    @Transactional
    public CategoryResponse createCategory(Long userId, CategoryRequest request) {
        Shop shop = getShopByOwnerId(userId);
        String name = request.getName().trim();

        if (categoryRepository.existsByShopIdAndLowerTrimmedName(shop.getId(), name)) {
            throw new DuplicateResourceException("A category named '" + name + "' already exists in your shop.");
        }

        ProductCategory category = new ProductCategory();
        category.setShop(shop);
        category.setName(name);
        category.setSlug(toSlug(name));
        category.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        ProductCategory saved = categoryRepository.save(category);

        activityLogger.logActivity(userId, shop.getId(), "CATEGORY_CREATED", "CATEGORY", saved.getId(), "Name: " + saved.getName());

        return new CategoryResponse(
                saved.getId(),
                shop.getId(),
                saved.getName(),
                saved.getSlug(),
                saved.getDisplayOrder(),
                0L,
                saved.getCreatedAt()
        );
    }

    @Transactional
    public CategoryResponse updateCategory(Long categoryId, Long userId, CategoryRequest request) {
        Shop shop = getShopByOwnerId(userId);
        ProductCategory category = categoryRepository.findByIdAndShopId(categoryId, shop.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or does not belong to your shop"));

        String name = request.getName().trim();

        if (categoryRepository.existsByShopIdAndLowerTrimmedNameExcludingId(shop.getId(), name, categoryId)) {
            throw new DuplicateResourceException("A category named '" + name + "' already exists in your shop.");
        }

        category.setName(name);
        category.setSlug(toSlug(name));
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }

        ProductCategory updated = categoryRepository.save(category);
        long productCount = productRepository.countByCategoryId(categoryId);

        activityLogger.logActivity(userId, shop.getId(), "CATEGORY_UPDATED", "CATEGORY", updated.getId(), "Name: " + updated.getName());

        return new CategoryResponse(
                updated.getId(),
                shop.getId(),
                updated.getName(),
                updated.getSlug(),
                updated.getDisplayOrder(),
                productCount,
                updated.getCreatedAt()
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Long categoryId, Long userId, Long reassignToCategoryId) {
        Shop shop = getShopByOwnerId(userId);
        ProductCategory sourceCategory = categoryRepository.findByIdAndShopId(categoryId, shop.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or does not belong to your shop"));

        long productCount = productRepository.countByCategoryId(categoryId);

        if (productCount > 0) {
            if (reassignToCategoryId == null) {
                throw new CategoryNotEmptyException(
                        "Category contains " + productCount + " products. Please select a destination category to reassign them.",
                        productCount
                );
            }

            if (sourceCategory.getId().equals(reassignToCategoryId)) {
                throw new IllegalArgumentException("Cannot reassign products to the category being deleted.");
            }

            ProductCategory targetCategory = categoryRepository.findByIdAndShopId(reassignToCategoryId, shop.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Destination category not found or does not belong to your shop"));

            productRepository.reassignCategory(sourceCategory.getId(), targetCategory.getId(), shop.getId());
        }

        categoryRepository.delete(sourceCategory);
        activityLogger.logActivity(userId, shop.getId(), "CATEGORY_DELETED", "CATEGORY", categoryId, null);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getStorefrontCategories(Long shopId) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResourceNotFoundException("Shop not found");
        }
        return categoryRepository.findNonEmptyByShopId(shopId);
    }
}
