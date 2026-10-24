CREATE TABLE IF NOT EXISTS `tbl_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity_on_hand` int NOT NULL DEFAULT 0,
  `quantity_reserved` int NOT NULL DEFAULT 0,
  `reorder_level` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tbl_inventory_product_id` (`product_id`),
  CONSTRAINT `fk_tbl_inventory_product`
    FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_tbl_inventory_quantities`
    CHECK (`quantity_on_hand` >= 0 AND `quantity_reserved` >= 0 AND `quantity_reserved` <= `quantity_on_hand` AND `reorder_level` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_inventory_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `transaction_type` varchar(32) NOT NULL,
  `quantity` int NOT NULL DEFAULT 0,
  `reference_type` varchar(64) DEFAULT NULL,
  `reference_id` varchar(128) DEFAULT NULL,
  `quantity_before` int NOT NULL DEFAULT 0,
  `quantity_after` int NOT NULL DEFAULT 0,
  `note` text,
  `created_by` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tbl_inventory_transactions_product_created` (`product_id`, `createdAt`),
  KEY `idx_tbl_inventory_transactions_type_created` (`transaction_type`, `createdAt`),
  CONSTRAINT `fk_tbl_inventory_transactions_product`
    FOREIGN KEY (`product_id`) REFERENCES `tbl_product` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
