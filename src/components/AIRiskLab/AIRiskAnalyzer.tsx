import React from 'react';
import {
  Cpu,
  Sun,
  Moon,
  Battery,
  Users,
  Route,
  Activity,
  AlertTriangle,
  Radio,
  HeartPulse,
  Flame,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Terminal,
  Zap,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { AIRiskInput } from '../../services/aiRiskEngine';

export const AIRiskAnalyzer: React.FC = () => {
  const {
    aiInput,
    setAiInput,
    riskAnalysis,
    iotData,
    simulateFallEvent,
    simulateStruggleEvent,
    simulateHeartSpike,
    resetIoTEvents,
    triggerSOS,
    setActiveTab,
  } = useSafety();

  const handleScenarioPreset = (scenario: 'NIGHT_UNLIT' | 'DAY_BUSY' | 'EVENING_DEVIATION') => {
    if (scenario === 'NIGHT_UNLIT') {
      setAiInput({
        timeOfDayHours: 23,
        ambientLighting: 'PITCH_DARK',
        crowdDensity: 'DESERTED',
        batteryLevel: 12,
        routeStatus: 'UNKNOWN_CORRIDOR',
        iotData,
        nearRiskZone: null,
      });
    } else if (scenario === 'DAY_BUSY') {
      setAiInput({
        timeOfDayHours: 14,
        ambientLighting: 'WELL_LIT',
        crowdDensity: 'HIGH_CROWD',
        batteryLevel: 85,
        routeStatus: 'ON_SAFE_ROUTE',
        iotData,
        nearRiskZone: null,
      });
    } else if (scenario === 'EVENING_DEVIATION') {
      setAiInput({
        timeOfDayHours: 20,
        ambientLighting: 'POOR',
        crowdDensity: 'SPARSE',
        batteryLevel: 34,
        routeStatus: 'MINOR_DEVIATION',
        iotData,
        nearRiskZone: null,
      });
    }
  };

  const getTierBadge = (score: number) => {
    if (score >= 75)
      return {
        label: 'CRITICAL HAZARD',
        classes: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        stroke: '#EF4444',
      };
    if (score >= 50)
      return {
        label: 'ELEVATED VIGILANCE',
        classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        stroke: '#F59E0B',
      };
    if (score >= 25)
      return {
        label: 'MODERATE CAUTION',
        classes: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
        stroke: '#EAB308',
      };
    return {
      label: 'NOMINAL SAFE',
      classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      stroke: '#10B981',
    };
  };

  const tier = getTierBadge(riskAnalysis.score);

  // Gauge calculations for semi-circle 180 degrees
  const radius = 68;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (riskAnalysis.score / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Precision Instrument Header */}
      <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              Explainable AI Threat Matrix (XAI)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
              MODEL: MULTI-ATTRIBUTE LINEAR HEURISTIC
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulates dynamic multi-factor environmental risk calculation. Adjust spatial parameters to inspect
            instant linear factor attribution weights (&Delta;S) and automated preventive countermeasure triggers.
          </p>
        </div>

        {/* Preset scenario triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleScenarioPreset('NIGHT_UNLIT')}
            className="px-2.5 py-1.5 rounded-lg bg-obsidian-950 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition-all"
          >
            SCENARIO: NIGHT UNLIT
          </button>
          <button
            onClick={() => handleScenarioPreset('DAY_BUSY')}
            className="px-2.5 py-1.5 rounded-lg bg-obsidian-950 hover:bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all"
          >
            SCENARIO: DAY TRANSIT
          </button>
          <button
            onClick={() => handleScenarioPreset('EVENING_DEVIATION')}
            className="px-2.5 py-1.5 rounded-lg bg-obsidian-950 hover:bg-amber-950/40 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all"
          >
            SCENARIO: ROUTE VARIANCE
          </button>
        </div>
      </div>

      {/* Main Grid: Controls vs Computed Real-time Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Environmental & Context Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono">
              <span className="font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Environmental & Spatial Telemetry</span>
              </span>
              <span className="text-[10px] text-slate-500">INPUT BUS: READY</span>
            </div>

            {/* Time of Day Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  {aiInput.timeOfDayHours >= 19 || aiInput.timeOfDayHours < 6 ? (
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  Circadian Hour:
                </span>
                <span className="text-white font-bold">
                  {aiInput.timeOfDayHours.toString().padStart(2, '0')}:00 HRS
                  {aiInput.timeOfDayHours >= 22 || aiInput.timeOfDayHours < 5
                    ? ' (CRITICAL)'
                    : aiInput.timeOfDayHours >= 19
                    ? ' (DUSK)'
                    : ' (DAYLIGHT)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={aiInput.timeOfDayHours}
                onChange={(e) =>
                  setAiInput({ ...aiInput, timeOfDayHours: parseInt(e.target.value) })
                }
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-obsidian-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>00:00 (MIDNIGHT)</span>
                <span>12:00 (NOON)</span>
                <span>23:00 (NIGHT)</span>
              </div>
            </div>

            {/* Ambient Lighting */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block">
                Street Illumination (Lumens):
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 'WELL_LIT', label: 'WELL LIT (LEDs)' },
                  { id: 'MODERATE', label: 'MODERATE LIGHT' },
                  { id: 'POOR', label: 'POOR / DIM' },
                  { id: 'PITCH_DARK', label: 'PITCH DARK (0 LM)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setAiInput({ ...aiInput, ambientLighting: item.id as any })
                    }
                    className={`p-2 rounded-lg border text-center transition-all ${
                      aiInput.ambientLighting === item.id
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/40 shadow-tactile font-bold'
                        : 'bg-obsidian-950 text-slate-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crowd Density */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Pedestrian Footfall / Bystander Count:</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 'HIGH_CROWD', label: 'HIGH TRAFFIC' },
                  { id: 'MODERATE', label: 'NORMAL FLOW' },
                  { id: 'SPARSE', label: 'SPARSE' },
                  { id: 'DESERTED', label: 'DESERTED (0)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setAiInput({ ...aiInput, crowdDensity: item.id as any })
                    }
                    className={`p-2 rounded-lg border text-center transition-all ${
                      aiInput.crowdDensity === item.id
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/40 shadow-tactile font-bold'
                        : 'bg-obsidian-950 text-slate-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Route Status */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-teal-400" />
                <span>Corridor Verification Status:</span>
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { id: 'ON_SAFE_ROUTE', label: 'SAFE ROUTE' },
                  { id: 'MINOR_DEVIATION', label: 'DEVIATION' },
                  { id: 'UNKNOWN_CORRIDOR', label: 'ALLEY' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setAiInput({ ...aiInput, routeStatus: item.id as any })
                    }
                    className={`p-2 rounded-lg border text-center text-[10px] transition-all ${
                      aiInput.routeStatus === item.id
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/40 shadow-tactile font-bold'
                        : 'bg-obsidian-950 text-slate-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Reserve Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-teal-400" />
                  Terminal Battery:
                </span>
                <span className={`font-bold ${aiInput.batteryLevel <= 15 ? 'text-rose-400' : 'text-teal-300'}`}>
                  {aiInput.batteryLevel}% {aiInput.batteryLevel <= 15 ? '[CRITICAL]' : ''}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={aiInput.batteryLevel}
                onChange={(e) =>
                  setAiInput({ ...aiInput, batteryLevel: parseInt(e.target.value) })
                }
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-obsidian-950 rounded-lg"
              />
            </div>
          </div>

          {/* IoT Telemetry Coupling Sub-Card */}
          <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-300 uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                <span>Coupled IoT Biometric Bus</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                iotData.connected
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
              }`}>
                {iotData.connected ? 'LINKED (250Hz)' : 'OFFLINE'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-obsidian-950 border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block">PULSE</span>
                <span className={`font-bold ${iotData.heartRate > 120 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                  {iotData.heartRate} BPM
                </span>
              </div>
              <div className="p-2 rounded-lg bg-obsidian-950 border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block">IMU VEC</span>
                <span className={`font-bold ${iotData.accelerometer.magnitude > 2.0 ? 'text-rose-400' : 'text-white'}`}>
                  {iotData.accelerometer.magnitude} G
                </span>
              </div>
              <div className="p-2 rounded-lg bg-obsidian-950 border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block">SENSOR FLAG</span>
                <span className="text-teal-300 text-[10px] block truncate font-bold">
                  {iotData.fallDetected ? 'FALL 3.8G' : iotData.struggleDetected ? 'STRUGGLE' : 'NOMINAL'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <button
                onClick={simulateFallEvent}
                className="py-1.5 px-2 rounded-lg bg-obsidian-950 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 font-bold"
              >
                INJECT 3.8G SHOCK
              </button>
              <button
                onClick={simulateHeartSpike}
                className="py-1.5 px-2 rounded-lg bg-obsidian-950 hover:bg-purple-950/40 text-purple-300 border border-purple-500/30 font-bold"
              >
                INJECT TACHYCARDIA
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Threat Cockpit Gauge & Factor Attribution (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-5">
            {/* Speedometer Gauge & Threat Level */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-white/[0.06]">
              {/* Cockpit Dial Arc */}
              <div className="flex items-center gap-4">
                <div className="relative w-36 h-24 flex items-center justify-center">
                  <svg className="w-36 h-36 -rotate-180 transform" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#0F162A"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={tier.stroke}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute top-10 flex flex-col items-center">
                    <span className="text-3xl font-black text-white font-mono tracking-tight">
                      {riskAnalysis.score}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400 block">
                    Composite Threat Level
                  </span>
                  <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${tier.classes}`}>
                    {tier.label}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono pt-0.5">
                    Additive Formulation: S = clamp(S0 + &Sigma;wk, 5, 98)
                  </p>
                </div>
              </div>

              <div className="text-right border-l border-white/[0.06] pl-4 sm:pl-6 font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">Engine Confidence</span>
                <span className="text-2xl font-black text-teal-300">{riskAnalysis.confidence}%</span>
                <span className="text-[10px] text-slate-400 block">5 Active Telemetry Vectors</span>
              </div>
            </div>

            {/* Natural Language Diagnostic Rationale */}
            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-mono font-bold uppercase">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>Explainable Diagnostic Synthesis:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {riskAnalysis.explanation}
              </p>
            </div>

            {/* Explainable Factor Attribution (SHAP-style) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                <span>Linear Factor Attribution Weights (&Delta;S)</span>
                <span className="text-slate-500 text-[10px]">Point Delta</span>
              </div>

              <div className="space-y-2">
                {riskAnalysis.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] flex items-center justify-between gap-3 text-xs hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-semibold text-white truncate">{item.factor}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-obsidian-900 text-slate-400 flex-shrink-0 border border-white/[0.06]">
                          {item.value}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-sans">{item.description}</p>
                    </div>

                    <div className="text-right font-mono font-bold flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${
                          item.impact === 'DANGER'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : item.impact === 'WARNING'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : item.impact === 'POSITIVE'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
                        }`}
                      >
                        {item.weight > 0 ? `+${item.weight}` : item.weight} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300 block">
                Automated Preventive Countermeasures
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {riskAnalysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold font-mono">&gt;</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trigger Emergency Button if Elevated */}
            {riskAnalysis.score >= 70 && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    triggerSOS('SOS_BUTTON');
                    setActiveTab('user');
                  }}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-glow-crimson flex items-center justify-center gap-2 transition-all"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>CRITICAL HAZARD THRESHOLD EXCEEDED: DISPATCH CAD TICKET</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
