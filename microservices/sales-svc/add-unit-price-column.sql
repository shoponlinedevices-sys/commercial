USE commercial;

-- Add unit_price column if it doesn't exist
ALTER TABLE tbl_order_lines 
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER product_id;
