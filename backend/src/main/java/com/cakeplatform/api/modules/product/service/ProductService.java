package com.cakeplatform.api.modules.product.service;

import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import com.cakeplatform.api.modules.product.Product;
import com.cakeplatform.api.modules.product.ProductRepository;
import com.cakeplatform.api.modules.product.dto.ProductRequest;
import com.cakeplatform.api.modules.shop.Shop;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final com.cakeplatform.api.modules.product.ProductCategoryRepository categoryRepository;
    private final com.cakeplatform.api.modules.security.ShopAccessValidator shopAccessValidator;
    private final ActivityLoggerService activityLogger;

    private Shop getShopByOwnerId(Long ownerId) {
        return shopAccessValidator.getValidShopForOwner(ownerId);
    }

    public List<Product> getProductsByUserId(Long userId) {
        Shop shop = getShopByOwnerId(userId);
        return productRepository.findByShopId(shop.getId());
    }

    @Transactional
    public Product createProduct(Long userId, ProductRequest request) {
        Shop shop = getShopByOwnerId(userId);

        Product product = new Product();
        product.setShop(shop);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setIngredients(request.getIngredients());
        product.setAllergens(request.getAllergens());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setAvailability(request.getAvailability() != null ? request.getAvailability() : true);
        product.setStatus("ACTIVE");
        
        if (request.getCategoryId() != null) {
            com.cakeplatform.api.modules.product.ProductCategory category = categoryRepository.findByIdAndShopId(request.getCategoryId(), shop.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found or does not belong to your shop"));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }
        
        if (request.getVariants() != null) {
            for (ProductRequest.VariantDto vDto : request.getVariants()) {
                com.cakeplatform.api.modules.product.ProductVariant variant = new com.cakeplatform.api.modules.product.ProductVariant();
                variant.setName(vDto.getName());
                variant.setPrice(vDto.getPrice());
                variant.setIsAvailable(vDto.getIsAvailable() != null ? vDto.getIsAvailable() : true);
                variant.setProduct(product);
                product.getVariants().add(variant);
            }
        }
        
        if (request.getAddons() != null) {
            for (ProductRequest.AddonDto aDto : request.getAddons()) {
                com.cakeplatform.api.modules.product.ProductAddon addon = new com.cakeplatform.api.modules.product.ProductAddon();
                addon.setName(aDto.getName());
                addon.setPrice(aDto.getPrice());
                addon.setIsAvailable(aDto.getIsAvailable() != null ? aDto.getIsAvailable() : true);
                addon.setProduct(product);
                product.getAddons().add(addon);
            }
        }

        Product saved = productRepository.save(product);
        
        activityLogger.logActivity(userId, shop.getId(), "PRODUCT_CREATED", "PRODUCT", saved.getId(), "Name: " + saved.getName());
        return saved;
    }

    @Transactional
    public Product updateProduct(Long productId, Long userId, ProductRequest request) {
        Shop shop = getShopByOwnerId(userId);
        
        Product product = productRepository.findByIdAndShopId(productId, shop.getId())
                .orElseThrow(() -> new RuntimeException("Product not found or unauthorized"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setIngredients(request.getIngredients());
        product.setAllergens(request.getAllergens());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        if (request.getAvailability() != null) {
            product.setAvailability(request.getAvailability());
        }

        if (request.getCategoryId() != null) {
            com.cakeplatform.api.modules.product.ProductCategory category = categoryRepository.findByIdAndShopId(request.getCategoryId(), shop.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found or does not belong to your shop"));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        Product updated = productRepository.save(product);
        
        activityLogger.logActivity(userId, shop.getId(), "PRODUCT_UPDATED", "PRODUCT", updated.getId(), null);
        return updated;
    }
    
    @Transactional
    public void deleteProduct(Long productId, Long userId) {
        Shop shop = getShopByOwnerId(userId);
        
        Product product = productRepository.findByIdAndShopId(productId, shop.getId())
                .orElseThrow(() -> new RuntimeException("Product not found or unauthorized"));
                
        productRepository.delete(product);
        activityLogger.logActivity(userId, shop.getId(), "PRODUCT_DELETED", "PRODUCT", productId, null);
    }
}
