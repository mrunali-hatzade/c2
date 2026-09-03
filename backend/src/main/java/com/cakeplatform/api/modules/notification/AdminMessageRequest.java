package com.cakeplatform.api.modules.notification;

import lombok.Data;

@Data
public class AdminMessageRequest {
    private String title;
    private String message;
    private Long specificOwnerId;
    private boolean sendEmail;
}
