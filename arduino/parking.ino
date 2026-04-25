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

#define S1 5
#define S2 6
#define S3 7
#define S4 8

#define SERVO_PIN 3

// ===== BIẾN =====
bool lastEnter = HIGH;
bool lastBack  = HIGH;

int slots[4];
int emptySlots = 0;

void setup() {
  Serial.begin(9600);

  pinMode(IR_ENTER, INPUT);
  pinMode(IR_BACK, INPUT);

  pinMode(S1, INPUT);
  pinMode(S2, INPUT);
  pinMode(S3, INPUT);
  pinMode(S4, INPUT);

  gate.attach(SERVO_PIN);
  gate.write(0); // đóng cổng

  lcd.init();
  lcd.backlight();
}

void loop() {

  // ===== ĐỌC SLOT =====
  slots[0] = digitalRead(S1);
  slots[1] = digitalRead(S2);
  slots[2] = digitalRead(S3);
  slots[3] = digitalRead(S4);

  // ===== ĐẾM SLOT TRỐNG =====
  emptySlots = 0;
  for (int i = 0; i < 4; i++) {
    if (slots[i] == HIGH) emptySlots++;
  }

  // ===== HIỂN THỊ LCD =====
  lcd.clear();
  // ===== DÒNG 1 =====
  lcd.setCursor(0, 0);
  lcd.print("Have Slot: ");
  lcd.print(emptySlots);

  // ===== DÒNG 2 =====
  lcd.setCursor(0, 1);
  lcd.print("S1:");
  lcd.print(slots[0] == HIGH ? "Empty " : "Fill ");
  lcd.print("S2:");
  lcd.print(slots[1] == HIGH ? "Empty" : "Fill");

  // ===== DÒNG 3 =====
  lcd.setCursor(0, 2);
  lcd.print("S3:");
  lcd.print(slots[2] == HIGH ? "Empty " : "Fill ");
  lcd.print("S4:");
  lcd.print(slots[3] == HIGH ? "Empty" : "Fill");

  // ===== ENTRY =====
  int currentEnter = digitalRead(IR_ENTER);

  if (lastEnter == HIGH && currentEnter == LOW) {
    if (emptySlots > 0) {
      Serial.println("ENTRY");

      gate.write(90);
      delay(2000);
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
    delay(2000);
    gate.write(0);
  }

  lastBack = currentBack;

  // ===== GỬI SLOT =====
  Serial.print("SLOTS:");
  for (int i = 0; i < 4; i++) {
    Serial.print(slots[i]);
    if (i < 3) Serial.print(",");
  }
  Serial.println();

  delay(500);
}