import React, { useEffect, useRef, useState } from 'react';
import {
  Radio,
  HeartPulse,
  Activity,
  Battery,
  Wifi,
  WifiOff,
  RotateCcw,
  Zap,
  ShieldAlert,
  Flame,
  Terminal,
  Pause,
  Play,
  Sliders,
  Maximize2,
  Cpu,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const WearableSimulator: React.FC = () => {
  const {
    iotData,
    toggleIotConnection,
    simulateFallEvent,
    simulateStruggleEvent,
    simulateHeartSpike,
    resetIoTEvents,
    triggerSOS,
    setActiveTab,
  } = useSafety();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [sweepMultiplier, setSweepMultiplier] = useState(1);
  const [gainMultiplier, setGainMultiplier] = useState(1);
  const [hexLogs, setHexLogs] = useState<string[]>([]);

  // Generate simulated raw hex telemetry packets
  useEffect(() => {
    if (!iotData.connected) return;

    const interval = setInterval(() => {
      const hrHex = iotData.heartRate.toString(16).toUpperCase().padStart(2, '0');
      const zHex = Math.floor(Math.abs(iotData.accelerometer.z) * 10).toString(16).toUpperCase().padStart(2, '0');
      const pktId = Math.floor(Math.random() * 9000 + 1000).toString(16).toUpperCase();
      const flag = iotData.fallDetected ? 'CRIT_IMPACT' : iotData.struggleDetected ? 'AGITATION' : 'NOMINAL';
      const logLine = `PKT#${pktId} | BLE_GATT_0xFFE1: [0x53, 0x48, 0x${hrHex}, 0x${zHex}] | ${flag} | CRC: 0x9F (OK)`;

      setHexLogs((prev) => [logLine, ...prev.slice(0, 5)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [iotData.connected, iotData.heartRate, iotData.accelerometer.z, iotData.fallDetected, iotData.struggleDetected]);

  // Live Oscilloscope ECG & IMU Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Draw dark CRT grid background
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, width, height);

    // Reticle Grid (oscilloscope division lines)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.09)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 30) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 25) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    const render = () => {
      if (isFrozen) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (!iotData.connected) {
        // Disconnected Flatline
        ctx.fillStyle = 'rgba(5, 8, 17, 0.1)';
        ctx.fillRect(x, 0, 4, height);

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, midY);
        ctx.lineTo(x + 2, midY);
        ctx.stroke();

        x = (x + 2) % width;
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const hr = iotData.heartRate;
      const baseSpeed = hr > 120 ? 3.5 : 2;
      const speed = baseSpeed * sweepMultiplier;
      const period = Math.max(30, Math.floor(width / (hr / 22)));
      const pos = x % period;

      let y = midY;
      const gain = gainMultiplier;

      // Realistic P-Q-R-S-T cardiac waveform calculation
      if (pos > period - 32 && pos < period - 26) {
        // P-wave (atrial depolarization)
        y = midY - 6 * gain;
      } else if (pos >= period - 26 && pos < period - 21) {
        // Q-dip
        y = midY + 4 * gain;
      } else if (pos >= period - 21 && pos < period - 14) {
        // R-spike (ventricular depolarization)
        const spike = (hr > 130 ? 44 : 32) * gain;
        y = midY - spike;
      } else if (pos >= period - 14 && pos < period - 8) {
        // S-dip
        y = midY + 14 * gain;
      } else if (pos >= period - 8 && pos < period) {
        // T-wave (ventricular repolarization)
        y = midY - 9 * gain;
      } else {
        // Baseline noise / small tremor
        const tremor = iotData.struggleDetected ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;
        y = midY + tremor;
      }

      // Phosphor sweep fade
      ctx.fillStyle = 'rgba(5, 8, 17, 0.12)';
      ctx.fillRect(x, 0, 12, height);

      // Render ECG Phosphor Trace
      ctx.strokeStyle = hr > 130 ? '#EF4444' : '#00F0FF';
      ctx.lineWidth = hr > 130 ? 2.5 : 1.8;
      ctx.shadowColor = hr > 130 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(0, 240, 255, 0.5)';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(x - speed, midY);
      ctx.lineTo(x, y);
      ctx.stroke();

      x = (x + speed) % width;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [iotData.connected, iotData.heartRate, iotData.struggleDetected, isFrozen, sweepMultiplier, gainMultiplier]);

  // Accelerometer attitude tilt calculation
  const normX = Math.min(Math.max(iotData.accelerometer.x / 4, -1), 1);
  const normY = Math.min(Math.max(iotData.accelerometer.y / 4, -1), 1);
  const targetX = 50 + normX * 38;
  const targetY = 50 + normY * 38;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Precision Instrument Header */}
      <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              Bio-Inertial Telemetry Testbed & Logic Analyzer
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
              SPEC: BLE 5.2 GATT
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time biometric oscilloscope and IMU vector analyzer for smart rings, bands, and pendants.
            Detects 3.8G impact thresholds, acute tachycardia, and physical struggle vectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleIotConnection}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border flex items-center gap-2 transition-all ${
              iotData.connected
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-tactile'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {iotData.connected ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
            <span>{iotData.connected ? 'LINK: ONLINE (GATT OK)' : 'LINK: DISCONNECTED'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Dual Channel Scope + Attitude HUD + Testbench Interrupts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scope Screen & IMU Attitude (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Oscilloscope CRT Unit */}
          <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4">
            {/* Top Scope Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06] text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-teal-400 font-bold flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span>CH1: PPG Photoplethysmography (250Hz)</span>
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">
                  MAC: <strong className="text-white">C4:8E:22:90:F1</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-obsidian-950 border border-white/[0.08] text-slate-300">
                  BAT: <strong className="text-emerald-400">{iotData.battery}%</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-obsidian-950 border border-white/[0.08] text-slate-300">
                  RSSI: <strong className="text-teal-300">{iotData.signalStrength} dBm</strong>
                </span>
              </div>
            </div>

            {/* Canvas Monitor */}
            <div className="relative rounded-xl overflow-hidden border border-white/[0.1] bg-[#050811] shadow-inner">
              <canvas
                ref={canvasRef}
                width={720}
                height={200}
                className="w-full h-48 block"
              />

              {/* Scope Calibration Watermark Overlays */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-teal-400/70 pointer-events-none space-y-0.5">
                <div>TIME/DIV: {200 / sweepMultiplier}ms</div>
                <div>VOLT/DIV: {0.5 / gainMultiplier}mV</div>
              </div>

              <div className="absolute top-2 right-3 text-[11px] font-mono pointer-events-none text-right">
                <div className="text-white font-bold text-sm tracking-tight">
                  {iotData.connected ? `${iotData.heartRate} BPM` : 'FLATLINE'}
                </div>
                <div className="text-[10px]">
                  {iotData.heartRate > 130 ? (
                    <span className="text-rose-400 font-bold animate-pulse">ACUTE TACHYCARDIA</span>
                  ) : iotData.heartRate > 100 ? (
                    <span className="text-amber-400 font-bold">ELEVATED EXERTION</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">NOMINAL SINUS RHYTHM</span>
                  )}
                </div>
              </div>
            </div>

            {/* Scope Dial Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFrozen(!isFrozen)}
                  className={`px-2.5 py-1 rounded-md border text-[11px] flex items-center gap-1.5 transition-all ${
                    isFrozen
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-obsidian-950 text-slate-300 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {isFrozen ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{isFrozen ? 'RESUME SWEEP' : 'FREEZE TRACE'}</span>
                </button>

                <button
                  onClick={() => setSweepMultiplier((prev) => (prev === 1 ? 2 : 1))}
                  className="px-2.5 py-1 rounded-md bg-obsidian-950 text-slate-300 border border-white/[0.08] hover:text-white text-[11px]"
                >
                  TIMEBASE: {sweepMultiplier}X
                </button>

                <button
                  onClick={() => setGainMultiplier((prev) => (prev === 1 ? 1.5 : 1))}
                  className="px-2.5 py-1 rounded-md bg-obsidian-950 text-slate-300 border border-white/[0.08] hover:text-white text-[11px]"
                >
                  GAIN: {gainMultiplier}X
                </button>
              </div>

              <div className="text-[11px] text-slate-500">
                SWEEP RATE: 250 SPS • DOWNSAMPLED FOR DISPLAY
              </div>
            </div>
          </div>

          {/* 3D Attitude / IMU Accelerometer Vector HUD */}
          <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold uppercase text-white">3-Axis IMU Dynamic Attitude Reticle</span>
              </div>
              <div className="text-teal-300 font-bold">
                VECTOR MAGNITUDE: {iotData.accelerometer.magnitude} G
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Attitude Crosshair Reticle (4 Cols) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative w-36 h-36 rounded-full border border-teal-500/30 bg-obsidian-950 p-2 shadow-inner flex items-center justify-center">
                  {/* Concentric rings */}
                  <div className="absolute inset-4 rounded-full border border-white/[0.05]" />
                  <div className="absolute inset-8 rounded-full border border-white/[0.05]" />

                  {/* Crosshairs */}
                  <div className="absolute inset-x-2 top-1/2 h-px bg-teal-500/20" />
                  <div className="absolute inset-y-2 left-1/2 w-px bg-teal-500/20" />

                  {/* Dynamic Target Beacon */}
                  <div
                    className={`absolute w-4 h-4 rounded-full border-2 transition-all duration-150 -translate-x-1/2 -translate-y-1/2 shadow-glow-teal ${
                      iotData.fallDetected
                        ? 'border-rose-500 bg-rose-500/80 animate-ping'
                        : iotData.struggleDetected
                        ? 'border-amber-400 bg-amber-400/80'
                        : 'border-teal-400 bg-teal-400/40'
                    }`}
                    style={{
                      left: `${targetX}%`,
                      top: `${targetY}%`,
                    }}
                  />

                  {/* Cardinal Axis labels */}
                  <span className="absolute top-1 text-[8px] font-mono text-slate-500">+Y</span>
                  <span className="absolute bottom-1 text-[8px] font-mono text-slate-500">-Y</span>
                  <span className="absolute right-1 text-[8px] font-mono text-slate-500">+X</span>
                  <span className="absolute left-1 text-[8px] font-mono text-slate-500">-X</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-2">
                  GIMBAL DEFLECTION ({normX > 0 ? '+' : ''}{normX.toFixed(2)}, {normY > 0 ? '+' : ''}{normY.toFixed(2)})
                </span>
              </div>

              {/* Axis Bars & Deceleration Metrics (7 Cols) */}
              <div className="md:col-span-7 space-y-3 font-mono text-xs">
                {/* X Axis */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>X-AXIS (LATERAL):</span>
                    <span className="text-white font-bold">{iotData.accelerometer.x} G</span>
                  </div>
                  <div className="h-1.5 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-200"
                      style={{ width: `${Math.min(Math.abs(iotData.accelerometer.x) * 25, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Y Axis */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Y-AXIS (SAGITTAL):</span>
                    <span className="text-white font-bold">{iotData.accelerometer.y} G</span>
                  </div>
                  <div className="h-1.5 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-200"
                      style={{ width: `${Math.min(Math.abs(iotData.accelerometer.y) * 25, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Z Axis */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Z-AXIS (GRAVITATIONAL / IMPACT):</span>
                    <span className={`font-bold ${iotData.accelerometer.z > 3.0 ? 'text-rose-400' : 'text-white'}`}>
                      {iotData.accelerometer.z} G
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        iotData.accelerometer.z > 3.0 ? 'bg-rose-500' : 'bg-teal-400'
                      }`}
                      style={{ width: `${Math.min(Math.abs(iotData.accelerometer.z) * 25, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 3.8G Warning Flag */}
                <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
                  <span>THRESHOLD: 3.8G DECELERATION</span>
                  <span className="text-teal-400">KALMAN FILTER: ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Industrial Interrupts & Raw Logic Stream (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Interrupt Testbench */}
          <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4">
            <div className="space-y-1 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  Hardware Distress Interrupts
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Simulate critical sensor thresholds to trigger the 5s abort window.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Button: 3.8G Hard Fall */}
              <button
                onClick={simulateFallEvent}
                className="w-full p-3 rounded-xl bg-obsidian-950 hover:bg-rose-950/40 border border-rose-500/40 hover:border-rose-500/80 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-rose-300">SIMULATE 3.8G FALL</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    IMPACT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Deceleration spike &gt;3.8G with subsequent zero-movement state.
                </p>
              </button>

              {/* Button: Struggle Oscillation */}
              <button
                onClick={simulateStruggleEvent}
                className="w-full p-3 rounded-xl bg-obsidian-950 hover:bg-amber-950/40 border border-amber-500/40 hover:border-amber-500/80 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-amber-300">SIMULATE STRUGGLE SHAKE</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    SHAKE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Rapid wrestling acceleration pattern on X and Y axes.
                </p>
              </button>

              {/* Button: Tachycardia Spike */}
              <button
                onClick={simulateHeartSpike}
                className="w-full p-3 rounded-xl bg-obsidian-950 hover:bg-purple-950/40 border border-purple-500/40 hover:border-purple-500/80 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-purple-300">TACHYCARDIA SURGE (148 BPM)</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    STRESS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Acute adrenaline pulse surge under stationary posture.
                </p>
              </button>

              {/* Button: Double-Click SOS */}
              <button
                onClick={() => {
                  triggerSOS('SOS_BUTTON');
                  setActiveTab('user');
                }}
                className="w-full p-3 rounded-xl bg-obsidian-950 hover:bg-teal-950/40 border border-teal-500/40 hover:border-teal-500/80 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-teal-300">SMART RING TACTILE CROWN</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">
                    CLICK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Physical double-click distress trigger on device bezel.
                </p>
              </button>

              {/* Reset Button */}
              <button
                onClick={resetIoTEvents}
                className="w-full py-2.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CALIBRATE TO BASELINE (74 BPM / 1.0G)</span>
              </button>
            </div>
          </div>

          {/* Raw Serial Hex Logic Packet Feed */}
          <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>RAW BLE GATT STREAM</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-1.5 text-[10px] font-mono text-slate-400 max-h-36 overflow-hidden">
              {hexLogs.length > 0 ? (
                hexLogs.map((log, idx) => (
                  <div key={idx} className="truncate text-slate-300">
                    <span className="text-teal-400">&gt; </span>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">Awaiting packet frames...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
