package com.cakeplatform.api.modules.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    @Async
    public void sendSms(String phoneNumber, String message) {
        // Mock SMS / WhatsApp Gateway
        // In a real application, you would integrate Twilio or WhatsApp Cloud API here
        log.info("==============================================");
        log.info("📱 MOCK SMS / WHATSAPP SENT");
        log.info("To: {}", phoneNumber);
        log.info("Message: {}", message);
        log.info("==============================================");
    }
}
