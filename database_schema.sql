-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS auth_template;
USE fullstack_template;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at BIGINT NOT NULL,
  verified_at BIGINT NULL,
  last_logged_in_at BIGINT NULL
);

-- Verification codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  issued_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  type ENUM('signup', 'password_reset') NOT NULL,
  PRIMARY KEY (id, type),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
