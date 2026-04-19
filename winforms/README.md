# WinForms Application

## SmartParking.sln
Ứng dụng C# WinForms quản lý bãi đậu xe thông minh.

## Chức năng chính

### 1. Sơ đồ bãi xe (Realtime)
- Hiển thị sơ đồ 3 vị trí đỗ: A1, A2, A3
- Màu xanh: Vị trí trống
- Màu đỏ: Có xe đỗ
- Cập nhật tự động từ cảm biến Arduino

### 2. Quản lý xe vào/ra
- Tự động phát hiện xe qua cổng (IR sensor)
- Nhập biển số xe (giả lập) khi vào bãi
- Tính thời gian đỗ và phí tự động khi ra

### 3. Thống kê & Báo cáo
- Nhật ký xe vào/ra (biển số, thời gian, phí)
- Thống kê doanh thu theo ngày/tuần/tháng
- Export Excel/PDF

## Giao tiếp
- Serial COM port với Arduino (9600 baud)
- MySQL database
