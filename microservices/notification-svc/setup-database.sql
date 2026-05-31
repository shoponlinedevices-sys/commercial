-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS commercial;
USE commercial;

-- Create TypeORM metadata table
CREATE TABLE IF NOT EXISTS typeorm_metadata (
  type VARCHAR(50) NOT NULL,
  `database` VARCHAR(50) NOT NULL,
  `schema` VARCHAR(50) NOT NULL,
  `table` VARCHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL,
  value TEXT,
  PRIMARY KEY (type, `database`, `schema`, `table`, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
