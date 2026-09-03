package com.cakeplatform.api.modules.order.controller;

import com.cakeplatform.api.modules.order.Order;
import com.cakeplatform.api.modules.order.service.OrderService;
import com.cakeplatform.api.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner/orders")
@PreAuthorize("hasRole('SHOP_OWNER')")
@RequiredArgsConstructor
public class OwnerOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrderDetails(userDetails.getId(), id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> payload) {
        
        String newStatus = payload.get("status");
        Order updated = orderService.updateOrderStatus(userDetails.getId(), id, newStatus);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @org.springframework.beans.factory.annotation.Autowired com.cakeplatform.api.modules.order.InvoiceService invoiceService) throws Exception {
            
        Order order = orderService.getOrderDetails(userDetails.getId(), id);
        byte[] pdfBytes = invoiceService.generateInvoice(order);
        
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + order.getOrderNumber() + ".pdf");
        
        return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
    }
}
