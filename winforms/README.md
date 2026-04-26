# WinForms Application

## SmartParking.sln
Ứng dụng C# WinForms quản lý bãi đậu xe thông minh.

## Chức năng chính

### 1. Sơ đồ bãi xe (Realtime)
- Hiển thị sơ đồ 5 vị trí đỗ: S1, S2, S3, S4, S5
- Màu xanh: Vị trí trống (HIGH)
- Màu đỏ: Có xe đỗ (LOW)
- Cập nhật tự động từ Arduino (Serial: `SLOTS:1,0,1,0,1,MODE:AUTO`)

### 2. Chế độ Demo (AUTO/MANUAL)
- **AUTO Mode**: Arduino random tự động dòng xe (demo cho thầy)
- **MANUAL Mode**: Click vào slot để giả lập xe vào/ra
- Nút chuyển đổi: `MODE:AUTO` / `MODE:MANUAL` gửi qua Serial

### 3. Quản lý xe vào/ra
- **Biển số**: Random tự động khi xe vào (ví dụ: 51A-12345)
- **Thời gian**: Lưu TimeIn khi vào, TimeOut khi ra
- **Tính phí**: Tự động tính theo giờ đỗ (giá/giờ: 5000 VND)
- **Phát hiện**: IR sensor tại cổng (IR_ENTER, IR_BACK)

### 4. Thống kê & Báo cáo
- Nhật ký xe vào/ra (biển số, thời gian, phí)
- Thống kê doanh thu theo ngày/tuần/tháng
- DataGridView hiển thị xe đang đỗ + lịch sử

### 5. Database
- SQL Server LocalDB: `ParkingDB`
- Bảng: `ParkingLog` (Plate, TimeIn, TimeOut, SlotNumber, Fee)

## Giao tiếp Serial (9600 baud)

### Arduino → WinForms
```
SLOTS:1,0,1,0,1,MODE:AUTO    # Trạng thái 5 slot + mode
ENTRY                        # Xe vào cổng
EXIT                         # Xe ra cổng
FULL                         # Bãi đầy
```

### WinForms → Arduino
```
MODE:AUTO                    # Chuyển sang mode auto
MODE:MANUAL                  # Chuyển sang mode manual
SLOT:0,1                     # Set slot 0 = occupied (manual)
SLOT:0,0                     # Set slot 0 = empty (manual)
```

## UI Components
- Panel sơ đồ bãi xe (5 slot clickable)
- Nút "AUTO Demo" / "MANUAL"
- DataGridView xe đang đỗ
- DataGridView lịch sử xe ra
- Nút "XE VÀO" / "XE RA" (thủ công)
