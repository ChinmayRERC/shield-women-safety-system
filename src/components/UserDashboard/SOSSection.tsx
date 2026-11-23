import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Volume2,
  VolumeX,
  EyeOff,
  Navigation,
  RefreshCw,
  PhoneCall,
  Clock,
  CheckCircle2,
  Lock,
  Compass,
  Zap,
  Radio,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { CITY_PRESETS } from '../../services/geoService';

export const SOSSection: React.FC = () => {
  const {
    activeIncident,
    isCountingDown,
    countdownSeconds,
    triggerSOS,
    confirmSOSNow,
    cancelSOSCountdown,
    resolveIncident,
    isSirenPlaying,
    toggleSiren,
    playWhistle,
    isStrobeActive,
    toggleStrobe,
    isSilentMode,
    toggleSilentMode,
    isSafeWalkActive,
    safeWalkETA,
    startSafeWalk,
    stopSafeWalk,
    triggerFakeCall,
    userLocation,
    refreshLocation,
    setUserLocation,
    riskAnalysis,
    setActiveTab,
    iotData,
    resetIoTEvents,
  } = useSafety();

  const [cancelPin, setCancelPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showLocationPresets, setShowLocationPresets] = useState(false);
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshingGps(true);
    await refreshLocation();
    setTimeout(() => setIsRefreshingGps(false), 600);
  };

  const handleCancelWithPin = () => {
    if (cancelPin === '4321' || cancelPin === '') {
      cancelSOSCountdown('Verified false alarm cancellation');
      setCancelPin('');
      setPinError(false);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handlePresetSelect = (preset: (typeof CITY_PRESETS)[0]) => {
    setUserLocation({
      lat: preset.lat,
      lng: preset.lng,
      address: preset.address,
      timestamp: Date.now(),
      accuracy: 8,
    });
    setShowLocationPresets(false);
  };

  return (
    <div className="space-y-6">
      {/* Active Incident Operational Banner */}
      {activeIncident && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-obsidian-900 to-rose-950/90 border border-rose-500/80 shadow-glow-crimson animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-rose-600 text-white shadow-tactile">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40">
                    DISPATCH QUEUE #{activeIncident.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-rose-500 text-white">
                    {activeIncident.status}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  Emergency Distress Signals Transmitted to CAD & Guardians
                </h3>
                <p className="text-xs text-rose-200 mt-0.5 font-mono">
                  Assigned Unit: <strong className="text-white">{activeIncident.assignedResponder || 'Awaiting Triage...'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('map')}
                className="px-3.5 py-2 rounded-xl bg-obsidian-900 text-white border border-white/[0.12] hover:border-teal-400 text-xs font-semibold flex items-center gap-1.5 shadow-tactile transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Track on Map</span>
              </button>
              <button
                onClick={() => resolveIncident(activeIncident.id, 'Citizen marked safe by manual verification')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-tactile flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Safe (Resolve)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active IoT Sensor Hardware Interrupt Card */}
      {(iotData.fallDetected || iotData.struggleDetected || iotData.heartRate > 130) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-obsidian-900 to-rose-950/90 border border-rose-500/70 shadow-tactile flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-300 block">
                Wearable Sensor Telemetry Interrupt
              </span>
              <div className="text-sm font-bold text-white mt-0.5">
                {iotData.fallDetected
                  ? '⚠️ 3.85G Ground Deceleration Impact Vector Detected'
                  : iotData.struggleDetected
                  ? '⚠️ Rapid Oscillatory Altercation Shake Detected'
                  : '⚠️ Acute Tachycardia Surge (>135 BPM) Detected'}
              </div>
              <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                Pulse: {iotData.heartRate} BPM • Force Vector: {iotData.accelerometer.magnitude} G • Device: {iotData.deviceName}
              </div>
            </div>
          </div>
          <button
            onClick={resetIoTEvents}
            className="px-3.5 py-1.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 hover:text-white border border-white/[0.12] text-xs font-semibold self-start sm:self-auto shadow-tactile transition-all"
          >
            Reset Sensor Alert
          </button>
        </div>
      )}

      {/* Hero SOS Mission Control Console */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-tactile-lg backdrop-blur-2xl overflow-hidden text-center">
        {/* Subtle engineered hairline grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/[0.04] via-transparent to-transparent pointer-events-none" />

        {/* Top telemetry and AI pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 relative z-10 text-xs font-mono">
          <div
            onClick={() => setActiveTab('ai-lab')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950/80 border border-white/[0.08] cursor-pointer hover:border-teal-400/50 transition-colors shadow-tactile"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                riskAnalysis.level === 'CRITICAL'
                  ? 'bg-rose-500 animate-ping'
                  : riskAnalysis.level === 'HIGH'
                  ? 'bg-amber-400'
                  : riskAnalysis.level === 'MODERATE'
                  ? 'bg-yellow-400'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-slate-400">THREAT STATUS:</span>
            <span
              className={`font-black tracking-wide ${
                riskAnalysis.level === 'CRITICAL'
                  ? 'text-rose-400'
                  : riskAnalysis.level === 'HIGH'
                  ? 'text-amber-300'
                  : 'text-teal-300'
              }`}
            >
              {riskAnalysis.level} ({riskAnalysis.score}/100)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              onClick={() => setActiveTab('iot')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950/80 border border-white/[0.08] font-mono text-[11px] cursor-pointer hover:border-teal-400/50 transition-colors shadow-tactile"
              title="Click to inspect IoT Wearable telemetry"
            >
              <span className={`w-2 h-2 rounded-full ${iotData.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-slate-400">PULSE:</span>
              <span className="text-teal-300 font-bold">{iotData.connected ? `${iotData.heartRate} BPM` : 'OFF'}</span>
            </div>
            <span className="hidden sm:inline text-slate-500 text-[10px] tracking-wider uppercase font-mono">
              • 5s Grace Abort Window
            </span>
          </div>
        </div>

        {/* SOS Panic Button or Active Countdown Card */}
        {isCountingDown ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-b from-rose-950/90 to-obsidian-950 border-2 border-rose-500 shadow-glow-crimson relative z-10 space-y-5 animate-scale">
            <div className="flex items-center justify-center gap-2 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
              <span className="text-xs font-mono font-black tracking-widest uppercase">
                Grace Abort Window Active
              </span>
            </div>

            <div className="text-7xl font-black text-white font-mono tracking-tight animate-pulse drop-shadow">
              00:0{countdownSeconds}
            </div>

            <p className="text-xs text-rose-200/90 leading-relaxed max-w-sm mx-auto font-sans">
              Broadcasting GPS coordinates and biometric telemetry to CAD dispatch & guardians in{' '}
              <strong className="text-white font-bold">{countdownSeconds} seconds</strong>.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="PIN: 4321"
                  value={cancelPin}
                  onChange={(e) => setCancelPin(e.target.value)}
                  className={`w-36 text-center text-sm font-mono tracking-widest px-3 py-2.5 rounded-xl bg-obsidian-950 border ${
                    pinError ? 'border-rose-500 text-rose-400 animate-shake' : 'border-white/[0.12] text-white'
                  } focus:outline-none focus:border-teal-400 shadow-inner`}
                />
                <button
                  onClick={handleCancelWithPin}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-navy-950 text-xs font-black uppercase tracking-wider transition-all shadow-tactile"
                >
                  Cancel SOS
                </button>
              </div>
              {pinError && <p className="text-[11px] text-rose-400 font-mono">Invalid PIN. Demo PIN is 4321</p>}

              <button
                onClick={confirmSOSNow}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black tracking-wider uppercase shadow-tactile transition-all"
              >
                Dispatch Immediately (Bypass Timer)
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center relative z-10">
            {/* Multi-Ring Milled Tactical Bezel */}
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Radar Rings */}
              <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-rose-500/15 animate-ping-slow pointer-events-none" />
              <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-rose-500/25 animate-pulse pointer-events-none" />

              {/* Milled Outer Housing */}
              <div className="p-3 sm:p-4 rounded-full bg-obsidian-950 border border-white/[0.1] shadow-tactile-lg">
                <button
                  onClick={() => triggerSOS('SOS_BUTTON')}
                  className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-rose-500 via-red-600 to-rose-700 hover:from-rose-400 hover:to-red-500 text-white font-black shadow-glow-crimson flex flex-col items-center justify-center gap-1.5 border border-rose-400/40 transition-all transform hover:scale-105 active:scale-95 group select-none"
                >
                  <AlertOctagon className="w-12 h-12 text-white group-hover:scale-110 transition-transform drop-shadow" />
                  <span className="text-3xl sm:text-4xl tracking-widest font-black uppercase font-mono">
                    SOS
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-mono font-bold text-rose-200">
                    PRESS FOR HELP
                  </span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-7 max-w-sm font-sans leading-relaxed">
              One-touch initiates emergency GPS broadcast to designated guardians and nearest Pink Patrol units.
            </p>
          </div>
        )}

        {/* Tactical Quick Safety Tools Dock */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 relative z-10">
          {/* Silent SOS */}
          <button
            onClick={() => triggerSOS('SILENT_ALERT', { silent: true })}
            className="p-3 rounded-xl bg-obsidian-950/80 hover:bg-obsidian-850 border border-white/[0.08] hover:border-amber-500/50 text-left transition-all group shadow-tactile"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">Silent SOS</span>
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Covert alert screen.</p>
          </button>

          {/* Deterrent Siren */}
          <button
            onClick={toggleSiren}
            className={`p-3 rounded-xl border text-left transition-all shadow-tactile ${
              isSirenPlaying
                ? 'bg-rose-600/30 border-rose-500 text-white animate-pulse'
                : 'bg-obsidian-950/80 hover:bg-obsidian-850 border-white/[0.08] hover:border-rose-500/50 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{isSirenPlaying ? 'Mute Siren' : 'Loud Siren'}</span>
              {isSirenPlaying ? (
                <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Acoustic deterrence.</p>
          </button>

          {/* Police Whistle */}
          <button
            onClick={playWhistle}
            className="p-3 rounded-xl bg-obsidian-950/80 hover:bg-obsidian-850 border border-white/[0.08] hover:border-blue-500/50 text-left transition-all group shadow-tactile"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300">Whistle</span>
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">2.8kHz alarm burst.</p>
          </button>

          {/* Optical Strobe Flash */}
          <button
            onClick={toggleStrobe}
            className={`p-3 rounded-xl border text-left transition-all shadow-tactile ${
              isStrobeActive
                ? 'bg-yellow-500/30 border-yellow-400 text-white animate-pulse'
                : 'bg-obsidian-950/80 hover:bg-obsidian-850 border-white/[0.08] hover:border-yellow-500/50 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{isStrobeActive ? 'Stop Strobe' : 'Strobe'}</span>
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">10Hz disorientation.</p>
          </button>

          {/* Safe Walk Companion */}
          <button
            onClick={() => (isSafeWalkActive ? stopSafeWalk() : startSafeWalk(15))}
            className={`p-3 rounded-xl border text-left transition-all shadow-tactile ${
              isSafeWalkActive
                ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                : 'bg-obsidian-950/80 hover:bg-obsidian-850 border-white/[0.08] hover:border-teal-500/50 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{isSafeWalkActive ? 'Stop SafeWalk' : 'Safe Walk'}</span>
              <Clock className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              {isSafeWalkActive ? `${safeWalkETA}m left` : 'Timed auto check-in.'}
            </p>
          </button>

          {/* Fake Call Disguise */}
          <button
            onClick={() => triggerFakeCall('Mom (Urgent)')}
            className="p-3 rounded-xl bg-obsidian-950/80 hover:bg-obsidian-850 border border-white/[0.08] hover:border-teal-500/50 text-left transition-all group shadow-tactile"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 group-hover:text-teal-300">Escape Call</span>
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Disguise ringtone.</p>
          </button>
        </div>
      </div>

      {/* Geolocation & Presets Status Card */}
      <div className="p-5 rounded-2xl bg-obsidian-900/90 border border-white/[0.08] shadow-tactile space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">Browser Geolocation Fix</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-obsidian-950 text-teal-300 border border-teal-500/30">
                  {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md font-sans">
                {userLocation.address || 'Active coordinates locked via browser GPS'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              className="p-2 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 text-slate-300 hover:text-white border border-white/[0.08] text-xs flex items-center gap-1.5 transition-all shadow-tactile"
              title="Refresh GPS from Browser"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingGps ? 'animate-spin text-teal-400' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowLocationPresets(!showLocationPresets)}
              className="px-3 py-2 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 text-teal-300 border border-teal-500/30 hover:border-teal-400 text-xs font-semibold flex items-center gap-1.5 shadow-tactile transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Simulate City</span>
            </button>
          </div>
        </div>

        {/* Location presets dropdown */}
        {showLocationPresets && (
          <div className="pt-3 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {CITY_PRESETS.map((city, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetSelect(city)}
                className="p-2.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 text-left border border-white/[0.08] hover:border-teal-500/40 transition-all text-xs shadow-tactile"
              >
                <div className="font-semibold text-slate-200">{city.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">{city.address}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
