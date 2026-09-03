-- Add customer and payment details to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Update existing orders to have placeholder values
UPDATE orders SET customer_name = 'Guest Customer' WHERE customer_name IS NULL;
UPDATE orders SET customer_email = 'guest@example.com' WHERE customer_email IS NULL;
UPDATE orders SET payment_method = 'COD' WHERE payment_method IS NULL;
