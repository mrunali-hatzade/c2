package com.cakeplatform.api.modules.audit;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_user_id")
    private Long actorUserId;

    @Column(name = "shop_id")
    private Long shopId;

    @Column(nullable = false)
    private String action; // e.g., SHOP_REGISTERED, SUBSCRIPTION_ACTIVATED

    @Column(name = "entity_type")
    private String entityType; // e.g., SHOP, SUBSCRIPTION

    @Column(name = "entity_id")
    private Long entityId;

    private String metadata; // JSON or text

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
