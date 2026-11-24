# Connecting an ESP8266 to SHIELD

This guide gets a real **ESP8266 + switch + LED + buzzer + battery** talking to the SHIELD web app.

Everything stays on your own Wi-Fi. No cloud account, no paid API, no real emergency line.

---

## 1. How the pieces talk

```
   SWITCH ─┐
    LED  ──┼──> ESP8266 ── Wi-Fi ──> bridge (port 3003) <──poll── React app
  BUZZER ──┤        ^                                        |
  BATTERY ─┘        └──────── buzzer / LED commands ─────────┘
```

* The **bridge** is a tiny Node server in this project: `server/bridge.mjs`.
* Start it with `npm run bridge` in a terminal and leave it running.
* The ESP8266 and the computer running the bridge must be on the **same Wi-Fi**.

---

## 2. What you need

| Part | Notes |
|---|---|
| ESP8266 board | NodeMCU 1.0 / Wemos D1 mini recommended (has USB + 5V regulator) |
| Push-to-make switch | Any tactile button |
| Red LED | 5 mm |
| Green LED | Optional, for "connected / calm" |
| Buzzer | Active (self-driving) buzzer is easiest; piezo works too |
| Li-ion cell + holder | 3.7 V nominal / 4.2 V full, or any 5 V source |
| Resistors | 220 Ω (LED), 1 kΩ (transistor base), 100 kΩ + 27 kΩ (battery divider) |
| NPN transistor | BC547, 2N2222 or similar, for a louder buzzer |
| Diode | 1N4148 across an inductive buzzer (optional for active buzzers) |

---

## 3. Wiring

| Part | ESP8266 pin | Connection |
|---|---|---|
| Panic switch | **D5 (GPIO14)** | One leg to D5, other leg to GND. Uses `INPUT_PULLUP`, so pressed = LOW. D5 is safe during boot. |
| Red LED | **D2 (GPIO4)** | D2 → 220 Ω → LED anode (long leg) → LED cathode to GND. |
| Green LED (optional) | **D6 (GPIO12)** | D6 → 220 Ω → LED → GND. |
| Buzzer | **D1 (GPIO5)** | Small piezo (<20 mA): D1 → 220 Ω → buzzer → GND. Louder buzzer: D1 → 1 kΩ → NPN base; emitter to GND; collector to buzzer −; buzzer + to 5V; diode across buzzer (cathode to +). |
| Battery sense | **A0** | Battery + → 100 kΩ → A0 → 27 kΩ → GND. Grounds must be common. |
| Power | **5V and GND** | Regulated 5V into the board's 5V/VIN pin. |

> ### ⚠ Two things that can destroy the board
> 1. **A0 accepts a maximum of 1 V.** A bare Li-ion cell (4.2 V) will damage it. Always use the 100 kΩ / 27 kΩ divider. With that divider, 4.2 V becomes about 0.89 V at A0 — safe.
> 2. **Do not use D3 (GPIO0) for the switch.** Holding GPIO0 low while powering on puts the ESP8266 into flash mode and your sketch will not start. D5 avoids this.

Divider maths used in the sketch:

```
adcVoltage     = analogRead(A0) / 1023.0 * 1.0
batteryVoltage = adcVoltage * (100000 + 27000) / 27000
batteryPercent = (batteryVoltage - 3.3) / (4.2 - 3.3) * 100   // clamped 0–100
```

---

## 4. Arduino IDE setup

1. Install **Arduino IDE** (1.8.x or 2.x).
2. Add the ESP8266 boards package:
   * *File → Preferences → Additional boards manager URLs*, paste:
     `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   * *Tools → Board → Boards Manager* → search **esp8266** → Install.
3. Select **Board: NodeMCU 1.0 (ESP-12E Module)** (or your board) and the correct **Port**.
4. Paste the sketch below. Change `YOUR_WIFI`, `YOUR_PASSWORD`, and the bridge IP.
5. Upload.

Find the bridge computer's IP:

```bash
# macOS
ipconfig getifaddr en0
# Linux
hostname -I
# Windows
ipconfig
```

Then use e.g. `http://192.168.1.25:3003` as `BRIDGE`.

---

## 5. The sketch

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// ----- EDIT THESE -----
const char* WIFI_SSID = "YOUR_WIFI";
const char* WIFI_PASS = "YOUR_PASSWORD";
const char* BRIDGE    = "http://192.168.1.25:3003"; // no trailing slash
// -----------------------

const uint8_t PIN_SWITCH = D5;   // GPIO14, pressed = LOW
const uint8_t PIN_LED_RED = D2;  // GPIO4
const uint8_t PIN_LED_GREEN = D6; // GPIO12 (optional)
const uint8_t PIN_BUZZER  = D1;  // GPIO5

unsigned long lastSend  = 0;
unsigned long lastCommand = 0;
unsigned long lastDebounce = 0;
bool lastSwitchState = HIGH;
bool buzzerOn = false;
String ledMode = "off";

int batteryPercent() {
  int raw = analogRead(A0);                 // 0..1023, max 1 V at A0
  float adcV = raw / 1023.0f;
  float vBat = adcV * (100000.0f + 27000.0f) / 27000.0f;
  float pct  = (vBat - 3.3f) / (4.2f - 3.3f) * 100.0f;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  return (int)pct;
}

void driveOutputs() {
  bool flashing = (ledMode == "flashing");
  bool red = (ledMode == "red");
  bool green = (ledMode == "green");

  // Single-red-LED setups: any alert simply lights the red LED.
  digitalWrite(PIN_LED_RED, (flashing || red || (buzzerOn && ledMode == "off")) ? HIGH : LOW);
  digitalWrite(PIN_LED_GREEN, green ? HIGH : LOW);

  // Flashing is handled in loop() so the rest of the code never blocks.
  if (flashing) {
    static unsigned long lastBlink = 0;
    if (millis() - lastBlink > 250) {
      lastBlink = millis();
      digitalWrite(PIN_LED_RED, !digitalRead(PIN_LED_RED));
    }
  }

  digitalWrite(PIN_BUZZER, buzzerOn ? HIGH : LOW);
}

void sendTelemetry(bool pressed) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient client;
  HTTPClient http;
  String url = String(BRIDGE) + "/telemetry";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(1200);

  String body = "{\"battery\":" + String(batteryPercent()) +
                ",\"switchPressed\":" + String(pressed ? "true" : "false") +
                ",\"fallDetected\":false,\"shakeDetected\":false}";

  http.POST(body);
  http.end();
}

void readCommand() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient client;
  HTTPClient http;
  http.begin(client, String(BRIDGE) + "/command");
  http.setTimeout(1200);

  if (http.GET() == 200) {
    String body = http.getString();
    buzzerOn = body.indexOf("\"buzzer\":true") >= 0;

    if (body.indexOf("\"led\":\"flashing\"") >= 0) ledMode = "flashing";
    else if (body.indexOf("\"led\":\"red\"") >= 0) ledMode = "red";
    else if (body.indexOf("\"led\":\"green\"") >= 0) ledMode = "green";
    else ledMode = "off";
  }
  http.end();
}

void setup() {
  pinMode(PIN_SWITCH, INPUT_PULLUP);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  digitalWrite(PIN_LED_RED, LOW);
  digitalWrite(PIN_LED_GREEN, LOW);
  digitalWrite(PIN_BUZZER, LOW);

  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected. IP: " + WiFi.localIP().toString());
}

void loop() {
  bool pressed = (digitalRead(PIN_SWITCH) == LOW);

  // Debounced press is reported immediately; state is also sent every second.
  if (pressed != lastSwitchState && millis() - lastDebounce > 200) {
    lastDebounce = millis();
    lastSwitchState = pressed;
    sendTelemetry(pressed);
    Serial.println(pressed ? "SWITCH PRESSED -> SOS" : "switch released");
  }

  if (millis() - lastSend > 1000) {
    lastSend = millis();
    sendTelemetry(pressed);
  }

  if (millis() - lastCommand > 500) {
    lastCommand = millis();
    readCommand();
  }

  driveOutputs();
  delay(20);
}
```

---

## 6. Turn it all on

1. In the project folder: `npm run bridge`. Keep the terminal open.
2. In another terminal: `npm run dev`, then open the app and go to **Sensors → Connect your ESP8266**.
3. Enter the bridge address (`http://localhost:3003` works when the browser is on the same computer) and press **Start listening for my device**.
4. Power the ESP8266. Within a second the card should show **ESP8266 sending data**, battery %, and a timestamp.
5. Press the physical switch. The app starts the same 5-second SOS window as the red button.
6. Trigger an SOS in the app. The bridge sends `{"buzzer":true,"led":"flashing"}` and your device reacts.

---

## 7. Bridge API (useful for debugging)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/telemetry` | Returns the latest device data |
| `POST` | `/telemetry` | ESP8266 sends `{battery, switchPressed, fallDetected, shakeDetected, heartRate?}` |
| `GET` | `/command` | ESP8266 reads `{buzzer, led}` |
| `POST` | `/command` | App sets the buzzer/LED state |

Test from a terminal:

```bash
curl http://localhost:3003/telemetry
curl -X POST http://localhost:3003/command \
  -H 'Content-Type: application/json' \
  -d '{"buzzer":true,"led":"flashing"}'
```

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| Bridge card says "Can’t reach the bridge" | Run `npm run bridge`; check the URL and that port 3003 is free. |
| Bridge reachable but "Waiting for ESP8266" | Wrong Wi-Fi/password, wrong bridge IP in the sketch, or ESP8266 not powered. Check Serial Monitor. |
| Battery shows 100% always | Check the divider wiring and that A0 never exceeds 1 V. A Li-ion at 4.2 V should read about 0.89 V at A0. |
| Sketch won’t upload | Hold the ESP8266 FLASH/BOOT button while uploading, or use D5 instead of D3 for the switch. |
| Switch does nothing | Pressed must be LOW (`INPUT_PULLUP`); one leg goes to D5, the other to GND. |
| Buzzer is weak | Use the transistor driver and power the buzzer from 5V with a common ground. |
| LED never flashes | The app only sends `flashing` while an SOS is active. Trigger an SOS first. |

---

## 9. Safety reminder

This is a **demonstration**. It does not call 112/911 or any real emergency service. Do not rely on it for personal safety.
