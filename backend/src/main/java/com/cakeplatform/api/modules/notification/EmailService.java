package com.cakeplatform.api.modules.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Async
    public void sendEmail(String to, String subject, String body) {
        log.info("==============================================");
        log.info("📧 MOCK EMAIL SENT");
        log.info("To: {}", to);
        log.info("Subject: {}", subject);
        log.info("Body:\n{}", body);
        log.info("==============================================");
    }
}
