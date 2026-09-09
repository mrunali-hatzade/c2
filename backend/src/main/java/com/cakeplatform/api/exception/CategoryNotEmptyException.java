package com.cakeplatform.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CategoryNotEmptyException extends RuntimeException {
    private final long productCount;

    public CategoryNotEmptyException(String message, long productCount) {
        super(message);
        this.productCount = productCount;
    }

    public long getProductCount() {
        return productCount;
    }
}
