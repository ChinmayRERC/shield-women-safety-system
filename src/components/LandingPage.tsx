import React from 'react';
import {
  Shield,
  Activity,
  MapPin,
  Cpu,
  Radio,
  ArrowRight,
  Zap,
  PhoneCall,
  HeartPulse,
  Navigation,
  Layers,
  ChevronRight,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const LandingPage: React.FC = () => {
  const {
    setActiveTab,
    triggerSOS,
    triggerFakeCall,
    simulateFallEvent,
    simulateStruggleEvent,
    setGuideOpen,
    riskAnalysis,
    iotData,
    userLocation,
    incidents,
    responders,
  } = useSafety();

  const activeIncidentCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const readyResponderCount = responders.filter((r) => r.status === 'AVAILABLE').length;

  return (
    <div className="space-y-10 pb-16">
      {/* Simple welcome header */}
      <section className="relative pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.08] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-white font-bold">SHIELD safety demo</span>
            <span className="text-slate-600">·</span>
            <span className="text-teal-300">Ready to try</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Location: <strong className="text-teal-300">on</strong></span>
            <span>Helpers ready: <strong className="text-white">{readyResponderCount}</strong></span>
            <button
              onClick={() => setGuideOpen(true)}
              className="rounded-lg border border-teal-500/40 bg-teal-500/10 px-2.5 py-1 font-semibold text-teal-200 hover:bg-teal-500/20"
            >
              New here? Start here →
            </button>
          </div>
        </div>

        {/* Plain-language hero */}
        <div className="pt-8 pb-4 space-y-5">
          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Stay safe with one <span className="text-teal-400">tap</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              SHIELD is a practice safety app. Press <strong className="text-white">SOS</strong> to send an
              alert with your location, use <strong className="text-white">Safe Walk</strong> while you
              travel, or connect your own <strong className="text-white">ESP8266</strong> wearable. Everything
              runs on this device — no real emergency services are contacted.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setGuideOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-accent hover:bg-teal-400 text-obsidian-950 font-bold text-sm transition-all shadow-glow-teal hover:-translate-y-px"
            >
              Start here — 2 minute guide
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-tactile"
            >
              Try the SOS button
            </button>
            <button
              onClick={() => setActiveTab('iot')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-200 font-semibold text-sm border border-white/10 hover:border-teal-500/40 transition-all"
            >
              Connect hardware
            </button>
          </div>
        </div>
      </section>

      {/* Simple status overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Monitor 1: GPS & Location Lock */}
          <div
            onClick={() => setActiveTab('map')}
            className="p-4 rounded-xl bg-obsidian-900/95 border border-white/[0.08] hover:border-teal-500/40 transition-all cursor-pointer group shadow-tactile"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-teal-400" />
                <span>Your location</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ON
              </span>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold font-mono text-white tracking-tight">
                {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Accuracy: about 4 metres
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>See it on the map</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Monitor 2: Bio-Inertial IoT Sensor */}
          <div
            onClick={() => setActiveTab('iot')}
            className="p-4 rounded-xl bg-obsidian-900/95 border border-white/[0.08] hover:border-teal-500/40 transition-all cursor-pointer group shadow-tactile"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                <span>Sensor device</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                iotData.connected
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-slate-500 bg-white/[0.02] border-white/[0.08]'
              }`}>
                {iotData.connected ? 'CONNECTED' : 'NOT CONNECTED'}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-white tracking-tight">
                  {iotData.connected ? `${iotData.heartRate} BPM` : '-- BPM'}
                </span>
                <span className="text-xs text-slate-400">
                  movement {iotData.accelerometer.magnitude} G
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {iotData.fallDetected ? (
                  <strong className="text-rose-400">Fall detected!</strong>
                ) : (
                  'Heartbeat looks normal'
                )}
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>Open the sensors screen</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Monitor 3: AI Threat Engine */}
          <div
            onClick={() => setActiveTab('ai-lab')}
            className="p-4 rounded-xl bg-obsidian-900/95 border border-white/[0.08] hover:border-teal-500/40 transition-all cursor-pointer group shadow-tactile"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                <span>Danger score</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                riskAnalysis.score >= 75
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  : riskAnalysis.score >= 50
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {riskAnalysis.level}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-white tracking-tight">
                  {riskAnalysis.score} / 100
                </span>
                <span className="text-xs text-slate-400">out of 100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                Based on {riskAnalysis.breakdown.length} everyday factors
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>See how it’s worked out</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Monitor 4: CAD Queue & Responders */}
          <div
            onClick={() => setActiveTab('admin')}
            className="p-4 rounded-xl bg-obsidian-900/95 border border-white/[0.08] hover:border-teal-500/40 transition-all cursor-pointer group shadow-tactile"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>Help desk</span>
              </span>
              <span className="text-[10px] text-slate-300 font-bold px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.1]">
                SIMULATED
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-white tracking-tight">
                  {activeIncidentCount} open
                </span>
                <span className="text-xs text-slate-400">· {readyResponderCount} helpers free</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Typical arrival: about 3 minutes
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>Open the help desk</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Try a safety test */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-teal-500/30 shadow-tactile-lg space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <h2 className="text-base font-bold text-white">
                  Try a safety test
                </h2>
              </div>
              <p className="text-sm text-slate-400">
                Tap any button below to practise what happens in an emergency. Watch the alert travel to the Help desk screen.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-1 rounded bg-obsidian-950 border border-white/[0.08] text-teal-300">
                Danger score: {riskAnalysis.score}/100
              </span>
              <span className="px-2 py-1 rounded bg-obsidian-950 border border-white/[0.08] text-slate-300">
                Heart: {iotData.connected ? `${iotData.heartRate} bpm` : 'not connected'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => {
                triggerSOS('SOS_BUTTON');
                setActiveTab('user');
              }}
              className="p-3.5 rounded-xl bg-obsidian-950 hover:bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/70 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-rose-300">Press SOS</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:animate-ping" />
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Starts a 5-second timer. Cancel if it was an accident — otherwise help is sent.
              </p>
            </button>

            <button
              onClick={() => {
                simulateFallEvent();
                setActiveTab('iot');
              }}
              className="p-3.5 rounded-xl bg-obsidian-950 hover:bg-teal-950/40 border border-teal-500/30 hover:border-teal-500/70 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-teal-300">Simulate a fall</span>
                <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Pretend the wearable detects a hard fall and the person can’t move afterwards.
              </p>
            </button>

            <button
              onClick={() => {
                simulateStruggleEvent();
                setActiveTab('iot');
              }}
              className="p-3.5 rounded-xl bg-obsidian-950 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-500/70 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-300">Simulate a struggle</span>
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Pretend the wearable feels violent shaking and a racing heartbeat.
              </p>
            </button>

            <button
              onClick={() => {
                triggerFakeCall('Mom (Urgent)');
                setActiveTab('user');
              }}
              className="p-3.5 rounded-xl bg-obsidian-950 hover:bg-purple-950/40 border border-purple-500/30 hover:border-purple-500/70 text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-300">Fake call from Mom</span>
                <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Shows a pretend incoming call with words to help you leave a situation safely.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* How it is built — optional detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h2 className="text-base font-bold text-white">
              How SHIELD is built <span className="font-normal text-slate-500">(optional detail)</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Four simple parts work together — sensing, deciding, sending help, and protecting you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Subsystem 1 */}
          <div className="p-5 rounded-xl bg-obsidian-900 border border-white/[0.08] space-y-3 shadow-tactile">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                LAYER 01
              </span>
              <span className="text-slate-500">INGESTION</span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Bio-Inertial Telemetry Bus</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Continuous 250Hz PPG photoplethysmography and 3-axis IMU accelerometer stream.
              Detects impact deceleration thresholds (&gt;3.8G), tachycardia (&gt;130 BPM), and violent struggle vectors.
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>PROTOCOL: BLE 5.2 GATT</span>
              <span className="text-teal-400">&lt;250ms LATENCY</span>
            </div>
          </div>

          {/* Subsystem 2 */}
          <div className="p-5 rounded-xl bg-obsidian-900 border border-white/[0.08] space-y-3 shadow-tactile">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                LAYER 02
              </span>
              <span className="text-slate-500">INFERENCE</span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Explainable Threat Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Additive multi-factor heuristic model synthesizing circadian hour, ambient illumination, pedestrian density,
              and historical hazard polygons. Yields transparent factor-level attributions.
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>MODEL: ADDITIVE XAI</span>
              <span className="text-teal-400">100% LOCAL / OFFLINE</span>
            </div>
          </div>

          {/* Subsystem 3 */}
          <div className="p-5 rounded-xl bg-obsidian-900 border border-white/[0.08] space-y-3 shadow-tactile">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                LAYER 03
              </span>
              <span className="text-slate-500">DISPATCH</span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Municipal CAD Console</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Computer-Aided Dispatch terminal for police controllers and Pink Patrol units.
              State machine tracking tickets from PENDING &rarr; DISPATCHED &rarr; ON_SCENE &rarr; RESOLVED with Haversine distance sorting.
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>INTERFACE: 112 CAD SPEC</span>
              <span className="text-teal-400">MULTI-UNIT FLEET</span>
            </div>
          </div>

          {/* Subsystem 4 */}
          <div className="p-5 rounded-xl bg-obsidian-900 border border-white/[0.08] space-y-3 shadow-tactile">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                LAYER 04
              </span>
              <span className="text-slate-500">TACTICAL</span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Covert Survival Tooling</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Multi-vector deterrence: 10Hz optical disorientation strobe, Web Audio synthesis (emergency wail siren & police whistle),
              audio blackbox evidence recorder, and covert calculator PIN vault.
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>ENCRYPTION: LOCAL SHA-256</span>
              <span className="text-teal-400">BROWSER HARDENED</span>
            </div>
          </div>
        </div>
      </section>

      {/* What happens after you press SOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/[0.08] space-y-6 shadow-tactile">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                What happens after you press SOS
              </h3>
              <p className="text-sm text-slate-400">
                Four steps, from the first press to someone reaching you.
              </p>
            </div>
            <span className="text-[10px] text-teal-300 px-2 py-1 rounded bg-teal-500/10 border border-teal-500/20">
              SIMULATION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300">STEP 1</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              </div>
              <h4 className="text-sm font-bold text-white">An alert starts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You press SOS, your wearable detects a fall, or you say your safe word.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">STEP 2</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">5 seconds to cancel</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A beep counts down. If you pressed by mistake, enter PIN 4321 to stop it.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">STEP 3</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Help is alerted</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your location appears on the Help desk screen and a practice text goes to your contacts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">STEP 4</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white">You are safe</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The nearest helper is marked as arrived, and the alert is saved in History.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
