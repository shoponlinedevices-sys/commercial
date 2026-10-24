-- Normalize created_by to a nullable integer user ID.
-- Non-numeric values from an earlier name-based schema are not user IDs and are cleared.
DELIMITER $$

DROP PROCEDURE IF EXISTS migrate_inventory_created_by_user_id$$

CREATE PROCEDURE migrate_inventory_created_by_user_id()
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
    UPDATE `tbl_inventory_transactions`
    SET `created_by` = NULL
    WHERE `created_by` IS NOT NULL
      AND CAST(`created_by` AS CHAR) NOT REGEXP '^[0-9]+$';

    ALTER TABLE `tbl_inventory_transactions`
      MODIFY COLUMN `created_by` int DEFAULT NULL;
  END IF;
END$$

CALL migrate_inventory_created_by_user_id()$$
DROP PROCEDURE migrate_inventory_created_by_user_id$$

DELIMITER ;
