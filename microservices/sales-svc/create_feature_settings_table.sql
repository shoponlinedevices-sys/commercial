-- Create Feature Settings Table for Flash Sale and Promotion Management
-- Database: commercial
-- Run this in MySQL Workbench or command line: mysql -u root -p commercial < create_feature_settings_table.sql

USE commercial;

-- Create feature_settings table
CREATE TABLE IF NOT EXISTS feature_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    feature_key VARCHAR(100) NOT NULL UNIQUE,
    feature_name VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    config JSON,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_feature_key (feature_key),
    INDEX idx_is_enabled (is_enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default feature settings
INSERT INTO feature_settings (feature_key, feature_name, is_enabled, config, start_time, end_time) VALUES
('flash_sale', 'Flash Sale Component', FALSE, 
 '{"discount_percent": 20, "badge_text": "Flash Sale", "max_products": 10}', 
 NULL, NULL),
('promotion', 'Promotion Component', FALSE, 
 '{"badge_text": "Khuyến Mãi", "min_discount": 10}', 
 NULL, NULL),
('hot_deal', 'Hot Deal Component', FALSE, 
 '{"badge_text": "Hot Deal", "min_discount": 15}', 
 NULL, NULL),
('best_seller', 'Best Seller Component', TRUE, 
 '{"badge_text": "Best Seller", "min_sales": 50}', 
 NULL, NULL),
('limited', 'Limited Edition Component', FALSE, 
 '{"badge_text": "Limited", "max_quantity": 100}', 
 NULL, NULL);

-- Query to check current settings
-- SELECT * FROM feature_settings;

-- To enable/disable a feature, update is_enabled:
-- UPDATE feature_settings SET is_enabled = TRUE WHERE feature_key = 'flash_sale';
-- UPDATE feature_settings SET is_enabled = FALSE WHERE feature_key = 'promotion';

-- To update config:
-- UPDATE feature_settings SET config = '{"discount_percent": 30, "badge_text": "Super Sale"}' WHERE feature_key = 'flash_sale';
