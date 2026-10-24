-- Add timestamp columns expected by the inventory TypeORM entities.
DELIMITER $$

DROP PROCEDURE IF EXISTS migrate_inventory_timestamp_columns$$

CREATE PROCEDURE migrate_inventory_timestamp_columns()
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tbl_inventory'
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'tbl_inventory is missing; run inventory-schema.sql first';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tbl_inventory_transactions'
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'tbl_inventory_transactions is missing; run inventory-schema.sql first';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tbl_inventory'
      AND COLUMN_NAME = 'createdAt'
  ) THEN
    ALTER TABLE `tbl_inventory`
      ADD COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tbl_inventory'
      AND COLUMN_NAME = 'updatedAt'
  ) THEN
    ALTER TABLE `tbl_inventory`
      ADD COLUMN `updatedAt` timestamp NOT NULL
      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tbl_inventory_transactions'
      AND COLUMN_NAME = 'createdAt'
  ) THEN
    ALTER TABLE `tbl_inventory_transactions`
      ADD COLUMN `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END$$

CALL migrate_inventory_timestamp_columns()$$
DROP PROCEDURE migrate_inventory_timestamp_columns$$

DELIMITER ;
