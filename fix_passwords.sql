-- Run this in phpMyAdmin SQL tab to update all existing plain-text passwords to BCrypt hashes
-- BCrypt hash for password: 123456
-- Generated using: BCrypt.hashpw("123456", BCrypt.gensalt())

UPDATE user SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE password = '123456';

-- The above BCrypt hash decodes to: 123456
-- After running this, you can login with email and password: 123456
