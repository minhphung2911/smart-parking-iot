// Smart Parking - Arduino Code
// 5 IR sensors: 2 cổng (vào/ra) + 3 vị trí đỗ

#include <Servo.h>
#include <LiquidCrystal_I2C.h>

#define IR_GATE_IN   2   // Phát hiện xe vào cổng
#define IR_GATE_OUT  3   // Phát hiện xe ra cổng  
#define IR_SLOT_1    4   // Vị trí đỗ A1
#define IR_SLOT_2    5   // Vị trí đỗ A2
#define IR_SLOT_3    6   // Vị trí đỗ A3
#define SERVO_GATE   9   // Servo barrier cổng vào

Servo barrierServo;
LiquidCrystal_I2C lcd(0x27, 16, 2);  // LCD I2C

void setup() {
  Serial.begin(9600);
  
  // IR sensors
  pinMode(IR_GATE_IN, INPUT);
  pinMode(IR_GATE_OUT, INPUT);
  pinMode(IR_SLOT_1, INPUT);
  pinMode(IR_SLOT_2, INPUT);
  pinMode(IR_SLOT_3, INPUT);
  
  // Servo
  barrierServo.attach(SERVO_GATE);
  barrierServo.write(0);  // Đóng barrier
  
  // LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Smart Parking");
  
  Serial.println("Smart Parking Ready");
}

int gateInPrev = 0, gateOutPrev = 0;

void loop() {
  // Đọc tất cả cảm biến
  int gateIn = digitalRead(IR_GATE_IN);
  int gateOut = digitalRead(IR_GATE_OUT);
  int s1 = digitalRead(IR_SLOT_1);
  int s2 = digitalRead(IR_SLOT_2);
  int s3 = digitalRead(IR_SLOT_3);
  
  // Đếm số chỗ trống
  int emptySlots = (s1==0) + (s2==0) + (s3==0);
  
  // Hiển thị LCD
  lcd.setCursor(0, 1);
  lcd.print("Trong:");
  lcd.print(emptySlots);
  lcd.print("  ");
  
  // Phát hiện cạnh lên (xe vào/ra)
  int gateInTrigger = (gateIn == 1 && gateInPrev == 0) ? 1 : 0;
  int gateOutTrigger = (gateOut == 1 && gateOutPrev == 0) ? 1 : 0;
  
  // Gửi status lên WinForms
  Serial.print("STATUS:");
  Serial.print("GATE_IN="); Serial.print(gateInTrigger);
  Serial.print(",GATE_OUT="); Serial.print(gateOutTrigger);
  Serial.print(",SLOTS=");
  Serial.print(s1); Serial.print(",");
  Serial.print(s2); Serial.print(",");
  Serial.println(s3);
  
  // Lưu trạng thái trước
  gateInPrev = gateIn;
  gateOutPrev = gateOut;
  
  // Nhận lệnh từ WinForms
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    
    if (cmd == "GATE:OPEN") {
      barrierServo.write(90);  // Mở barrier
      delay(3000);             // Chờ 3s
      barrierServo.write(0);   // Đóng barrier
    }
  }
  
  delay(500);
}
