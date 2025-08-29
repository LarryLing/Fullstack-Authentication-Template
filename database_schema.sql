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
  last_logged_in_at BIGINT NULL,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_verified_at (verified_at)
);

-- Verification codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  user_id VARCHAR(36) NOT NULL,
  issued_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  code VARCHAR(10) NOT NULL,
  type ENUM('email_confirmation', 'password_reset') NOT NULL,
  PRIMARY KEY (user_id, code, type),
  INDEX idx_user_id_type (user_id, type),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
