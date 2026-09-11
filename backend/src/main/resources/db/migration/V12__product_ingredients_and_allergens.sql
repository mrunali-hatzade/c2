-- ============================================================
-- V12__product_ingredients_and_allergens.sql
-- Real Owner Ingredients & Allergen Information for Products
-- ============================================================

-- 1. Add nullable ingredients and allergens columns to products table
ALTER TABLE products ADD COLUMN ingredients TEXT;
ALTER TABLE products ADD COLUMN allergens TEXT;
