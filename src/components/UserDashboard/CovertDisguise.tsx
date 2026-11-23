import React, { useState } from 'react';
import { Eye, Shield, Lock } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const CovertDisguise: React.FC = () => {
  const { isSilentMode, toggleSilentMode, activeIncident, userLocation } = useSafety();
  const [calcDisplay, setCalcDisplay] = useState('0');

  if (!isSilentMode) return null;

  const handleBtn = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      try {
        // Safe evaluation
        const clean = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        setCalcDisplay(String(Function(`'use strict'; return (${clean})`)()));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay((prev) => (prev === '0' ? val : prev + val));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-4 sm:p-6 animate-fade select-none">
      {/* Covert header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 px-2">
        <span>Standard Calculator v2.4</span>
        {/* Secret exit button */}
        <button
          onClick={toggleSilentMode}
          className="p-1 rounded text-neutral-700 hover:text-neutral-400 flex items-center gap-1"
          title="Exit Covert Disguise"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="text-[10px]">Exit Disguise</span>
        </button>
      </div>

      {/* Secret beacon status pill (subtle dot) */}
      <div className="flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-ping" />
        <span className="text-[10px] text-neutral-600 font-mono tracking-widest">
          COVERT TELEMETRY TRANSMITTING • LAT {userLocation.lat.toFixed(3)} LNG {userLocation.lng.toFixed(3)}
        </span>
      </div>

      {/* Calculator Screen */}
      <div className="max-w-xs mx-auto w-full space-y-4">
        <div className="text-right text-4xl sm:text-5xl font-light font-mono px-4 py-6 bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-100 overflow-x-auto">
          {calcDisplay}
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5 text-lg font-medium">
          {['C', '+/-', '%', '/'].map((b) => (
            <button
              key={b}
              onClick={() => (b === 'C' ? handleBtn('C') : null)}
              className="h-14 rounded-2xl bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
            >
              {b}
            </button>
          ))}
          {['7', '8', '9', '*'].map((b) => (
            <button
              key={b}
              onClick={() => handleBtn(b)}
              className={`h-14 rounded-2xl ${
                b === '*' ? 'bg-amber-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
            >
              {b}
            </button>
          ))}
          {['4', '5', '6', '-'].map((b) => (
            <button
              key={b}
              onClick={() => handleBtn(b)}
              className={`h-14 rounded-2xl ${
                b === '-' ? 'bg-amber-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
            >
              {b}
            </button>
          ))}
          {['1', '2', '3', '+'].map((b) => (
            <button
              key={b}
              onClick={() => handleBtn(b)}
              className={`h-14 rounded-2xl ${
                b === '+' ? 'bg-amber-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
            >
              {b}
            </button>
          ))}
          <button
            onClick={() => handleBtn('0')}
            className="col-span-2 h-14 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white pl-6 text-left"
          >
            0
          </button>
          <button
            onClick={() => handleBtn('.')}
            className="h-14 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white"
          >
            .
          </button>
          <button
            onClick={() => handleBtn('=')}
            className="h-14 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
          >
            =
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-neutral-700 pb-2">
        Tap "Exit Disguise" at the top right to return to SHIELD.
      </div>
    </div>
  );
};
