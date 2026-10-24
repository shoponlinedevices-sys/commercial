-- Store transaction references as strings (for example, INV-IMP-... or order IDs).
DELIMITER $$

DROP PROCEDURE IF EXISTS migrate_inventory_reference_id_type$$

CREATE PROCEDURE migrate_inventory_reference_id_type()
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
      AND COLUMN_NAME = 'reference_id'
  ) THEN
    ALTER TABLE `tbl_inventory_transactions`
      ADD COLUMN `reference_id` varchar(255) DEFAULT NULL;
  ELSE
    ALTER TABLE `tbl_inventory_transactions`
      MODIFY COLUMN `reference_id` varchar(255) DEFAULT NULL;
  END IF;
END$$

CALL migrate_inventory_reference_id_type()$$
DROP PROCEDURE migrate_inventory_reference_id_type$$

DELIMITER ;
