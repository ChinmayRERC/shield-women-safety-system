import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Mic, Volume2, ShieldAlert } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const FakeCallSimulator: React.FC = () => {
  const { isFakeCallActive, endFakeCall, fakeCallerName, triggerSOS } = useSafety();
  const [callConnected, setCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (callConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callConnected]);

  if (!isFakeCallActive) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDecline = () => {
    setCallConnected(false);
    endFakeCall();
  };

  const handleAccept = () => {
    setCallConnected(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-xl animate-fade">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-navy-900 via-navy-950 to-black border-2 border-teal-500/40 p-6 text-center text-white shadow-2xl relative overflow-hidden space-y-6">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Incoming header */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-teal-400 bg-teal-500/20 px-2.5 py-1 rounded-full border border-teal-500/30">
            {callConnected ? 'Call In Progress' : 'Incoming Emergency Disguise Call'}
          </span>
          <p className="text-xs text-slate-400 pt-1">
            {callConnected ? `Connected • ${formatTimer(callDuration)}` : 'Simulated Discreet Escape Caller'}
          </p>
        </div>

        {/* Caller Avatar */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-navy-800 border-2 border-teal-400/50 flex items-center justify-center shadow-xl">
              <User className="w-12 h-12 text-teal-300" />
            </div>
            {!callConnected && (
              <span className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-60" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-white">{fakeCallerName}</h3>
            <p className="text-xs text-slate-400 font-mono">+91 98765 00000</p>
          </div>
        </div>

        {/* Call Content or Simulated Script */}
        {callConnected ? (
          <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-800 text-left space-y-2">
            <div className="text-[10px] text-teal-400 uppercase font-mono font-bold flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Recommended Spoken Script:</span>
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "Hey! Yes, I am just 20 meters away. My brother is standing right by the police booth waiting for me. I can see you now!"
            </p>

            <button
              onClick={() => {
                triggerSOS('SILENT_ALERT', { silent: true });
                handleDecline();
              }}
              className="w-full mt-2 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Send Covert SOS From Call</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Answer the call to play aloud the scripted escape dialogue and safely walk away.
          </p>
        )}

        {/* Action Call Buttons */}
        <div className="flex items-center justify-around pt-2">
          {/* Decline / Hang Up */}
          <button
            onClick={handleDecline}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 group-hover:scale-110 transition-transform">
              <PhoneOff className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-slate-300 font-medium">
              {callConnected ? 'End Call' : 'Decline'}
            </span>
          </button>

          {/* Accept (if ringing) */}
          {!callConnected && (
            <button
              onClick={handleAccept}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 group-hover:scale-110 transition-transform animate-bounce">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-[11px] text-emerald-300 font-bold">Answer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
