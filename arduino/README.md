# Arduino Module

## Hardware Requirements
- Arduino Uno
- IR sensors x5 (2 cổng vào/ra + 3 chỗ đỗ)
- Servo motor SG90 (barrier cổng vào)
- LCD 16x2 I2C (hiển thị số chỗ trống)

## Chức năng
- **IR cổng**: Phát hiện xe vào/ra
- **IR tại vị trí đỗ**: Kiểm tra còn trống hay đã có xe
- **Servo**: Mở/đóng barrier khi có xe vào

## Pin Mapping
| Component | Pin | Chức năng |
|-----------|-----|-----------|
| IR_GATE_IN | D2 | Phát hiện xe vào cổng |
| IR_GATE_OUT | D3 | Phát hiện xe ra cổng |
| IR_SLOT_1 | D4 | Kiểm tra vị trí A1 |
| IR_SLOT_2 | D5 | Kiểm tra vị trí A2 |
| IR_SLOT_3 | D6 | Kiểm tra vị trí A3 |
| SERVO_GATE | D9 | Barrier cổng vào |

## Serial Protocol (9600 baud)

### Arduino gửi lên PC
```
STATUS:GATE_IN=1,GATE_OUT=0,SLOTS=0,1,0
```
- `GATE_IN=1`: Có xe vào cổng
- `GATE_OUT=1`: Có xe ra cổng
- `SLOTS=x,y,z`: Trạng thái 3 chỗ đỗ (0=trống, 1=có xe)

### Arduino nhận từ PC
```
PLATE:51A12345    -> Biển số xe vào (do WinForms gửi)
GATE:OPEN         -> Mở barrier
GATE:CLOSE        -> Đóng barrier
```
