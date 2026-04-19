-- Sample data

-- Vị trí đỗ
INSERT INTO slots (slot_number, status) VALUES 
('A1', 'available'),
('A2', 'available'),
('A3', 'available');

-- Cấu hình
INSERT INTO config (hourly_rate, max_slots) VALUES (5000, 3);

-- Nhật ký xe vào/ra mẫu (để demo thống kê)
INSERT INTO parking_logs (plate_number, slot_id, entry_time, exit_time, duration_hours, fee, status) VALUES
('51A-12345', 1, '2025-04-18 08:00:00', '2025-04-18 12:00:00', 4.00, 20000, 'completed'),
('51B-67890', 2, '2025-04-18 09:30:00', '2025-04-18 11:30:00', 2.00, 10000, 'completed'),
('51C-11111', 1, '2025-04-19 10:00:00', NULL, NULL, NULL, 'parking');
