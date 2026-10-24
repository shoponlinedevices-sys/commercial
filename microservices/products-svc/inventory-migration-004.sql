-- Store the operator user ID in inventory transaction audit rows.
DELIMITER $$

DROP PROCEDURE IF EXISTS migrate_inventory_created_by_type$$

CREATE PROCEDURE migrate_inventory_created_by_type()
BEGIN
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
      AND TABLE_NAME = 'tbl_inventory_transactions'
      AND COLUMN_NAME = 'created_by'
  ) THEN
    ALTER TABLE `tbl_inventory_transactions`
      ADD COLUMN `created_by` int DEFAULT NULL;
  ELSE
    ALTER TABLE `tbl_inventory_transactions`
      MODIFY COLUMN `created_by` int DEFAULT NULL;
  END IF;
END$$

CALL migrate_inventory_created_by_type()$$
DROP PROCEDURE migrate_inventory_created_by_type$$

DELIMITER ;
