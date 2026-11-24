import React, { useEffect, useState, useSyncExternalStore } from 'react';
import {
  Usb,
  Wifi,
  WifiOff,
  Battery,
  HeartPulse,
  MousePointerClick,
  Clock3,
  ChevronDown,
  ExternalLink,
  Play,
  Square,
  Zap,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import {
  getSnapshot,
  setBridgeEnabled,
  setBridgeUrl,
  subscribe,
} from '../services/hardwareBridge';

const wiring = [
  {
    part: 'Push switch (panic button)',
    pin: 'D5 · GPIO14',
    detail: 'One leg to D5, the other to GND. The code uses the internal pull-up, so no extra resistor is needed. D5 is safe at boot.',
  },
  {
    part: 'Red LED (plus optional green)',
    pin: 'D2 · GPIO4 · D6',
    detail: 'D2 drives the red LED, optional D6 a green one. Put a 220 Ω resistor in series with each LED, then to GND. Long leg (anode) faces the pin.',
  },
  {
    part: 'Buzzer',
    pin: 'D1 · GPIO5',
    detail: 'Drive through an NPN transistor (e.g. BC547/2N2222) with a 1 kΩ base resistor. Add a diode across an inductive buzzer.',
  },
  {
    part: 'Battery voltage (Li-ion)',
    pin: 'A0',
    detail: '100 kΩ from battery + to A0 and 27 kΩ from A0 to GND. A0 accepts at most 1 V — never connect a battery directly.',
  },
  {
    part: 'Power',
    pin: '5V + GND',
    detail: 'Use a regulated 5 V supply. All grounds must be connected together (common ground).',
  },
];

export const HardwareConnectionCard: React.FC = () => {
  const { triggerSOS } = useSafety();
  const hardware = useSyncExternalStore(subscribe, getSnapshot);
  const [urlInput, setUrlInput] = useState(hardware.url);

  useEffect(() => setUrlInput(hardware.url), [hardware.url]);

  const applyUrl = () => {
    setBridgeUrl(urlInput);
    if (hardware.enabled) {
      setBridgeEnabled(false);
      setBridgeEnabled(true);
    }
  };

  const lastSeen = hardware.lastSeen
    ? new Date(hardware.lastSeen).toLocaleTimeString()
    : '—';

  return (
    <section className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/[0.07] to-obsidian-900 p-5 shadow-tactile space-y-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-teal-500/30 bg-teal-400/10 p-2.5 text-teal-300">
            <Usb className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Connect your ESP8266</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
              Wire a switch, LED, buzzer and battery to an ESP8266. The app can then read your battery
              level and react to a switch press — and turn on the buzzer/LED when an SOS is active.
            </p>
          </div>
        </div>
        <a
          href="/HARDWARE_GUIDE.md"
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-teal-200 transition hover:border-teal-500/40 hover:bg-teal-500/10"
        >
          Full guide + code <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: setup */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-obsidian-950/70 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <span className="rounded-md bg-teal-400 px-1.5 py-0.5 text-xs text-obsidian-950">1</span>
              Start the bridge on this computer
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              In the project folder, open a terminal and run:
            </p>
            <code className="mt-2 block rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-teal-300">
              npm run bridge
            </code>
            <p className="mt-2 text-xs text-slate-500">
              Keep that terminal open. It listens on port 3003 and allows your ESP8266 to send data.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-obsidian-950/70 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <span className="rounded-md bg-teal-400 px-1.5 py-0.5 text-xs text-obsidian-950">2</span>
              Put the ESP8266 and this computer on the same Wi-Fi
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              Find this computer’s Wi-Fi address (on Mac: <code className="text-teal-300">ipconfig getifaddr en0</code>)
              and use it in your ESP8266 code, for example{' '}
              <code className="text-teal-300">http://192.168.1.25:3003/telemetry</code>.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-obsidian-950/70 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
              <span className="rounded-md bg-teal-400 px-1.5 py-0.5 text-xs text-obsidian-950">3</span>
              Turn on listening here
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
                aria-label="Bridge address"
                placeholder="http://localhost:3003"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white outline-none focus:border-teal-400"
              />
              <button
                onClick={applyUrl}
                className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-teal-500/40 hover:text-white"
              >
                Save address
              </button>
            </div>
            <button
              onClick={() => setBridgeEnabled(!hardware.enabled)}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                hardware.enabled
                  ? 'bg-rose-600/20 text-rose-200 hover:bg-rose-600/30'
                  : 'bg-teal-400 text-obsidian-950 hover:bg-teal-300'
              }`}
            >
              {hardware.enabled ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {hardware.enabled ? 'Stop listening' : 'Start listening for my device'}
            </button>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-semibold ${
                  hardware.connected
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                {hardware.connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                {hardware.connected ? 'ESP8266 sending data' : hardware.enabled ? 'Waiting for ESP8266' : 'Listening off'}
              </span>
              {hardware.telemetry?.battery !== null && hardware.telemetry?.battery !== undefined && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-200">
                  <Battery className="h-3.5 w-3.5 text-emerald-400" /> {hardware.telemetry.battery}%
                </span>
              )}
              {hardware.telemetry?.heartRate !== null && hardware.telemetry?.heartRate !== undefined && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-200">
                  <HeartPulse className="h-3.5 w-3.5 text-rose-400" /> {hardware.telemetry.heartRate} bpm
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-300">
                <MousePointerClick className="h-3.5 w-3.5 text-teal-400" /> {hardware.switchPresses} presses
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-400">
                <Clock3 className="h-3.5 w-3.5" /> {lastSeen}
              </span>
            </div>
            {hardware.error && (
              <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                {hardware.error}
              </p>
            )}
            <button
              onClick={() => triggerSOS('SOS_BUTTON')}
              className="mt-3 text-xs font-semibold text-slate-400 underline decoration-dotted underline-offset-4 hover:text-white"
            >
              No hardware yet? Test the same SOS action here
            </button>
          </div>
        </div>

        {/* Right: wiring + feedback */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-obsidian-950/70">
            <div className="border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-bold text-white">Wiring chart</h3>
              <p className="mt-0.5 text-xs text-slate-400">Match these pins in your ESP8266 sketch.</p>
            </div>
            <div className="divide-y divide-white/5">
              {wiring.map((w) => (
                <div key={w.pin} className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-sm font-semibold text-white">{w.part}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{w.detail}</p>
                  </div>
                  <span className="h-fit rounded-md bg-teal-500/10 px-2 py-1 text-center font-mono text-[11px] font-bold text-teal-300">
                    {w.pin}
                  </span>
                </div>
              ))}
            </div>
            <p className="border-t border-white/10 px-4 py-2.5 text-[11px] text-amber-300/90">
              ⚠ A0 max is 1 V. Always use the divider — a bare Li-ion cell will damage the ESP8266.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-obsidian-950/70 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Zap className="h-4 w-4 text-teal-400" /> What your device does automatically
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-300">
              <li>• <strong className="text-white">Normal:</strong> LED green, buzzer quiet.</li>
              <li>• <strong className="text-white">SOS active:</strong> LED flashes, buzzer sounds.</li>
              <li>• <strong className="text-white">Siren/strobe on:</strong> LED red, buzzer sounds.</li>
              <li>• <strong className="text-white">Switch pressed:</strong> starts the same 5-second SOS as the app button.</li>
            </ul>
          </div>

          <details className="group rounded-xl border border-white/10 bg-obsidian-950/70 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-white">
              Short setup checklist
              <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
            </summary>
            <ol className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-300">
              <li>1. Install the ESP8266 board package in Arduino IDE.</li>
              <li>2. Wire the parts using the chart above.</li>
              <li>3. Copy the sketch from the full guide; set your Wi-Fi name/password and computer IP.</li>
              <li>4. Run <code className="text-teal-300">npm run bridge</code>, then press Start listening here.</li>
              <li>5. Upload the sketch and press the switch — the app should react within a second.</li>
            </ol>
          </details>
        </div>
      </div>
    </section>
  );
};
