-- ============================================================
-- V9__product_categories.sql
-- Relational Product Categories & Product Association
-- ============================================================

-- 1. Create product_categories table
CREATE TABLE product_categories (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 2. Fast lookup index on shop_id
CREATE INDEX idx_product_categories_shop_id ON product_categories(shop_id);

-- 3. Unified case-insensitive, trimmed uniqueness index per shop
CREATE UNIQUE INDEX uq_shop_category_name_lower ON product_categories(shop_id, LOWER(TRIM(name)));

-- 4. Alter products table to link category (NULLABLE - NO FAKE CATEGORIES ASSIGNED)
ALTER TABLE products ADD COLUMN category_id BIGINT;

-- 5. Foreign key constraint with RESTRICT to prevent accidental product deletion
ALTER TABLE products 
    ADD CONSTRAINT fk_product_category 
    FOREIGN KEY (category_id) 
    REFERENCES product_categories(id) 
    ON DELETE RESTRICT;

-- 6. Index on category_id for fast filtering
CREATE INDEX idx_products_category_id ON products(category_id);
