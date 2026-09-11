package com.cakeplatform.api.modules.communication.controller;

import com.cakeplatform.api.modules.communication.ContactEnquiry;
import com.cakeplatform.api.modules.communication.ContactEnquiryService;
import com.cakeplatform.api.modules.communication.PlatformFeedback;
import com.cakeplatform.api.modules.communication.PlatformFeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminCommunicationController {

    private final PlatformFeedbackService feedbackService;
    private final ContactEnquiryService enquiryService;

    @GetMapping("/feedback")
    public ResponseEntity<List<PlatformFeedback>> getPlatformFeedback(
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) String search) {

        log.info("Admin fetching platform feedback (isRead={}, search={})", isRead, search);
        return ResponseEntity.ok(feedbackService.getFeedback(isRead, search));
    }

    @PatchMapping("/feedback/{id}/read")
    public ResponseEntity<Map<String, Object>> markFeedbackRead(@PathVariable Long id) {
        log.info("Admin marking platform feedback ID {} as read", id);
        feedbackService.markAsRead(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Feedback marked as read"));
    }

    @GetMapping("/enquiries")
    public ResponseEntity<List<ContactEnquiry>> getContactEnquiries(
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) String search) {

        log.info("Admin fetching contact enquiries (isRead={}, search={})", isRead, search);
        return ResponseEntity.ok(enquiryService.getEnquiries(isRead, search));
    }

    @PatchMapping("/enquiries/{id}/read")
    public ResponseEntity<Map<String, Object>> markEnquiryRead(@PathVariable Long id) {
        log.info("Admin marking contact enquiry ID {} as read", id);
        enquiryService.markAsRead(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Enquiry marked as read"));
    }

    @GetMapping("/communication/summary")
    public ResponseEntity<PlatformFeedbackService.CommunicationSummaryResponse> getCommunicationSummary() {
        log.info("Admin fetching communication summary counts");
        return ResponseEntity.ok(feedbackService.getSummary());
    }
}
