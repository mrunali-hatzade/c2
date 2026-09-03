package com.cakeplatform.api.modules.subscription;

public enum SubscriptionStatus {
    PENDING,
    ACTIVE,
    EXPIRING_SOON,
    EXPIRED,
    GRACE_PERIOD,
    SUSPENDED,
    CANCELLED
}
