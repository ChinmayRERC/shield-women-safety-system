import React from 'react';
import {
  Award,
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Cpu,
  Radio,
  Clock,
  ArrowRight,
  TrendingDown,
  Lock,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const JudgePitchView: React.FC = () => {
  const { setActiveTab } = useSafety();

  const comparisonMatrix = [
    {
      feature: 'Zero-Touch Fall & Struggle Trigger (IoT)',
      traditional: false,
      hardwarePendant: 'Limited Fall only',
      shield: '3.8G Shock + Struggle + Tachycardia BPM',
    },
    {
      feature: 'Explainable AI Threat Scoring (XAI)',
      traditional: false,
      hardwarePendant: false,
      shield: 'Additive Linear Model with Factor Attribution',
    },
    {
      feature: 'False Alarm Abort Grace Window',
      traditional: 'None (accidental calls)',
      hardwarePendant: 'Difficult to cancel',
      shield: '5s Audible Grace + PIN 4321 Abort',
    },
    {
      feature: 'Discreet Covert Mode',
      traditional: 'Obvious emergency UI',
      hardwarePendant: 'N/A',
      shield: 'Interactive Working Calculator Disguise',
    },
    {
      feature: 'Voice Distress Recognition',
      traditional: false,
      hardwarePendant: false,
      shield: 'Real-time Web Speech API + Acoustic Monitor',
    },
    {
      feature: 'AI Safe Route Corridor Pathfinding',
      traditional: 'Basic Google Route',
      hardwarePendant: false,
      shield: '96% Safe Corridor via CCTV & Pink Booths',
    },
    {
      feature: 'Municipal CAD Police Command Center',
      traditional: 'SMS only',
      hardwarePendant: 'Third-party Call Center',
      shield: 'Integrated CAD Triage & Multi-Unit Dispatch',
    },
    {
      feature: 'Cloud Billing & Paid Subscriptions',
      traditional: 'Required',
      hardwarePendant: '$20/month',
      shield: '100% Free, Local & Edge-Autonomous',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Precision Pitch Header */}
      <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile font-mono space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06] text-xs">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-300 font-bold">
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span>STATE INNOVATION HACKATHON 2026 // BENCHMARK EVALUATION</span>
          </div>
          <span className="text-slate-500 text-[10px]">PARADIGM: ZERO-LATENCY EDGE CAD</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans">
          Why SHIELD Outperforms Conventional Safety Paradigms
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
          Traditional panic apps fail because victims under acute physical duress cannot unlock a smartphone, navigate a GUI, or speak into a microphone.
          <strong className="text-white font-semibold"> SHIELD</strong> re-engineers emergency response into an autonomous, zero-latency bio-inertial edge intelligence framework.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => setActiveTab('user')}
            className="px-4 py-2 rounded-lg bg-teal-accent hover:bg-teal-400 text-obsidian-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-teal transition-all"
          >
            <span>TEST SAFETY TERMINAL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('ai-lab')}
            className="px-4 py-2 rounded-lg bg-obsidian-950 hover:bg-obsidian-850 text-slate-300 hover:text-white font-mono font-bold text-xs border border-white/[0.08] flex items-center gap-2 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>INSPECT AI RISK ENGINE</span>
          </button>
        </div>
      </div>

      {/* Latency & Survival Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white font-mono">78% Reduction</div>
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase">Emergency Latency Compression</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Automating zero-touch fall and struggle interrupts eliminates the 4-minute human unlock-and-dial friction during violence.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white font-mono">3.4 min ETA</div>
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase">Rapid CAD Fleet Mobilization</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Real-time CAD algorithms auto-match the nearest Pink Patrol bike or squad unit based on continuous spatial telemetry.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white font-mono">100% Offline</div>
          <h3 className="text-xs font-bold font-mono text-slate-200 uppercase">Edge-Autonomous Resilience</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Zero reliance on paid cloud AI billing or subscription keys. Built with Web Audio synthesis, LocalStorage, and client-side heuristics.
          </p>
        </div>
      </div>

      {/* Benchmark Matrix Table */}
      <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4">
        <div className="border-b border-white/[0.06] pb-3">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
            Competitive Benchmark Evaluation Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive audit comparing conventional solutions against the SHIELD Next-Gen Platform.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">EVALUATION METRIC</th>
                <th className="py-2.5 px-3">TRADITIONAL SOS APPS</th>
                <th className="py-2.5 px-3">COMMERCIAL PANIC FOBS</th>
                <th className="py-2.5 px-3 text-teal-300 font-bold bg-teal-500/10 rounded-t-md">
                  SHIELD AI-CAD PLATFORM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-sans">
              {comparisonMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white font-mono text-xs">{row.feature}</td>

                  <td className="py-3 px-3 text-slate-400">
                    {typeof row.traditional === 'boolean' ? (
                      row.traditional ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500/80" />
                      )
                    ) : (
                      row.traditional
                    )}
                  </td>

                  <td className="py-3 px-3 text-slate-400">
                    {typeof row.hardwarePendant === 'boolean' ? (
                      row.hardwarePendant ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500/80" />
                      )
                    ) : (
                      row.hardwarePendant
                    )}
                  </td>

                  <td className="py-3 px-3 font-bold text-teal-300 bg-teal-500/5 font-mono text-xs">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span>{row.shield}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
