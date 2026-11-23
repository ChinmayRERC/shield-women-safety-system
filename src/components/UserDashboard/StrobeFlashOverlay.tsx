import React, { useState, useEffect } from 'react';
import { Zap, XCircle } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const StrobeFlashOverlay: React.FC = () => {
  const { isStrobeActive, stopStrobe } = useSafety();
  const [flashWhite, setFlashWhite] = useState(false);

  useEffect(() => {
    if (!isStrobeActive) return;
    const interval = setInterval(() => {
      setFlashWhite((prev) => !prev);
    }, 90); // 10-11 Hz optical strobe
    return () => clearInterval(interval);
  }, [isStrobeActive]);

  if (!isStrobeActive) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 transition-colors duration-75 select-none ${
        flashWhite ? 'bg-white text-navy-950' : 'bg-red-600 text-white'
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-black/60 text-white px-3 py-1.5 rounded-full">
        <Zap className="w-4 h-4 animate-bounce text-yellow-300" />
        <span>High-Intensity Optical Disorientation Strobe Active</span>
      </div>

      <div className="text-center space-y-4">
        <div className="text-5xl sm:text-7xl font-black uppercase tracking-tighter drop-shadow-xl">
          SOS STROBE
        </div>
        <p className="font-bold text-sm sm:text-base max-w-sm mx-auto bg-black/50 text-white px-4 py-2 rounded-2xl">
          Point device screen outward towards perpetrator to disorient and illuminate surroundings.
        </p>

        <button
          onClick={stopStrobe}
          className="mt-6 px-8 py-4 rounded-2xl bg-black hover:bg-neutral-900 text-white font-extrabold text-base tracking-wider uppercase shadow-2xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 mx-auto"
        >
          <XCircle className="w-6 h-6 text-red-500" />
          <span>Stop Strobe Flash</span>
        </button>
      </div>

      <div className="text-[11px] font-mono bg-black/70 text-slate-300 px-3 py-1 rounded-lg">
        Caution: Rapid flashing light. Tap center button to deactivate.
      </div>
    </div>
  );
};
