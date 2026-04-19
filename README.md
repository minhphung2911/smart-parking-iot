# Smart Parking IoT

##  Giới thiệu
Hệ thống Quản lý Bãi đậu xe thông minh (Smart Parking) tập trung vào:
- Quản lý vị trí trống theo thời gian thực
- Tính phí đỗ xe dựa trên thời gian
- Thống kê doanh thu

Gồm phần cứng Arduino (cảm biến IR), mô phỏng Proteus, ứng dụng WinForms và database lưu trữ.

##  Thành viên phân công

| Module | Người phụ trách |
|--------|----------------|
| `arduino/` + `proteus/` | Người 1 |
| `backend/` + `database/` | Người 2 |
| `winforms/` | Người 2 + Người 3 |
| `web/` | Người 3 |

##  Cấu trúc thư mục

```
smart-parking/
├── arduino/          # Code Arduino (C++)
│   ├── parking.ino
│   └── README.md
├── proteus/          # Mạch mô phỏng Proteus
│   └── SmartParking/
│       ├── parking.pdsprj
│       ├── parking.DSN
│       └── backup/
├── backend/          # API backend (Python)
│   ├── services/
│   ├── models/
│   └── serial/
├── winforms/         # Ứng dụng C# WinForms
│   └── README.md
├── web/              # Giao diện web
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/         # Database SQL
│   ├── schema.sql
│   └── seed.sql
└── docs/             # Tài liệu nộp bài
    ├── report.docx
    ├── diagram.png
    └── demo.mp4
```

##  Tính năng

- **Phát hiện xe vào/ra**: Cảm biến IR tại cổng
- **Kiểm tra vị trí trống**: Cảm biến IR tại từng chỗ đỗ
- **Hiển thị sơ đồ realtime**: WinForms hiển thị trạng thái từng vị trí
- **Quản lý xe**: Lưu biển số (giả lập), thời gian vào/ra
- **Tính phí**: Tự động tính tiền theo giờ đỗ
- **Thống kê**: Doanh thu theo ngày/tuần/tháng
- **Lưu trữ**: Database MySQL

##  Cách sử dụng

### Arduino
1. Mở `arduino/parking.ino` trong Arduino IDE
2. Upload code lên board Arduino Uno

### Proteus
1. Mở `proteus/SmartParking/parking.pdsprj`
2. Chạy mô phỏng

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Web
Mở `web/index.html` trong trình duyệt hoặc chạy local server.

---

**Deadline:** [Ngày nộp bài]
