package com.cakeplatform.api.modules.storefront;

import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.OrderRepository;
import com.cakeplatform.api.modules.product.Product;
import com.cakeplatform.api.modules.product.ProductAddon;
import com.cakeplatform.api.modules.product.ProductRepository;
import com.cakeplatform.api.modules.product.ProductVariant;
import com.cakeplatform.api.modules.shop.Shop;
import com.cakeplatform.api.modules.shop.ShopDeliverySlot;
import com.cakeplatform.api.modules.shop.ShopRepository;
import com.cakeplatform.api.modules.shop.ShopStatus;
import com.cakeplatform.api.modules.storefront.dto.GuestOrderRequest;
import com.cakeplatform.api.modules.storefront.dto.StorefrontOrderItem;
import com.cakeplatform.api.modules.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerStorefrontServiceTest {

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private com.cakeplatform.api.modules.shop.CouponRepository couponRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private com.cakeplatform.api.modules.shop.ShopDeliverySlotRepository deliverySlotRepository;

    @InjectMocks
    private CustomerStorefrontService storefrontService;

    private Shop mockShop;
    private Product mockProduct;
    private ShopDeliverySlot mockSlot;

    @BeforeEach
    void setUp() {
        mockShop = new Shop();
        mockShop.setId(1L);
        mockShop.setStatus(ShopStatus.ACTIVE);

        mockSlot = new ShopDeliverySlot();
        mockSlot.setId(10L);
        mockSlot.setIsActive(true);
        mockShop.getDeliverySlots().add(mockSlot);

        mockProduct = new Product();
        mockProduct.setId(100L);
        mockProduct.setName("Chocolate Truffle");
        mockProduct.setPrice(BigDecimal.valueOf(20.00));
        mockProduct.setAvailability(true);
        mockProduct.setStatus("ACTIVE");

        ProductVariant variant = new ProductVariant();
        variant.setId(5L);
        variant.setName("1 kg");
        variant.setPrice(BigDecimal.valueOf(35.00));
        variant.setIsAvailable(true);
        mockProduct.getVariants().add(variant);

        ProductAddon addon = new ProductAddon();
        addon.setId(8L);
        addon.setName("Sparkle Candle");
        addon.setPrice(BigDecimal.valueOf(2.50));
        addon.setIsAvailable(true);
        mockProduct.getAddons().add(addon);
    }

    @Test
    void testPlaceGuestOrder_DynamicPricingCalculation() {
        // Arrange
        when(shopRepository.findById(1L)).thenReturn(Optional.of(mockShop));
        when(productRepository.findByIdAndShopId(100L, 1L)).thenReturn(Optional.of(mockProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setId(999L);
            return o;
        });

        GuestOrderRequest request = new GuestOrderRequest();
        request.setCustomerName("Test User");
        request.setCustomerEmail("test@example.com");
        request.setCustomerPhone("+1234567890");
        request.setPaymentMethod("ONLINE_PAYMENT");
        request.setDeliveryAddress("Test Address");
        request.setDeliveryDate(LocalDate.now());
        request.setDeliverySlotId(10L);

        StorefrontOrderItem item = new StorefrontOrderItem();
        item.setProductId(100L);
        item.setQuantity(2); // Quantity = 2
        item.setVariantId(5L); // 1kg Variant = 35.00
        item.setAddonIds(List.of(8L)); // Sparkle Candle = 2.50
        item.setDietaryPreference("EGGLESS"); // Eggless upcharge = 5.00
        request.setItems(List.of(item));

        // Act
        Order savedOrder = storefrontService.placeGuestOrder(1L, request);

        // Assert
        assertNotNull(savedOrder);
        // Base Unit Price should be: Variant(35.00) + Addon(2.50) + Dietary(5.00) = 42.50
        // Total for 2 items: 42.50 * 2 = 85.00
        assertEquals(0, BigDecimal.valueOf(85.00).compareTo(savedOrder.getSubtotal()));
        
        // Delivery = 50.00
        assertEquals(0, BigDecimal.valueOf(135.00).compareTo(savedOrder.getTotalAmount()));
        
        assertEquals("1 kg", savedOrder.getItems().get(0).getVariantName());
        assertTrue(savedOrder.getItems().get(0).getAddonsSummary().contains("Sparkle Candle"));
        assertEquals("EGGLESS", savedOrder.getItems().get(0).getDietaryPreference());
        assertEquals(mockSlot, savedOrder.getDeliverySlot());
    }

    @Test
    void testPlaceGuestOrder_WithFlatCoupon() {
        // Arrange
        when(shopRepository.findById(1L)).thenReturn(Optional.of(mockShop));
        when(productRepository.findByIdAndShopId(100L, 1L)).thenReturn(Optional.of(mockProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setId(999L);
            return o;
        });

        com.cakeplatform.api.modules.shop.Coupon coupon = new com.cakeplatform.api.modules.shop.Coupon();
        coupon.setId(1L);
        coupon.setShop(mockShop);
        coupon.setCode("MINUS10");
        coupon.setDiscountType(com.cakeplatform.api.modules.shop.Coupon.DiscountType.FLAT);
        coupon.setDiscountValue(BigDecimal.valueOf(10.00));
        coupon.setIsActive(true);
        coupon.setUsedCount(0);

        when(couponRepository.findByShopIdAndCodeIgnoreCase(1L, "MINUS10")).thenReturn(Optional.of(coupon));
        when(couponRepository.incrementUsedCountIfWithinLimit(1L)).thenReturn(1);

        GuestOrderRequest request = new GuestOrderRequest();
        request.setCustomerName("Test");
        request.setCustomerEmail("test@test.com");
        request.setCustomerPhone("123");
        request.setPaymentMethod("COD");
        request.setDeliveryAddress("Add");
        request.setDeliveryDate(LocalDate.now());
        request.setDeliverySlotId(10L);
        request.setCouponCode("MINUS10");

        StorefrontOrderItem item = new StorefrontOrderItem();
        item.setProductId(100L);
        item.setQuantity(1); // $20
        request.setItems(List.of(item));

        // Act
        Order savedOrder = storefrontService.placeGuestOrder(1L, request);

        // Assert
        assertEquals(0, BigDecimal.valueOf(20.00).compareTo(savedOrder.getSubtotal()));
        assertEquals(0, BigDecimal.valueOf(10.00).compareTo(savedOrder.getDiscountAmount()));
        // Total = 20 - 10 + 50 (delivery) = 60
        assertEquals(0, BigDecimal.valueOf(60.00).compareTo(savedOrder.getTotalAmount()));
        assertEquals("MINUS10", savedOrder.getCouponCode());
        verify(couponRepository).incrementUsedCountIfWithinLimit(1L);
    }
}
