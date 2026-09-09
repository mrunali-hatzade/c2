package com.cakeplatform.api.modules.product;

import com.cakeplatform.api.exception.CategoryNotEmptyException;
import com.cakeplatform.api.exception.DuplicateResourceException;
import com.cakeplatform.api.exception.ResourceNotFoundException;
import com.cakeplatform.api.modules.audit.ActivityLoggerService;
import com.cakeplatform.api.modules.product.dto.CategoryRequest;
import com.cakeplatform.api.modules.product.dto.CategoryResponse;
import com.cakeplatform.api.modules.product.dto.ProductRequest;
import com.cakeplatform.api.modules.product.service.CategoryService;
import com.cakeplatform.api.modules.product.service.ProductService;
import com.cakeplatform.api.modules.security.ShopAccessValidator;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopRepository;
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
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class CategoryServiceTest {

    @Mock
    private ProductCategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private ShopAccessValidator shopAccessValidator;

    @Mock
    private ActivityLoggerService activityLogger;

    @InjectMocks
    private CategoryService categoryService;

    private Shop shopA;
    private Shop shopB;
    private ProductCategory catA1;
    private ProductCategory catA2;
    private ProductCategory catB1;

    @BeforeEach
    void setUp() {
        shopA = new Shop();
        shopA.setId(101L);

        shopB = new Shop();
        shopB.setId(202L);

        catA1 = new ProductCategory();
        catA1.setId(1L);
        catA1.setShop(shopA);
        catA1.setName("Birthday Cakes");
        catA1.setSlug("birthday-cakes");
        catA1.setDisplayOrder(1);
        catA1.setCreatedAt(LocalDateTime.now());

        catA2 = new ProductCategory();
        catA2.setId(2L);
        catA2.setShop(shopA);
        catA2.setName("Cheesecakes");
        catA2.setSlug("cheesecakes");
        catA2.setDisplayOrder(2);
        catA2.setCreatedAt(LocalDateTime.now());

        catB1 = new ProductCategory();
        catB1.setId(3L);
        catB1.setShop(shopB);
        catB1.setName("Artisan Pastries");
        catB1.setSlug("artisan-pastries");
        catB1.setDisplayOrder(1);
        catB1.setCreatedAt(LocalDateTime.now());

        when(shopAccessValidator.getValidShopForOwner(1L)).thenReturn(shopA);
        when(shopAccessValidator.getValidShopForOwner(2L)).thenReturn(shopB);
    }

    @Test
    @DisplayName("Owner should see ALL categories including empty categories (productCount == 0)")
    void testOwnerSeesAllCategoriesIncludingEmpty() {
        CategoryResponse r1 = new CategoryResponse(1L, 101L, "Birthday Cakes", "birthday-cakes", 1, 5L, LocalDateTime.now());
        CategoryResponse r2 = new CategoryResponse(2L, 101L, "Cheesecakes", "cheesecakes", 2, 0L, LocalDateTime.now());

        when(categoryRepository.findAllByShopIdWithCounts(101L)).thenReturn(Arrays.asList(r1, r2));

        List<CategoryResponse> categories = categoryService.getOwnerCategories(1L);

        assertEquals(2, categories.size());
        assertEquals("Birthday Cakes", categories.get(0).getName());
        assertEquals(5L, categories.get(0).getProductCount());
        assertEquals("Cheesecakes", categories.get(1).getName());
        assertEquals(0L, categories.get(1).getProductCount()); // Empty category visible to owner
    }

    @Test
    @DisplayName("Create Category: trims input, creates slug, and saves")
    void testCreateCategory_Success() {
        CategoryRequest req = new CategoryRequest("  Custom Cupcakes  ", 3);

        when(categoryRepository.existsByShopIdAndLowerTrimmedName(101L, "Custom Cupcakes")).thenReturn(false);
        when(categoryRepository.save(any(ProductCategory.class))).thenAnswer(invocation -> {
            ProductCategory c = invocation.getArgument(0);
            c.setId(10L);
            c.setCreatedAt(LocalDateTime.now());
            return c;
        });

        CategoryResponse res = categoryService.createCategory(1L, req);

        assertNotNull(res);
        assertEquals("Custom Cupcakes", res.getName());
        assertEquals("custom-cupcakes", res.getSlug());
        assertEquals(3, res.getDisplayOrder());
        assertEquals(101L, res.getShopId());
        verify(categoryRepository).save(any(ProductCategory.class));
        verify(activityLogger).logActivity(eq(1L), eq(101L), eq("CATEGORY_CREATED"), eq("CATEGORY"), eq(10L), any());
    }

    @Test
    @DisplayName("Create Category: duplicate name in same shop throws 409 Conflict")
    void testCreateCategory_DuplicateName_ThrowsConflict() {
        CategoryRequest req = new CategoryRequest("Birthday Cakes", 1);
        when(categoryRepository.existsByShopIdAndLowerTrimmedName(101L, "Birthday Cakes")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            categoryService.createCategory(1L, req);
        });

        verify(categoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Create Category: case-insensitive duplicate with whitespace throws 409 Conflict")
    void testCreateCategory_CaseInsensitiveDuplicate_ThrowsConflict() {
        CategoryRequest req = new CategoryRequest("  birthday cakes  ", 1);
        when(categoryRepository.existsByShopIdAndLowerTrimmedName(101L, "birthday cakes")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            categoryService.createCategory(1L, req);
        });

        verify(categoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cross-Shop Isolation: Different shops can independently create identical category names")
    void testCrossShop_SameCategoryNameAllowed() {
        CategoryRequest reqA = new CategoryRequest("Cheesecakes", 1);
        when(categoryRepository.existsByShopIdAndLowerTrimmedName(101L, "Cheesecakes")).thenReturn(false);
        when(categoryRepository.save(any(ProductCategory.class))).thenAnswer(i -> i.getArgument(0));

        CategoryResponse resA = categoryService.createCategory(1L, reqA);
        assertEquals(101L, resA.getShopId());

        CategoryRequest reqB = new CategoryRequest("Cheesecakes", 1);
        when(categoryRepository.existsByShopIdAndLowerTrimmedName(202L, "Cheesecakes")).thenReturn(false);
        CategoryResponse resB = categoryService.createCategory(2L, reqB);
        assertEquals(202L, resB.getShopId());
    }

    @Test
    @DisplayName("Update Category: updates name and display order")
    void testUpdateCategory_Success() {
        CategoryRequest req = new CategoryRequest("Gourmet Cheesecakes", 5);

        when(categoryRepository.findByIdAndShopId(2L, 101L)).thenReturn(Optional.of(catA2));
        when(categoryRepository.existsByShopIdAndLowerTrimmedNameExcludingId(101L, "Gourmet Cheesecakes", 2L)).thenReturn(false);
        when(categoryRepository.save(any(ProductCategory.class))).thenReturn(catA2);
        when(productRepository.countByCategoryId(2L)).thenReturn(3L);

        CategoryResponse res = categoryService.updateCategory(2L, 1L, req);

        assertEquals("Gourmet Cheesecakes", res.getName());
        assertEquals("gourmet-cheesecakes", res.getSlug());
        assertEquals(5, res.getDisplayOrder());
        assertEquals(3L, res.getProductCount());
    }

    @Test
    @DisplayName("Cross-Shop Update: Owner 1 cannot update Owner 2's category")
    void testCrossShopUpdate_ThrowsNotFound() {
        CategoryRequest req = new CategoryRequest("Hacked Category", 1);
        // Category 3 belongs to Shop 2 (202), Owner 1 belongs to Shop 1 (101)
        when(categoryRepository.findByIdAndShopId(3L, 101L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            categoryService.updateCategory(3L, 1L, req);
        });

        verify(categoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Delete Category with ZERO products: deletes directly")
    void testDeleteCategory_ZeroProducts_DeletesDirectly() {
        when(categoryRepository.findByIdAndShopId(1L, 101L)).thenReturn(Optional.of(catA1));
        when(productRepository.countByCategoryId(1L)).thenReturn(0L);

        categoryService.deleteCategory(1L, 1L, null);

        verify(productRepository, never()).reassignCategory(anyLong(), anyLong(), anyLong());
        verify(categoryRepository).delete(catA1);
    }

    @Test
    @DisplayName("Delete Category with products but NO reassignment target: throws CategoryNotEmptyException")
    void testDeleteCategory_WithProductsNoReassignment_ThrowsCategoryNotEmptyException() {
        when(categoryRepository.findByIdAndShopId(1L, 101L)).thenReturn(Optional.of(catA1));
        when(productRepository.countByCategoryId(1L)).thenReturn(5L);

        CategoryNotEmptyException ex = assertThrows(CategoryNotEmptyException.class, () -> {
            categoryService.deleteCategory(1L, 1L, null);
        });

        assertEquals(5L, ex.getProductCount());
        verify(categoryRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Delete Category with products and VALID destination: reassigns products and deletes source")
    void testDeleteCategory_WithProductsAndReassignment_Success() {
        when(categoryRepository.findByIdAndShopId(1L, 101L)).thenReturn(Optional.of(catA1));
        when(productRepository.countByCategoryId(1L)).thenReturn(5L);
        when(categoryRepository.findByIdAndShopId(2L, 101L)).thenReturn(Optional.of(catA2));

        categoryService.deleteCategory(1L, 1L, 2L);

        // Step 1: Reassign all products
        verify(productRepository).reassignCategory(1L, 2L, 101L);
        // Step 2: Delete source category
        verify(categoryRepository).delete(catA1);
    }

    @Test
    @DisplayName("Delete Category: Self-reassignment (source == destination) is rejected")
    void testDeleteCategory_SelfReassignment_ThrowsIllegalArgument() {
        when(categoryRepository.findByIdAndShopId(1L, 101L)).thenReturn(Optional.of(catA1));
        when(productRepository.countByCategoryId(1L)).thenReturn(5L);

        assertThrows(IllegalArgumentException.class, () -> {
            categoryService.deleteCategory(1L, 1L, 1L);
        });

        verify(productRepository, never()).reassignCategory(anyLong(), anyLong(), anyLong());
        verify(categoryRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Cross-Shop Reassignment: Reassigning to a category from another shop is rejected")
    void testCrossShopReassignment_Rejected() {
        when(categoryRepository.findByIdAndShopId(1L, 101L)).thenReturn(Optional.of(catA1));
        when(productRepository.countByCategoryId(1L)).thenReturn(5L);
        // Destination Category 3 belongs to Shop B (202), not Shop A (101)
        when(categoryRepository.findByIdAndShopId(3L, 101L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            categoryService.deleteCategory(1L, 1L, 3L);
        });

        verify(productRepository, never()).reassignCategory(anyLong(), anyLong(), anyLong());
        verify(categoryRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Customer Storefront: Returns ONLY categories containing active products (empty categories excluded)")
    void testStorefrontReturnsOnlyNonEmptyCategories() {
        when(shopRepository.existsById(101L)).thenReturn(true);

        CategoryResponse nonEmptyCat = new CategoryResponse(1L, 101L, "Birthday Cakes", "birthday-cakes", 1, 4L, LocalDateTime.now());
        // Repository returns only categories with productCount > 0
        when(categoryRepository.findNonEmptyByShopId(101L)).thenReturn(List.of(nonEmptyCat));

        List<CategoryResponse> result = categoryService.getStorefrontCategories(101L);

        assertEquals(1, result.size());
        assertEquals("Birthday Cakes", result.get(0).getName());
        assertEquals(4L, result.get(0).getProductCount());
        assertTrue(result.get(0).getProductCount() > 0);
    }
}
