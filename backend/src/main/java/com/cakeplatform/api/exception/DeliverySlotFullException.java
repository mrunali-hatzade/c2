package com.cakeplatform.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DeliverySlotFullException extends RuntimeException {

    private final String errorCode = "SLOT_FULL";

    public DeliverySlotFullException(String message) {
        super(message);
    }

    public String getErrorCode() {
        return errorCode;
    }
}
