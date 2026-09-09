package com.cakeplatform.api.modules.product;

import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import com.cakeplatform.api.modules.product.dto.ProductRequest;
import com.cakeplatform.api.modules.product.service.ProductService;
import com.cakeplatform.api.modules.security.ShopAccessValidator;
import com.cakeplatform.api.modules.shop.Shop;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class ProductCategoryAssignmentTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductCategoryRepository categoryRepository;

    @Mock
    private ShopAccessValidator shopAccessValidator;

    @Mock
    private ActivityLoggerService activityLogger;

    @InjectMocks
    private ProductService productService;

    private Shop shopA;
    private Shop shopB;
    private ProductCategory categoryA;
    private ProductCategory categoryB;

    @BeforeEach
    void setUp() {
        shopA = new Shop();
        shopA.setId(10L);

        shopB = new Shop();
        shopB.setId(20L);

        categoryA = new ProductCategory();
        categoryA.setId(100L);
        categoryA.setShop(shopA);
        categoryA.setName("Shop A Category");

        categoryB = new ProductCategory();
        categoryB.setId(200L);
        categoryB.setShop(shopB);
        categoryB.setName("Shop B Category");

        when(shopAccessValidator.getValidShopForOwner(1L)).thenReturn(shopA);
        when(shopAccessValidator.getValidShopForOwner(2L)).thenReturn(shopB);
    }

    @Test
    @DisplayName("Create Product with Valid Category from Same Shop: Success")
    void testCreateProduct_ValidCategory_Success() {
        ProductRequest req = new ProductRequest();
        req.setName("Chocolate Truffle");
        req.setPrice(new BigDecimal("500.00"));
        req.setCategoryId(100L);

        when(categoryRepository.findByIdAndShopId(100L, 10L)).thenReturn(Optional.of(categoryA));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product product = productService.createProduct(1L, req);

        assertNotNull(product);
        assertEquals(categoryA, product.getCategory());
        assertEquals(100L, product.getCategoryId());
    }

    @Test
    @DisplayName("Create Product with Category belonging to ANOTHER shop: Throws IllegalArgumentException")
    void testCreateProduct_CrossShopCategory_ThrowsIllegalArgument() {
        ProductRequest req = new ProductRequest();
        req.setName("Chocolate Truffle");
        req.setPrice(new BigDecimal("500.00"));
        req.setCategoryId(200L); // Belongs to Shop B, but User 1 owns Shop A

        // findByIdAndShopId with Shop A's ID will return empty
        when(categoryRepository.findByIdAndShopId(200L, 10L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(1L, req);
        });

        assertTrue(ex.getMessage().contains("Category not found or does not belong to your shop"));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Update Product with Category belonging to ANOTHER shop: Throws IllegalArgumentException")
    void testUpdateProduct_CrossShopCategory_ThrowsIllegalArgument() {
        Product existingProduct = new Product();
        existingProduct.setId(50L);
        existingProduct.setShop(shopA);
        existingProduct.setName("Old Name");
        existingProduct.setPrice(new BigDecimal("400.00"));

        ProductRequest req = new ProductRequest();
        req.setName("Updated Name");
        req.setPrice(new BigDecimal("450.00"));
        req.setCategoryId(200L); // Belongs to Shop B

        when(productRepository.findByIdAndShopId(50L, 10L)).thenReturn(Optional.of(existingProduct));
        when(categoryRepository.findByIdAndShopId(200L, 10L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            productService.updateProduct(50L, 1L, req);
        });

        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Update Product: Unassign category (set categoryId = null) succeeds")
    void testUpdateProduct_UnassignCategory_Success() {
        Product existingProduct = new Product();
        existingProduct.setId(50L);
        existingProduct.setShop(shopA);
        existingProduct.setName("Old Name");
        existingProduct.setPrice(new BigDecimal("400.00"));
        existingProduct.setCategory(categoryA);

        ProductRequest req = new ProductRequest();
        req.setName("Updated Name");
        req.setPrice(new BigDecimal("450.00"));
        req.setCategoryId(null); // Unassign

        when(productRepository.findByIdAndShopId(50L, 10L)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product updated = productService.updateProduct(50L, 1L, req);

        assertNull(updated.getCategory());
        assertNull(updated.getCategoryId());
    }
}
