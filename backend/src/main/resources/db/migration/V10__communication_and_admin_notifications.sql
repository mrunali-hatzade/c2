-- ============================================================
-- V10__communication_and_admin_notifications.sql
-- Phase G: Platform Feedback, Contact Enquiries & Admin Notifications
-- ============================================================

-- 1. Platform Feedback from Shop Owners
CREATE TABLE IF NOT EXISTS platform_feedback (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shop_id BIGINT REFERENCES shops(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_feedback_owner_id ON platform_feedback(owner_id);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_shop_id ON platform_feedback(shop_id);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_is_read ON platform_feedback(is_read);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_created_at ON platform_feedback(created_at DESC);

-- 2. Contact Enquiries from Public Visitors or Authenticated Users
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_enquiries_is_read ON contact_enquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at ON contact_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_email ON contact_enquiries(email);

-- 3. Persistent Admin Notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1024) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    category VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    recipient_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    reference_id VARCHAR(100),
    reference_type VARCHAR(100),
    action_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_recipient_unread ON admin_notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_category ON admin_notifications(category);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);

-- 4. Database-level Idempotency: Unique indexes to prevent race-condition duplicates
CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_notifications_idempotency 
    ON admin_notifications (type, reference_type, reference_id, recipient_id) 
    WHERE reference_type IS NOT NULL AND reference_id IS NOT NULL AND recipient_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_notifications_broadcast_idempotency 
    ON admin_notifications (type, reference_type, reference_id) 
    WHERE reference_type IS NOT NULL AND reference_id IS NOT NULL AND recipient_id IS NULL;
