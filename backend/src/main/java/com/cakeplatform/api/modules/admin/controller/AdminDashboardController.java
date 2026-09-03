package com.cakeplatform.api.modules.admin.controller;

import com.cakeplatform.api.modules.admin.AdminDashboardService;
import com.cakeplatform.api.modules.admin.dto.AdminShopDetailsResponse;
import com.cakeplatform.api.modules.admin.dto.AdminShopSummaryResponse;
import com.cakeplatform.api.modules.admin.dto.DashboardStatsResponse;
import com.cakeplatform.api.modules.shop.Shop;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getPlatformStats() {
        return ResponseEntity.ok(adminDashboardService.getPlatformStats());
    }

    @GetMapping("/shops")
    public ResponseEntity<List<AdminShopSummaryResponse>> getAllShops() {
        return ResponseEntity.ok(adminDashboardService.getAllShops());
    }

    @GetMapping("/shops/{shopId}")
    public ResponseEntity<AdminShopDetailsResponse> getShopDetails(@PathVariable Long shopId) {
        return ResponseEntity.ok(adminDashboardService.getShopDetails(shopId));
    }

    @PatchMapping("/shops/{shopId}/status")
    public ResponseEntity<Shop> updateShopStatus(
            @PathVariable Long shopId,
            @RequestBody Map<String, String> payload) {
        
        String newStatus = payload.get("status");
        Shop updated = adminDashboardService.updateShopStatus(shopId, newStatus);
        return ResponseEntity.ok(updated);
    }
}
