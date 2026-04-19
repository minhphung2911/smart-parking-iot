-- Smart Parking Database Schema
-- Hệ thống quản lý bãi đậu xe + tính phí

CREATE DATABASE IF NOT EXISTS smart_parking;
USE smart_parking;

-- Vị trí đỗ xe
CREATE TABLE slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slot_number VARCHAR(10) NOT NULL UNIQUE,  -- A1, A2, A3
    status ENUM('available', 'occupied') DEFAULT 'available',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nhật ký xe vào/ra + tính phí
CREATE TABLE parking_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plate_number VARCHAR(20) NOT NULL,          -- Biển số xe (giả lập)
    slot_id INT,                                 -- Vị trí đỗ
    entry_time DATETIME NOT NULL,               -- Thời gian vào
    exit_time DATETIME,                         -- Thời gian ra
    duration_hours DECIMAL(5,2),                -- Số giờ đỗ
    hourly_rate DECIMAL(8,2) DEFAULT 5000,      -- Giá/giờ (VND)
    fee DECIMAL(10,2),                          -- Tổng tiền
    status ENUM('parking', 'completed') DEFAULT 'parking',
    FOREIGN KEY (slot_id) REFERENCES slots(id)
);

-- Cấu hình hệ thống
CREATE TABLE config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hourly_rate DECIMAL(8,2) DEFAULT 5000,       -- Giá mặc định/giờ
    max_slots INT DEFAULT 3
);

-- View doanh thu theo ngày
CREATE VIEW revenue_by_day AS
SELECT 
    DATE(exit_time) as date,
    COUNT(*) as total_cars,
    SUM(fee) as total_revenue
FROM parking_logs
WHERE status = 'completed'
GROUP BY DATE(exit_time);
