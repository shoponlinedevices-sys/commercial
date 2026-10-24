-- Upgrade existing inventory installations with the transaction snapshot columns
-- required by InventoryTransactionEntity.
DELIMITER $$

DROP PROCEDURE IF EXISTS migrate_inventory_transaction_snapshot_columns$$

CREATE PROCEDURE migrate_inventory_transaction_snapshot_columns()
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
      AND COLUMN_NAME = 'quantity_before'
  ) THEN
    ALTER TABLE `tbl_inventory_transactions`
      ADD COLUMN `quantity_before` int NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tbl_inventory_transactions'
      AND COLUMN_NAME = 'quantity_after'
  ) THEN
    ALTER TABLE `tbl_inventory_transactions`
      ADD COLUMN `quantity_after` int NOT NULL DEFAULT 0;
  END IF;
END$$

CALL migrate_inventory_transaction_snapshot_columns()$$
DROP PROCEDURE migrate_inventory_transaction_snapshot_columns$$

DELIMITER ;
