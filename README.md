# 🛡️ SHIELD – AI-Powered Women's Safety & Emergency Response Platform

> **State-Level Innovation Hackathon 2026**  
> *A Zero-Latency, Explainable AI & IoT Safety Ecosystem for Women*

---

## 🌟 Executive Summary
**SHIELD** bridges the critical latency gap in women's emergency response by transforming reactive distress calls into proactive, multi-tier protection. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Leaflet OpenStreetMap**, SHIELD runs **100% locally** without external paid APIs, cloud billing, or subscription keys.

---

## 🚀 Key Modules & Capabilities

### 1. 🚨 Citizen Safety App & Instant Panic Engine
- **Tactile SOS Panic Button**: Glowing concentric radar pulses with a **5-second cancel countdown grace window** to prevent false alarms.
- **PIN Verification**: Cancel false triggers using PIN `4321`.
- **Silent SOS Mode & Covert Disguise**: Instantly converts the phone screen into a functional **working Calculator disguise** while covertly streaming GPS telemetry in the background.
- **Acoustic Deterrent Siren**: Built-in Web Audio API synthesizer generates a high-decibel emergency siren to draw bystander attention without relying on external MP3 audio files.
- **Safe Walk Companion**: Timed route guardian with automated periodic check-ins. If the timer elapses without safe confirmation, distress escalation automatically activates.
- **Discreet Fake Escape Call**: Rings an authentic-looking incoming call from "Mom" with scripted escape dialogue ("I can see my brother waiting outside!") and an embedded silent SOS button.

### 2. 🧠 Explainable AI (XAI) Threat Engine
- **Dynamic Bayesian Inference**: Computes real-time threat scores (0–100%) and levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **Explainable Attribution Waterfall (SHAP-style)**:
  - **Circadian Vulnerability Window**: Late-night risk factor weighting (+22 pts).
  - **Ambient Illumination**: Street lumens deficit from LED lit to pitch dark (+24 pts).
  - **Pedestrian Density**: Deserted vs. high-crowd footfall (+20 pts).
  - **Trajectory Deviation**: Corridors vs. uncharted alleys (+18 pts).
  - **Battery Depletion Hazard**: Critical power threshold <15% (+16 pts).
  - **Biometric Tachycardia Spike**: Sudden pulse surges >135 BPM (+26 pts).
- **Interactive AI Sandbox**: Live interactive sliders for hackathon evaluators to test scenario presets.

### 3. ⌚ IoT Smart Wearable & Sensor Simulator
- **Live Photoplethysmography (ECG)**: Real-time HTML5 Canvas rendering of cardiac P-Q-R-S-T waveforms reflecting actual simulated heart rate BPM.
- **3-Axis Accelerometer Telemetry**: Displays real-time lateral (X), sagittal (Y), and vertical (Z) G-force vectors.
- **Simulated Hardware Interrupts**:
  - **3.8G Hard Ground Fall**: Deceleration impact detection with auto-distress escalation.
  - **Violent Struggle / Shake**: High-frequency oscillatory motion recognition.
  - **Tachycardia Spike (>140 BPM)**: Simulated acute terror response.
  - **Wearable Double-Click Panic**: Hardware push-button simulation on Smart Ring crown.

### 4. 🗺️ Spatial Incident Map (Leaflet + OpenStreetMap)
- **Live User Geolocation Beacon**: High-accuracy GPS with animated pulse rings.
- **Safe Shelters & Pink Booths**: Markers for 24/7 Pink Booths, Women Police Stations, and Hospitals with direct distance calculators.
- **Hazard Corridor Geofences**: Translucent danger zone circles highlighting unlit lanes and transit dead-zones.
- **Active Incident Pins**: Color-coded by threat level with interactive triage popups.

### 5. 🚔 Municipal CAD (Computer-Aided Dispatch) Console
- **Real-Time Triage Queue**: Sort and filter incidents by status (`PENDING`, `DISPATCHED`, `ON_SCENE`, `RESOLVED`).
- **Patrol Unit Fleet**: Real-time status for **Pink Patrol PCR Units**, **Cheetah Bike Units**, and **Medical Ambulances** with live ETA calculations.
- **Simulated Event Bus Terminal**: Live terminal stream logging simulated SMS broadcasts and CAD dispatch packets.
- **Audit Export**: One-click download of incident reports in **JSON** or **CSV** format.

---

## 🛠️ Tech Stack
- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Navy Blue `#060B19`, `#0B132B`, White, Teal `#00F0FF`, and Emergency Red `#EF4444`)
- **Icons**: Lucide React
- **Geospatial Mapping**: Leaflet 1.9 + React-Leaflet + OpenStreetMap
- **State & Persistence**: React Context API + LocalStorage
- **Audio Synthesizer**: Web Audio API (100% offline, zero external audio assets)

---

## 💻 Running the Application

### 1. Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Preview
```bash
npm run build
npm run preview
```

### 3. New to the app?
Click the **?** (Help) button in the top bar, or "New here? Start here" on the Home screen, for a plain-English two-minute tour. Every screen also has simple labels with hover hints.

### 4. Connecting real hardware (ESP8266 + buzzer + LED + switch + battery)
1. Wire the parts following the chart in the app: **Sensors → Connect your ESP8266**.
2. Start the local bridge: `npm run bridge` (keeps port 3003 open).
3. Open **Sensors → Connect your ESP8266**, enter the bridge address and press **Start listening for my device**.
4. Flash the ESP8266 with the sketch in [`public/HARDWARE_GUIDE.md`](public/HARDWARE_GUIDE.md), using your Wi-Fi details and the bridge computer's IP.

The bridge accepts `POST /telemetry` from the device (battery, switch, fall/shake) and exposes `GET /command` so the app can switch the buzzer and LED on during an SOS. Full wiring, sketch, and troubleshooting steps are in the guide.

---

## ⚖️ Hackathon Demonstration & Ethics Disclaimer
> **SIMULATION ONLY**: All emergency services dispatch, IoT hardware sensor streams, and SMS alerts in this prototype are local demonstrations designed for hackathon evaluation. The platform strictly operates on simulated telemetry and never connects to real-world 112, 911, or municipal police emergency lines.
