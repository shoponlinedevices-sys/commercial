CREATE TABLE IF NOT EXISTS history_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  action VARCHAR(50) NOT NULL,
  entityType VARCHAR(50) NOT NULL,
  entityId VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  createdBy VARCHAR(100) NOT NULL,
  metadata JSON NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX idx_history_log_entity (entityType, entityId),
  INDEX idx_history_log_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
