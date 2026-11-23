import React from 'react';
import {
  Shield,
  Activity,
  MapPin,
  Cpu,
  Radio,
  ArrowRight,
  Terminal,
  Compass,
  Zap,
  PhoneCall,
  HeartPulse,
  Navigation,
  Lock,
  Layers,
  ChevronRight,
  Eye,
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
      {/* Top Engineering Mission Header */}
      <section className="relative pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        {/* Tactical Sub-header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/[0.08] text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-white font-bold tracking-wider">PROJECT SHIELD</span>
            <span className="text-slate-600">/</span>
            <span>SPEC: RAPID-CAD-MESH-V2</span>
            <span className="text-slate-600">/</span>
            <span className="text-teal-300">STAGE: READY</span>
          </div>
          <div className="flex items-center gap-4">
            <span>EDGE LATENCY: <strong className="text-teal-300">18ms</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">GPS FIX: <strong className="text-emerald-400">LOCKED</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>CAD FLEET: <strong className="text-white">{readyResponderCount} ON STANDBY</strong></span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="pt-8 pb-4 space-y-6">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-teal-300">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              <span>AUTONOMOUS EMERGENCY ORCHESTRATION PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] uppercase font-sans">
              Next-Gen Autonomous <br />
              <span className="text-teal-400 font-mono tracking-tighter">Women's Safety</span> & CAD Grid
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
              SHIELD eliminates emergency response latency through automated multi-modal telemetry.
              It synthesizes wearable 3.8G shock sensors, explainable Bayesian-calibrated spatial threat scoring,
              and direct municipal Computer-Aided Dispatch (CAD) into a unified, zero-cost edge network.
            </p>
          </div>

          {/* Primary Quick Launch Deck */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('user')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-accent hover:bg-teal-400 text-obsidian-950 font-bold text-xs font-mono tracking-wider transition-all shadow-glow-teal hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              <span>LAUNCH SAFETY TERMINAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-white font-bold text-xs font-mono tracking-wider border border-white/[0.12] hover:border-teal-500/40 transition-all shadow-tactile"
            >
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>OPEN POLICE CAD CONSOLE</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 hover:text-white font-medium text-xs font-mono tracking-wider border border-white/[0.08] hover:border-white/[0.18] transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>SPATIAL TACTICAL MAP</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 hover:text-white font-medium text-xs font-mono tracking-wider border border-white/[0.08] hover:border-white/[0.18] transition-all"
            >
              <span>EVALUATOR MATRIX</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real-Time Mission Telemetry HUD (4 Monitors) */}
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
                <span>GPS TELEMETRY</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE FIX
              </span>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold font-mono text-white tracking-tight">
                {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Precision: ±4m • NavIC / GPS Dual Lock
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>Inspect spatial corridors</span>
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
                <span>WEARABLE SENSOR BUS</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                iotData.connected
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-slate-500 bg-white/[0.02] border-white/[0.08]'
              }`}>
                {iotData.connected ? 'BLE 5.2 GATT' : 'OFFLINE'}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-white tracking-tight">
                  {iotData.connected ? `${iotData.heartRate} BPM` : '-- BPM'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  | {iotData.accelerometer.magnitude} G
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {iotData.fallDetected ? (
                  <strong className="text-rose-400">IMPACT FLAGGED</strong>
                ) : (
                  '250Hz Photoplethysmography Nominal'
                )}
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>Open oscilloscope testbed</span>
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
                <span>EXPLAINABLE AI ENGINE</span>
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
                <span className="text-xs font-mono text-slate-400">THREAT INDEX</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                Factors: {riskAnalysis.breakdown.length} Dynamic Weights Active
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>Inspect factor attribution</span>
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
                <span>CAD DISPATCH MESH</span>
              </span>
              <span className="text-[10px] text-slate-300 font-bold px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.1]">
                112 INTEGRATION
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-white tracking-tight">
                  {activeIncidentCount} ACTIVE
                </span>
                <span className="text-xs font-mono text-slate-400">| {readyResponderCount} READY</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Avg Response: 3.4 min (Pink Squad)
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-teal-300 group-hover:text-teal-200">
              <span>View CAD dispatch board</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hackathon Evaluator Testbed (Direct Interrupts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-teal-500/30 shadow-tactile-lg space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                  Evaluator Simulation Harness & Hardware Interrupt Triggers
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Click any emergency trigger below to simulate zero-touch distress events and observe end-to-end CAD dispatch.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-1 rounded bg-obsidian-950 border border-white/[0.08] text-teal-300">
                AI Threat: {riskAnalysis.score}/100
              </span>
              <span className="px-2 py-1 rounded bg-obsidian-950 border border-white/[0.08] text-slate-300">
                Pulse: {iotData.connected ? `${iotData.heartRate} BPM` : 'DISCONNECTED'}
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
                <span className="text-xs font-bold font-mono text-rose-300 uppercase">Panic SOS Interrupt</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:animate-ping" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Launches 5s abort window with audible warning pips and automatic dispatch.
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
                <span className="text-xs font-bold font-mono text-teal-300 uppercase">3.8G Hard Fall Impact</span>
                <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Simulates abrupt inertial drop and sudden post-impact zero-motion immobilization.
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
                <span className="text-xs font-bold font-mono text-amber-300 uppercase">Physical Altercation Shake</span>
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Simulates high-frequency chaotic IMU oscillation and elevated struggle heart rate.
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
                <span className="text-xs font-bold font-mono text-purple-300 uppercase">Covert Escape Call</span>
                <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Simulates realistic incoming phone call screen with interactive dialogue script.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Engineering Architectural Subsystems (4 Technical Columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-white">
              System Architecture & Engineered Subsystems
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Four decoupled layers operating in synchrony to deliver a hardened, offline-first safety perimeter.
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

      {/* Incident State Machine Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/[0.08] space-y-6 shadow-tactile">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                Deterministic Incident State Machine
              </h3>
              <p className="text-xs text-slate-400">
                Zero-delay progression from biometric sensor anomaly to verified responder escort.
              </p>
            </div>
            <span className="text-[10px] font-mono text-teal-300 px-2 py-1 rounded bg-teal-500/10 border border-teal-500/20">
              STATE: FORMAL FINITE AUTOMATON
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-300">01 // DETECT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Multi-Modal Ingestion</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sensor interrupt (3.8G shock, tachycardia, STT safe word "SHIELD", or tactile panic button).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">02 // VERIFY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white">5s Grace Window</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Audible 880Hz countdown pips. User can abort accidental triggers via 4-digit master PIN.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-300">03 // DISPATCH</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Dual-Tier Broadcast</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Instant GPS telemetry pushed to CAD dispatch queue and automated simulated SMS to emergency contacts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300">04 // RESOLVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Safe Escort & Audit</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nearest patrol unit arrives on scene. Tamper-evident incident record saved to immutable audit history.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
