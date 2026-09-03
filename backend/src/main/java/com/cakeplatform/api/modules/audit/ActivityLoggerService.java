package com.cakeplatform.api.modules.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLoggerService {

    private final ActivityLogRepository activityLogRepository;

    @Async
    public void logActivity(Long actorUserId, Long shopId, String action, String entityType, Long entityId, String metadata) {
        ActivityLog log = new ActivityLog();
        log.setActorUserId(actorUserId);
        log.setShopId(shopId);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setMetadata(metadata);
        
        activityLogRepository.save(log);
    }
}
