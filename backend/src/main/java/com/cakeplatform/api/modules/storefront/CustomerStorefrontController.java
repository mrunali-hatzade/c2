package com.cakeplatform.api.modules.storefront;

import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.product.Product;
import com.cakeplatform.api.modules.storefront.dto.GuestOrderRequest;
import com.cakeplatform.api.modules.storefront.dto.StorefrontShopResponse;
import com.cakeplatform.api.modules.storefront.dto.StorefrontDeliverySlotResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storefront/shops")
@RequiredArgsConstructor
public class CustomerStorefrontController {

    private final CustomerStorefrontService storefrontService;

    @GetMapping("/{shopId}")
    public ResponseEntity<StorefrontShopResponse> getShopDetails(@PathVariable Long shopId) {
        return ResponseEntity.ok(storefrontService.getShopDetails(shopId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StorefrontShopResponse>> searchShops(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String businessType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location
    ) {
        com.cakeplatform.api.modules.shop.BusinessType parsedType = null;
        if (org.springframework.util.StringUtils.hasText(businessType)) {
            try {
                parsedType = com.cakeplatform.api.modules.shop.BusinessType.valueOf(businessType.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                // Return empty list if an invalid businessType was provided, ensuring strict filtering
                return ResponseEntity.ok(java.util.Collections.emptyList());
            }
        }
        return ResponseEntity.ok(storefrontService.searchShops(state, district, city, area, parsedType, search, location));
    }


    @GetMapping("/{shopId}/delivery-slots")
    public ResponseEntity<List<StorefrontDeliverySlotResponse>> getShopDeliverySlots(@PathVariable Long shopId) {
        return ResponseEntity.ok(storefrontService.getShopDeliverySlots(shopId));
    }

    @GetMapping("/{shopId}/products")
    public ResponseEntity<List<Product>> getShopProducts(@PathVariable Long shopId) {
        return ResponseEntity.ok(storefrontService.getShopProducts(shopId));
    }

    @GetMapping("/{shopId}/products/{productId}")
    public ResponseEntity<Product> getShopProductDetails(
            @PathVariable Long shopId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(storefrontService.getShopProductDetails(shopId, productId));
    }

    @PostMapping("/{shopId}/orders")
    public ResponseEntity<Order> placeGuestOrder(
            @PathVariable Long shopId,
            @Valid @RequestBody GuestOrderRequest request) {
        return ResponseEntity.ok(storefrontService.placeGuestOrder(shopId, request));
    }

    @GetMapping("/orders/{orderNumber}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable String orderNumber,
            @org.springframework.beans.factory.annotation.Autowired com.cakeplatform.api.modules.order.InvoiceService invoiceService) throws Exception {
            
        Order order = storefrontService.getGuestOrder(orderNumber);
        byte[] pdfBytes = invoiceService.generateInvoice(order);
        
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + order.getOrderNumber() + ".pdf");
        
        return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
    }
}
