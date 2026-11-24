import React from 'react';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import { Navbar } from './components/Navbar';
import { SimulationBanner } from './components/SimulationBanner';
import { LandingPage } from './components/LandingPage';
import { UserSafetyDashboard } from './components/UserDashboard/UserSafetyDashboard';
import { IncidentMap } from './components/Map/IncidentMap';
import { AIRiskAnalyzer } from './components/AIRiskLab/AIRiskAnalyzer';
import { WearableSimulator } from './components/IoTSimulator/WearableSimulator';
import { IncidentCommand } from './components/AdminDashboard/IncidentCommand';
import { IncidentHistory } from './components/History/IncidentHistory';
import { JudgePitchView } from './components/Pitch/JudgePitchView';
import { QuickStartGuide } from './components/QuickStartGuide';
import { HardwareBridge } from './components/HardwareBridge';
import {
  Shield,
  AlertOctagon,
  MapPin,
  Cpu,
  Radio,
  Activity,
  History,
  Heart,
  Github,
  Award,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, activeIncident, triggerSOS } = useSafety();

  const mobileNavItems = [
    { id: 'user', label: 'Safety', icon: AlertOctagon },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'ai-lab', label: 'Risk', icon: Cpu },
    { id: 'iot', label: 'Sensors', icon: Radio },
    { id: 'admin', label: 'Desk', icon: Activity },
    { id: 'pitch', label: 'About', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-teal-400 selection:text-navy-950">
      {/* Top Hackathon Simulation Notice */}
      <SimulationBanner />

      {/* Main Navbar */}
      <Navbar />

      {/* Plain-English guide and ESP8266 link (guide is a modal, bridge is invisible) */}
      <QuickStartGuide />
      <HardwareBridge />

      {/* Active Tab Router */}
      <main id="main-content" className="flex-1 pt-6 pb-20 lg:pb-6">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'user' && <UserSafetyDashboard />}
        {activeTab === 'map' && <IncidentMap />}
        {activeTab === 'ai-lab' && <AIRiskAnalyzer />}
        {activeTab === 'iot' && <WearableSimulator />}
        {activeTab === 'admin' && <IncidentCommand />}
        {activeTab === 'history' && <IncidentHistory />}
        {activeTab === 'pitch' && <JudgePitchView />}
      </main>

      {/* Mobile Bottom Fixed Nav Bar (PWA Experience) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-navy-950/95 border-t border-navy-800 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="border-t border-navy-800/80 bg-navy-900/60 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-wider">SHIELD Emergency Response System</span>
            <span className="text-slate-600">|</span>
            <span className="text-teal-400 font-mono">Innovation Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              State Innovation Track
            </span>
            <span>React + TypeScript + Vite + Tailwind + Leaflet</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-semibold">100% Offline Simulation Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <SafetyProvider>
      <AppContent />
    </SafetyProvider>
  );
}

export default App;
