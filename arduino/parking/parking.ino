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

// ===== BIẾN =====
bool lastEnter = HIGH;
bool lastBack  = HIGH;

int slots[5];
int emptySlots = 0;

unsigned long lastEvent = 0;
int interval = 3000;

// ===== MODE: AUTO/MANUAL =====
bool autoMode = true;  // Default: AUTO mode (random)
bool manualSlotChange = false;  // Flag khi có lệnh manual

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
    
    if (cmd == "MODE:AUTO") {
      autoMode = true;
      Serial.println("MODE:OK");
    }
    else if (cmd == "MODE:MANUAL") {
      autoMode = false;
      Serial.println("MODE:OK");
    }
    else if (cmd.startsWith("SLOT:")) {
      // Lệnh manual: SLOT:0,1 (set slot 0 = 1 = occupied)
      int slotIndex = cmd.substring(5, 6).toInt();
      int slotValue = cmd.substring(7, 8).toInt();
      
      if (slotIndex >= 0 && slotIndex < 5) {
        digitalWrite(fakeSlotPins[slotIndex], slotValue == 1 ? LOW : HIGH);
        manualSlotChange = true;
        Serial.println("SLOT:OK");
      }
    }
  }

  // ===== AUTO MODE: RANDOM XE =====
  if (autoMode && millis() - lastEvent > interval) {

    int cars = 0;
    for (int i = 0; i < 5; i++) {
      if (digitalRead(fakeSlotPins[i]) == LOW) cars++;
    }

    // Random số lượng xe vào/ra (phân phối tự nhiên: thường 1-2 xe, ít khi 0 hoặc 3)
    int r = random(0, 10);
    int numCars;
    if (r < 2) numCars = 0;      // 20%: không có xe
    else if (r < 6) numCars = 1;  // 40%: 1 xe
    else if (r < 9) numCars = 2;  // 30%: 2 xe
    else numCars = 3;             // 10%: 3 xe

    for (int c = 0; c < numCars; c++) {
      int event;

      if (cars == 0) event = 0;          // Full trống -> chỉ có thể vào
      else if (cars == 5) event = 1;     // Full xe -> chỉ có thể ra
      else event = random(0, 2);         // Random vào hoặc ra

      if (event == 0 && cars < 5) {
        // ENTRY
        digitalWrite(F_ENTER, LOW);
        delay(50);
        digitalWrite(F_ENTER, HIGH);

        // chiếm slot trống đầu tiên
        for (int i = 0; i < 5; i++) {
          if (digitalRead(fakeSlotPins[i]) == HIGH) {
            digitalWrite(fakeSlotPins[i], LOW);
            cars++;
            break;
          }
        }

      } else if (event == 1 && cars > 0) {
        // EXIT
        digitalWrite(F_BACK, LOW);
        delay(50);
        digitalWrite(F_BACK, HIGH);

        // giải phóng slot đầu tiên
        for (int i = 0; i < 5; i++) {
          if (digitalRead(fakeSlotPins[i]) == LOW) {
            digitalWrite(fakeSlotPins[i], HIGH);
            cars--;
            break;
          }
        }
      }
    }

    interval = random(1000, 3000);
    lastEvent = millis();
  }

  // ===== ĐỌC SLOT =====
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
  lcd.print(autoMode ? "[AUTO] " : "[MAN] ");
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

  // ===== ENTRY =====
  int currentEnter = digitalRead(IR_ENTER);

  if (lastEnter == HIGH && currentEnter == LOW) {
    if (emptySlots > 0) {
      Serial.println("ENTRY");

      gate.write(90);
      delay(1000);
      gate.write(0);
    } else {
      Serial.println("FULL");
    }
  }

  lastEnter = currentEnter;

  // ===== EXIT =====
  int currentBack = digitalRead(IR_BACK);

  if (lastBack == HIGH && currentBack == LOW) {
    Serial.println("EXIT");

    gate.write(90);
    delay(1000);
    gate.write(0);
  }

  lastBack = currentBack;

  // ===== GỬI SLOT =====
  Serial.print("SLOTS:");
  for (int i = 0; i < 5; i++) {
    Serial.print(slots[i]);
    if (i < 4) Serial.print(",");
  }
  Serial.print(",MODE:");
  Serial.println(autoMode ? "AUTO" : "MANUAL");

  manualSlotChange = false;
  delay(300);
}