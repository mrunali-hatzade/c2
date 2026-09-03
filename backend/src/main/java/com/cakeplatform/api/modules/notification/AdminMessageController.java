package com.cakeplatform.api.modules.notification;

import com.cakeplatform.api.modules.user.User;
import com.cakeplatform.api.modules.user.UserRepository;
import com.cakeplatform.api.modules.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/messages")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminMessageController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<String> sendAdminMessage(@RequestBody AdminMessageRequest request) {
        
        if (request.getSpecificOwnerId() != null) {
            User owner = userRepository.findById(request.getSpecificOwnerId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            notificationService.createNotification(
                    owner, 
                    NotificationType.ADMIN_MESSAGE, 
                    request.getTitle(), 
                    request.getMessage(), 
                    null, 
                    request.isSendEmail()
            );
            return ResponseEntity.ok("Message sent to specific owner.");
        } else {
            List<User> allOwners = userRepository.findByRole(UserRole.SHOP_OWNER);
            for (User owner : allOwners) {
                notificationService.createNotification(
                        owner, 
                        NotificationType.ADMIN_MESSAGE, 
                        request.getTitle(), 
                        request.getMessage(), 
                        null, 
                        request.isSendEmail()
                );
            }
            return ResponseEntity.ok("Message broadcast to all " + allOwners.size() + " owners.");
        }
    }
}
