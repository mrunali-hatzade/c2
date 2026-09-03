-- Product Variants (Weights/Sizes)
CREATE TABLE IF NOT EXISTS product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., '0.5 kg', '1 kg', 'Large'
    price NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Product Addons (Candles, Toppers, etc.)
CREATE TABLE IF NOT EXISTS product_addons (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., 'Sparkle Candle', 'Photo Print'
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Shop Delivery / Pickup Slots
CREATE TABLE IF NOT EXISTS shop_delivery_slots (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL, -- 'MONDAY', 'TUESDAY', etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_orders INT NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Modify OrderItem to capture customization details
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_name VARCHAR(255);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS dietary_preference VARCHAR(50); -- EGGLESS, SUGAR_FREE
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS cake_message VARCHAR(255);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS photo_reference_url VARCHAR(255);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS addons_summary TEXT;

-- Modify Order to link to a delivery slot
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_slot_id BIGINT REFERENCES shop_delivery_slots(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_date DATE;
