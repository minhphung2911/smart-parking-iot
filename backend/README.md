# Backend Module (ASP.NET Core Web API)

## Kiến trúc 3-tier
```
WinForms/Web → API (C#) → MySQL
                  ↕
              Arduino (Serial)
```

## Structure
```
backend/
├── Controllers/      # API endpoints (ParkingController, StatsController)
├── Models/           # Entity Framework models
├── Services/         # Business logic + Serial communication
├── appsettings.json  # DB connection string
└── Program.cs        # Entry point
```

## Dependencies (NuGet)
- `Microsoft.EntityFrameworkCore`
- `Pomelo.EntityFrameworkCore.MySql`
- `System.IO.Ports` (Serial communication)

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots` | Danh sách vị trí đỗ |
| GET | `/api/slots/{id}` | Chi tiết 1 vị trí |
| POST | `/api/parking/entry` | Xe vào (biển số, slot) |
| POST | `/api/parking/exit` | Xe ra (tính phí) |
| GET | `/api/stats/revenue` | Thống kê doanh thu |
| POST | `/api/gate/open` | Mở barrier |

## Serial Communication
- Service `SerialService` quản lý kết nối COM port
- Nhận data từ Arduino: `STATUS:GATE_IN=1,...`
- Gửi lệnh mở barrier: `GATE:OPEN`
