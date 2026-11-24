/**
 * Front-end side of the SHIELD hardware bridge.
 * Talks to server/bridge.mjs (npm run bridge) so an ESP8266 can:
 *   - send battery / heart rate / switch / fall data into the app
 *   - receive buzzer + LED commands from the app during an alert
 */

export interface HardwareTelemetry {
  battery: number | null;
  heartRate: number | null;
  switchPressed: boolean;
  fallDetected: boolean;
  shakeDetected: boolean;
  timestamp: number;
}

export type HardwareLed = 'off' | 'red' | 'green' | 'blue' | 'flashing';

export interface HardwareCommand {
  buzzer: boolean;
  led: HardwareLed;
}

export interface HardwareState {
  enabled: boolean;
  url: string;
  connected: boolean;
  lastSeen: number | null;
  telemetry: HardwareTelemetry | null;
  error: string | null;
  switchPresses: number;
}

const STORAGE_KEY = 'shield.hardware.bridge.url';
const DEFAULT_URL = 'http://localhost:3003';
const POLL_MS = 700;
const FRESH_MS = 8000;

function loadUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_URL;
  } catch {
    return DEFAULT_URL;
  }
}

let state: HardwareState = {
  enabled: false,
  url: loadUrl(),
  connected: false,
  lastSeen: null,
  telemetry: null,
  error: null,
  switchPresses: 0,
};

const listeners = new Set<() => void>();
let timer: number | null = null;
let inFlight = false;
let previousSwitch = false;
let previousFall = false;
let switchHandler: (() => void) | null = null;
let fallHandler: (() => void) | null = null;

function setState(patch: Partial<HardwareState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): HardwareState {
  return state;
}

export function setSwitchHandler(handler: (() => void) | null) {
  switchHandler = handler;
}

export function setFallHandler(handler: (() => void) | null) {
  fallHandler = handler;
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

export function setBridgeUrl(url: string) {
  const clean = normalizeUrl(url) || DEFAULT_URL;
  try {
    localStorage.setItem(STORAGE_KEY, clean);
  } catch {
    /* storage may be disabled — the setting still works for this session */
  }
  setState({ url: clean, error: null });
}

export function setBridgeEnabled(enabled: boolean) {
  if (!enabled) {
    stopPolling();
    previousSwitch = false;
    previousFall = false;
    setState({ enabled: false, connected: false, error: null, telemetry: null, lastSeen: null });
    return;
  }
  setState({ enabled: true, error: null });
  startPolling();
}

async function pollOnce() {
  if (!state.enabled || inFlight) return;
  inFlight = true;

  try {
    const response = await fetch(`${normalizeUrl(state.url)}/telemetry`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as HardwareTelemetry;
    const fresh = typeof data.timestamp === 'number' && Date.now() - data.timestamp < FRESH_MS;
    const pressed = Boolean(data.switchPressed);
    const falling = Boolean(data.fallDetected);

    const newPress = fresh && pressed && !previousSwitch;
    const newFall = fresh && falling && !previousFall;

    previousSwitch = pressed;
    previousFall = falling;

    setState({
      connected: fresh,
      lastSeen: fresh ? data.timestamp : state.lastSeen,
      telemetry: data,
      switchPresses: state.switchPresses + (newPress ? 1 : 0),
      error: fresh ? null : 'Connected to the bridge, waiting for your ESP8266 to send data.',
    });

    if (newPress) switchHandler?.();
    if (newFall) fallHandler?.();
  } catch {
    setState({
      connected: false,
      error: `Can’t reach the bridge at ${state.url}. Run "npm run bridge" and check the URL.`,
    });
  } finally {
    inFlight = false;
  }
}

export function startPolling() {
  if (timer !== null) return;
  void pollOnce();
  timer = window.setInterval(() => void pollOnce(), POLL_MS);
}

export function stopPolling() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

export async function sendCommand(command: HardwareCommand): Promise<void> {
  if (!state.enabled) return;
  try {
    await fetch(`${normalizeUrl(state.url)}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(2500),
    });
  } catch {
    /* the next command will retry — the UI shows the bridge status separately */
  }
}
