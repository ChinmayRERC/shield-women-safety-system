import React from 'react';
import { ShieldCheck, AlertCircle, Wifi } from 'lucide-react';

export const SimulationBanner: React.FC = () => {
  return (
    <div className="bg-obsidian-950 border-b border-white/[0.06] text-xs py-1.5 px-4 font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
        {/* Left Status indicator */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
          </span>
          <span className="text-teal-300 font-bold uppercase tracking-wider text-[10px] bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            SYS: SIMULATION_HARNESS_V2
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Telemetry, CAD dispatch, and SMS events execute in offline edge sandbox.
          </span>
        </div>

        {/* Right Status metrics */}
        <div className="flex items-center gap-3 text-slate-400 text-[10px]">
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>ENCRYPTED CLIENT DATA</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>REAL 112/911 DISCONNECTED</span>
          </span>
        </div>
      </div>
    </div>
  );
};
