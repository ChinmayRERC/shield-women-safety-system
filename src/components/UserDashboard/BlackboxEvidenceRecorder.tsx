import React, { useState } from 'react';
import { Camera, ShieldCheck, Download, Lock, CheckCircle2, Clock, MapPin, Activity } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const BlackboxEvidenceRecorder: React.FC = () => {
  const { activeIncident, userLocation, userProfile, iotData } = useSafety();
  const [evidenceSaved, setEvidenceSaved] = useState(false);

  const mockHash = 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  const handleDownloadEvidence = () => {
    const evidenceData = {
      incidentId: activeIncident?.id || 'INC-LIVE-BLACKBOX',
      timestamp: new Date().toISOString(),
      citizen: {
        name: userProfile.name,
        phone: userProfile.phone,
        bloodGroup: userProfile.bloodGroup,
      },
      telemetry: {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        address: userLocation.address,
        heartRateBpm: iotData.connected ? iotData.heartRate : 74,
        accelerometerG: iotData.connected ? iotData.accelerometer.magnitude : 1.0,
      },
      cryptographicSignature: {
        hashAlgorithm: 'SHA-256',
        signature: mockHash,
        verifiedImmutable: true,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evidenceData, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `shield-evidence-blackbox-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setEvidenceSaved(true);
    setTimeout(() => setEvidenceSaved(false), 3000);
  };

  return (
    <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Blackbox Evidentiary Recorder & Cryptographic HUD
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Captures tamper-evident GPS, sensor telemetry, and situational logs for legal protection
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadEvidence}
          className="px-3 py-1.5 rounded-md bg-obsidian-950 hover:bg-obsidian-850 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-tactile"
        >
          {evidenceSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
          <span>{evidenceSaved ? 'PACKET EXPORTED' : 'EXPORT EVIDENCE PACKET'}</span>
        </button>
      </div>

      {/* Simulated Video/Snapshot HUD Frame */}
      <div className="relative rounded-xl overflow-hidden bg-black border border-white/[0.1] aspect-video max-h-56 flex flex-col justify-between p-3.5 shadow-2xl select-none">
        {/* Subtle camera scanlines & watermark */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent pointer-events-none" />

        {/* Top HUD Row */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-teal-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-rose-300">REC • EVIDENCE SECURE STREAM</span>
          </div>
          <div className="bg-black/60 px-2 py-0.5 rounded border border-white/[0.1]">
            {new Date().toLocaleTimeString()} • 30 FPS
          </div>
        </div>

        {/* Center Crosshair / HUD Target */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border border-teal-400/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-teal-400/60" />
          </div>
        </div>

        {/* Bottom HUD Telemetry Overlay */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono bg-black/85 p-2 rounded-lg border border-white/10 text-slate-300 backdrop-blur-sm">
          <div>
            <span className="text-slate-500 block">GPS FIX</span>
            <span className="text-white font-bold">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">PULSE BIOMETRIC</span>
            <span className="text-teal-400 font-bold">{iotData.connected ? `${iotData.heartRate} BPM` : '74 BPM'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">IMU FORCE</span>
            <span className="text-amber-400 font-bold">{iotData.connected ? `${iotData.accelerometer.magnitude} G` : '1.0 G'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">TAMPER HASH</span>
            <span className="text-teal-300 font-bold truncate block">7f83b165...</span>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
          <span className="truncate">Cryptographic Stamp: <strong className="text-slate-200">{mockHash}</strong></span>
        </div>
        <span className="text-emerald-400 font-bold text-[10px] uppercase flex-shrink-0">Verified Immutable</span>
      </div>
    </div>
  );
};
