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

// ===== SENSOR STATE =====
int slots[5];
int lastSlots[5] = {-1, -1, -1, -1, -1};
int emptySlots = 0;

// ===== DIRECTION DETECTION =====
bool lastEnter = HIGH;
bool lastBack  = HIGH;
unsigned long enterBlockedTime = 0;
unsigned long backBlockedTime = 0;
const unsigned long DIRECTION_TIMEOUT = 2000;

// ===== NON-BLOCKING TIMERS =====
unsigned long lastLcdUpdate = 0;
const unsigned long LCD_INTERVAL = 400;

unsigned long lastSerialSend = 0;
const unsigned long SERIAL_INTERVAL = 500;

// ===== GATE STATE MACHINE =====
enum GateState { GATE_IDLE, GATE_OPEN, GATE_WAIT_CLOSE, GATE_CLOSING };
GateState gateState = GATE_IDLE;
unsigned long gateTimer = 0;
const unsigned long GATE_OPEN_DURATION = 3000;
const unsigned long GATE_CLOSE_DURATION = 1000;

// ===== FLAGS =====
bool manualSlotChange = false;
bool slotsChanged = false;

void setup() {
  Serial.begin(9600);

  pinMode(IR_ENTER, INPUT);
  pinMode(IR_BACK, INPUT);

  pinMode(S1, INPUT);
  pinMode(S2, INPUT);
  pinMode(S3, INPUT);
  pinMode(S4, INPUT);
  pinMode(S5, INPUT);

  pinMode(F_ENTER, OUTPUT);
  pinMode(F_BACK, OUTPUT);

  for (int i = 0; i < 5; i++) {
    pinMode(fakeSlotPins[i], OUTPUT);
    digitalWrite(fakeSlotPins[i], HIGH);
  }

  digitalWrite(F_ENTER, HIGH);
  digitalWrite(F_BACK, HIGH);

  randomSeed(analogRead(A5));

  gate.attach(SERVO_PIN);
  gate.write(0);

  lcd.init();
  lcd.backlight();
}

// ===== NON-BLOCKING GATE CONTROL =====
void gateOpen() {
  if (gateState != GATE_IDLE) return;
  gateState = GATE_OPEN;
  gateTimer = millis();
  gate.attach(SERVO_PIN);
  gate.write(90);
}

void updateGate() {
  unsigned long now = millis();
  switch (gateState) {
    case GATE_OPEN:
      if (now - gateTimer >= GATE_OPEN_DURATION) {
        gate.write(0);
        gateState = GATE_WAIT_CLOSE;
        gateTimer = now;
      }
      break;
    case GATE_WAIT_CLOSE:
      if (now - gateTimer >= GATE_CLOSE_DURATION) {
        gateState = GATE_IDLE;
        Serial.println("GATE:CLOSED");
      }
      break;
    default:
      break;
  }
}

// ===== LCD: ONLY UPDATE WHEN NEEDED =====
void updateLcd() {
  unsigned long now = millis();
  if (now - lastLcdUpdate < LCD_INTERVAL && !slotsChanged) return;
  lastLcdUpdate = now;

  lcd.setCursor(0, 0);
  lcd.print("[MAN] Slot:");
  lcd.print(emptySlots);
  lcd.print("   "); // overwrite trailing chars

  lcd.setCursor(0, 1);
  lcd.print("S1:");
  lcd.print(slots[0] == HIGH ? "Empty " : "Fill ");
  lcd.print("S2:");
  lcd.print(slots[1] == HIGH ? "Empty " : "Fill ");
  lcd.print("  ");

  lcd.setCursor(0, 2);
  lcd.print("S3:");
  lcd.print(slots[2] == HIGH ? "Empty " : "Fill ");
  lcd.print("S4:");
  lcd.print(slots[3] == HIGH ? "Empty " : "Fill ");
  lcd.print("  ");

  lcd.setCursor(0, 3);
  lcd.print("S5:");
  lcd.print(slots[4] == HIGH ? "Empty " : "Fill ");
  lcd.print("        ");
}

// ===== SERIAL: SEND AT LIMITED RATE =====
void sendSlots() {
  unsigned long now = millis();
  if (now - lastSerialSend < SERIAL_INTERVAL) return;
  lastSerialSend = now;

  if (!manualSlotChange) {
    Serial.print("SLOTS:");
    for (int i = 0; i < 5; i++) {
      Serial.print(slots[i]);
      if (i < 4) Serial.print(",");
    }
    Serial.println();
  }
  manualSlotChange = false;
}

void loop() {
  unsigned long now = millis();

  // ===== HANDLE SERIAL COMMANDS =====
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd.startsWith("SLOT:")) {
      int slotIndex = cmd.substring(5, 6).toInt();
      int slotValue = cmd.substring(7, 8).toInt();
      if (slotIndex >= 0 && slotIndex < 5) {
        digitalWrite(fakeSlotPins[slotIndex], slotValue == 1 ? LOW : HIGH);
        manualSlotChange = true;
        Serial.println("SLOT:OK");
      }
    }
    else if (cmd == "GATE:ENTRY" || cmd == "GATE:EXIT") {
      Serial.println("GATE:OPENING");
      gateOpen();
    }
  }

  // ===== READ SLOTS =====
  slotsChanged = false;
  for (int i = 0; i < 5; i++) {
    slots[i] = digitalRead(fakeSlotPins[i]);
    if (slots[i] != lastSlots[i]) {
      slotsChanged = true;
      lastSlots[i] = slots[i];
    }
  }

  // ===== COUNT EMPTY SLOTS =====
  emptySlots = 0;
  for (int i = 0; i < 5; i++) {
    if (slots[i] == HIGH) emptySlots++;
  }

  // ===== DIRECTION DETECTION =====
  int currentEnter = digitalRead(IR_ENTER);
  int currentBack = digitalRead(IR_BACK);

  if (lastEnter == HIGH && currentEnter == LOW) {
    enterBlockedTime = now;
  }
  if (lastBack == HIGH && currentBack == LOW) {
    backBlockedTime = now;
  }

  if (enterBlockedTime > 0 && backBlockedTime > 0) {
    unsigned long diff = backBlockedTime - enterBlockedTime;
    unsigned long diffBack = enterBlockedTime - backBlockedTime;

    if (enterBlockedTime < backBlockedTime && diff < DIRECTION_TIMEOUT) {
      if (emptySlots > 0) {
        Serial.println("ENTRY");
        gateOpen();
      } else {
        Serial.println("FULL");
      }
      enterBlockedTime = 0;
      backBlockedTime = 0;
    }
    else if (backBlockedTime < enterBlockedTime && diffBack < DIRECTION_TIMEOUT) {
      Serial.println("EXIT");
      gateOpen();
      enterBlockedTime = 0;
      backBlockedTime = 0;
    }
  }

  if (enterBlockedTime > 0 && (now - enterBlockedTime) > DIRECTION_TIMEOUT) {
    enterBlockedTime = 0;
  }
  if (backBlockedTime > 0 && (now - backBlockedTime) > DIRECTION_TIMEOUT) {
    backBlockedTime = 0;
  }

  lastEnter = currentEnter;
  lastBack = currentBack;

  // ===== UPDATE OUTPUTS =====
  updateGate();
  updateLcd();
  sendSlots();
}
