CREATE TABLE IF NOT EXISTS emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `to` VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  template VARCHAR(100),
  templateData JSON,
  status VARCHAR(50) DEFAULT 'pending',
  messageId VARCHAR(255),
  error TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  sentAt DATETIME,
  INDEX idx_to (to),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
