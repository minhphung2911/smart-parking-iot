#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Servo.h>

// ===== LCD =====
LiquidCrystal_I2C lcd(0x27, 20, 4);

// ===== SERVO =====
Servo gate;

// ===== PIN =====
#define IR_ENTER 2
#define IR_BACK  4

#define S1 12
#define S2 13
#define S3 A0
#define S4 A1
#define S5 A2

#define SERVO_PIN 3

// ===== FAKE SENSOR OUTPUT =====
#define F_ENTER 10
#define F_BACK  11

int fakeSlotPins[5] = {12, 13, A0, A1, A2};

// ===== VARIABLES =====
bool lastEnter = HIGH;
bool lastBack  = HIGH;

int slots[5];
int emptySlots = 0;

unsigned long lastEvent = 0;
int interval = 3000;

// Direction detection
unsigned long enterBlockedTime = 0;
unsigned long backBlockedTime = 0;
const unsigned long DIRECTION_TIMEOUT = 2000; // 2 giây để xác định hướng

// ===== VARIABLES FLAG =====
bool manualSlotChange = false;  // Flag when there is a manual command

void setup() {
  Serial.begin(9600);

  pinMode(IR_ENTER, INPUT);
  pinMode(IR_BACK, INPUT);

  pinMode(S1, INPUT);
  pinMode(S2, INPUT);
  pinMode(S3, INPUT);
  pinMode(S4, INPUT);
  pinMode(S5, INPUT);

  // OUTPUT fake sensor
  pinMode(F_ENTER, OUTPUT);
  pinMode(F_BACK, OUTPUT);

  for (int i = 0; i < 5; i++) {
    pinMode(fakeSlotPins[i], OUTPUT);
    digitalWrite(fakeSlotPins[i], HIGH); // mặc định trống
  }

  digitalWrite(F_ENTER, HIGH);
  digitalWrite(F_BACK, HIGH);

  randomSeed(analogRead(A5));

  gate.attach(SERVO_PIN);
  gate.write(0);

  lcd.init();
  lcd.backlight();
}

void loop() {

  // ===== NHẬN LỆNH TỪ WINFORMS =====
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    
    if (cmd.startsWith("SLOT:")) {
      // Lệnh manual: SLOT:0,1 (set slot 0 = 1 = occupied)
      int slotIndex = cmd.substring(5, 6).toInt();
      int slotValue = cmd.substring(7, 8).toInt();
      
      if (slotIndex >= 0 && slotIndex < 5) {
        digitalWrite(fakeSlotPins[slotIndex], slotValue == 1 ? LOW : HIGH);
        manualSlotChange = true;
        Serial.println("SLOT:OK");
      }
    }
    else if (cmd == "GATE:ENTRY" || cmd == "GATE:EXIT") {
      // Mở cổng (dùng chung 1 cổng cho vào và ra)
      Serial.println("GATE:OPENING");
      gate.attach(SERVO_PIN);
      gate.write(90);  // Mở
      delay(3000);     // Chờ 3 giây
      gate.write(0);   // Đóng
      delay(1000);     // Chờ servo về vị trí 0
      Serial.println("GATE:CLOSED");
    }
  }

  // ===== READ SLOTS =====
  slots[0] = digitalRead(S1);
  slots[1] = digitalRead(S2);
  slots[2] = digitalRead(S3);
  slots[3] = digitalRead(S4);
  slots[4] = digitalRead(S5);

  // ===== ĐẾM SLOT =====
  emptySlots = 0;
  for (int i = 0; i < 5; i++) {
    if (slots[i] == HIGH) emptySlots++;
  }

  // ===== LCD =====
  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("[MAN] ");
  lcd.print("Slot:");
  lcd.print(emptySlots);

  lcd.setCursor(0, 1);
  lcd.print("S1:");
  lcd.print(slots[0] == HIGH ? "Empty " : "Fill ");
  lcd.print("S2:");
  lcd.print(slots[1] == HIGH ? "Empty" : "Fill");

  lcd.setCursor(0, 2);
  lcd.print("S3:");
  lcd.print(slots[2] == HIGH ? "Empty " : "Fill ");
  lcd.print("S4:");
  lcd.print(slots[3] == HIGH ? "Empty" : "Fill");

  lcd.setCursor(0, 3);
  lcd.print("S5:");
  lcd.print(slots[4] == HIGH ? "Empty" : "Fill");

  // ===== DIRECTION DETECTION =====
  int currentEnter = digitalRead(IR_ENTER);
  int currentBack = digitalRead(IR_BACK);
  unsigned long now = millis();

  // Ghi nhận thời điểm IR bị che
  if (lastEnter == HIGH && currentEnter == LOW) {
    enterBlockedTime = now;
  }
  if (lastBack == HIGH && currentBack == LOW) {
    backBlockedTime = now;
  }

  // Xe vào: IR_ENTER bị che trước, sau đó IR_BACK bị che trong vòng 2 giây
  if (enterBlockedTime > 0 && backBlockedTime > 0) {
    if (enterBlockedTime < backBlockedTime && (backBlockedTime - enterBlockedTime) < DIRECTION_TIMEOUT) {
      // Xe vào
      if (emptySlots > 0) {
        Serial.println("ENTRY");
        gate.attach(SERVO_PIN);
        gate.write(90);
        delay(3000);
        gate.write(0);
        delay(1000);
        Serial.println("GATE:CLOSED");
      } else {
        Serial.println("FULL");
      }
      // Reset
      enterBlockedTime = 0;
      backBlockedTime = 0;
    }
    else if (backBlockedTime < enterBlockedTime && (enterBlockedTime - backBlockedTime) < DIRECTION_TIMEOUT) {
      // Xe ra
      Serial.println("EXIT");
      gate.attach(SERVO_PIN);
      gate.write(90);
      delay(3000);
      gate.write(0);
      delay(1000);
      Serial.println("GATE:CLOSED");
      // Reset
      enterBlockedTime = 0;
      backBlockedTime = 0;
    }
  }

  // Timeout - reset nếu chỉ có 1 IR bị che mà không có cái thứ 2
  if (enterBlockedTime > 0 && (now - enterBlockedTime) > DIRECTION_TIMEOUT) {
    enterBlockedTime = 0;
  }
  if (backBlockedTime > 0 && (now - backBlockedTime) > DIRECTION_TIMEOUT) {
    backBlockedTime = 0;
  }

  lastEnter = currentEnter;
  lastBack = currentBack;

  // ===== GỬI SLOT =====
  // Chỉ gửi nếu không vừa thay đổi manual (cho pin ổn định)
  if (!manualSlotChange) {
    Serial.print("SLOTS:");
    for (int i = 0; i < 5; i++) {
      Serial.print(slots[i]);
      if (i < 4) Serial.print(",");
    }
    Serial.println();
  }

  manualSlotChange = false;
  delay(300);
}
