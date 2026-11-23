import React, { useState } from 'react';
import {
  Shield,
  Activity,
  MapPin,
  Cpu,
  Radio,
  History,
  AlertOctagon,
  Menu,
  X,
  Volume2,
  VolumeX,
  EyeOff,
  BellRing,
  Award,
  Navigation,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeIncident,
    isCountingDown,
    countdownSeconds,
    triggerSOS,
    isSirenPlaying,
    toggleSiren,
    isSilentMode,
    toggleSilentMode,
    iotData,
    userLocation,
  } = useSafety();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Mission Overview', icon: Shield },
    { id: 'user', label: 'Safety Terminal', icon: AlertOctagon, highlight: true },
    { id: 'map', label: 'Spatial Map', icon: MapPin },
    { id: 'ai-lab', label: 'XAI Risk Lab', icon: Cpu },
    { id: 'iot', label: 'IoT Telemetry', icon: Radio },
    { id: 'admin', label: 'CAD Console', icon: Activity },
    { id: 'history', label: 'Audit Trail', icon: History },
    { id: 'pitch', label: 'Pitch Benchmark', icon: Award },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-obsidian-950/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Operational Badge */}
          <div
            onClick={() => handleTabClick('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-obsidian-900 border border-teal-500/40 p-1 shadow-tactile group-hover:border-teal-400 transition-colors">
              <Shield className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider text-white font-mono">SHIELD</span>
                <span className="text-[9px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  CAD-OPS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Autonomous Emergency Mesh
              </p>
            </div>
          </div>

          {/* Desktop Precision Segmented Navigation Control */}
          <nav className="hidden lg:flex items-center p-1 rounded-xl bg-obsidian-900/90 border border-white/[0.08] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-obsidian-800 text-teal-300 border border-teal-500/30 shadow-tactile'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Action Tools & Quick SOS */}
          <div className="flex items-center gap-2">
            {/* Live GPS Lock Indicator */}
            <div
              onClick={() => handleTabClick('map')}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/[0.08] text-[11px] font-mono cursor-pointer hover:border-teal-500/40 transition-colors text-slate-300"
              title="GPS Telemetry Locked"
            >
              <Navigation className="w-3 h-3 text-teal-400" />
              <span>{userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}</span>
            </div>

            {/* IoT status indicator */}
            <div
              onClick={() => handleTabClick('iot')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/[0.08] text-[11px] font-mono cursor-pointer hover:border-teal-500/40 transition-colors"
              title={iotData.connected ? 'IoT Smart Wearable Connected' : 'IoT Device Disconnected'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  iotData.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-slate-400">PULSE:</span>
              <span className={iotData.connected ? (iotData.heartRate > 120 ? 'text-rose-400 font-bold' : 'text-teal-300 font-bold') : 'text-slate-500'}>
                {iotData.connected ? `${iotData.heartRate}` : 'OFF'}
              </span>
            </div>

            {/* Siren Toggle */}
            <button
              onClick={toggleSiren}
              className={`p-2 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 ${
                isSirenPlaying
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-glow-crimson'
                  : 'bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 border-white/[0.08] hover:text-white'
              }`}
              title={isSirenPlaying ? 'Mute Siren' : 'Trigger Acoustic Deterrent Siren'}
            >
              {isSirenPlaying ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden 2xl:inline text-[11px]">{isSirenPlaying ? 'SIREN ACTIVE' : 'SIREN'}</span>
            </button>

            {/* Silent Mode Toggle */}
            <button
              onClick={toggleSilentMode}
              className={`p-2 rounded-lg border transition-all text-xs ${
                isSilentMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 border-white/[0.08] hover:text-white'
              }`}
              title="Covert Calculator Disguise"
            >
              <EyeOff className="w-4 h-4 text-slate-400" />
            </button>

            {/* Active Distress Badge or Navbar Emergency Trigger */}
            {activeIncident ? (
              <div
                onClick={() => handleTabClick('user')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 border border-rose-500 text-rose-300 text-xs font-bold animate-pulse cursor-pointer shadow-glow-crimson"
              >
                <BellRing className="w-4 h-4 text-rose-400 animate-bounce" />
                <span className="font-mono">ALERT #{activeIncident.id.replace('INC-', '')}</span>
              </div>
            ) : isCountingDown ? (
              <div
                onClick={() => handleTabClick('user')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-200 text-xs font-bold cursor-pointer font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>ABORT IN {countdownSeconds}s</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  triggerSOS('SOS_BUTTON');
                  setActiveTab('user');
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white text-xs font-black uppercase tracking-wider shadow-tactile border border-rose-400/50 transition-all hover:scale-105 active:scale-95"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>SOS PANIC</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-obsidian-900 text-slate-300 hover:text-white border border-white/[0.08]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-950/98 border-b border-white/[0.08] px-4 pt-2 pb-4 space-y-1 backdrop-blur-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-obsidian-850 text-teal-300 border border-teal-500/30'
                    : 'text-slate-400 hover:bg-obsidian-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
