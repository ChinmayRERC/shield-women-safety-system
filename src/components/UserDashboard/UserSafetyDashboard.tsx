import React, { useState } from 'react';
import { SOSSection } from './SOSSection';
import { VoiceDetectorSimulator } from './VoiceDetectorSimulator';
import { FakeCallSimulator } from './FakeCallSimulator';
import { QuickContacts } from './QuickContacts';
import { CovertDisguise } from './CovertDisguise';
import { StrobeFlashOverlay } from './StrobeFlashOverlay';
import { BlackboxEvidenceRecorder } from './BlackboxEvidenceRecorder';
import { useSafety } from '../../context/SafetyContext';
import { ShieldCheck, User, Heart, KeyRound, AlertTriangle, Edit2, Save } from 'lucide-react';

export const UserSafetyDashboard: React.FC = () => {
  const { userProfile, updateUserProfile } = useSafety();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [form, setForm] = useState(userProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(form);
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* High Intensity Optical Strobe */}
      <StrobeFlashOverlay />

      {/* Covert Calculator Disguise overlay if toggled */}
      <CovertDisguise />

      {/* Fake Call Overlay if triggered */}
      <FakeCallSimulator />

      {/* Main SOS and Tactical Controls */}
      <SOSSection />

      {/* Interactive Sub-Modules: Voice Detection and Guardians */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VoiceDetectorSimulator />
        <QuickContacts />
      </div>

      {/* Blackbox Telemetry Evidence Recorder */}
      <BlackboxEvidenceRecorder />

      {/* Medical Passport & Emergency Profile Badge */}
      <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Emergency Medical & Responder Passport
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Transmitted to authenticated CAD responders and paramedics upon verified distress trigger
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setForm(userProfile);
              setIsEditingProfile(!isEditingProfile);
            }}
            className="text-xs font-mono text-teal-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-obsidian-950 border border-white/[0.08]"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingProfile ? 'CANCEL' : 'EDIT PASSPORT'}</span>
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Blood Group</label>
                <input
                  type="text"
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Cancellation PIN</label>
                <input
                  type="text"
                  maxLength={4}
                  value={form.emergencyPin}
                  onChange={(e) => setForm({ ...form, emergencyPin: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Medical Conditions / Allergies</label>
                <input
                  type="text"
                  value={form.medicalConditions}
                  onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Vocal SafeWord</label>
                <input
                  type="text"
                  value={form.safeWord}
                  onChange={(e) => setForm({ ...form, safeWord: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-teal-accent hover:bg-teal-400 text-obsidian-950 font-mono font-bold text-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE PASSPORT</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-mono">
            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06]">
              <span className="text-[10px] text-slate-500 uppercase block">REGISTERED CITIZEN</span>
              <span className="font-bold text-white mt-1 block truncate font-sans">{userProfile.name}</span>
              <span className="text-[11px] text-teal-300">{userProfile.phone}</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06]">
              <span className="text-[10px] text-slate-500 uppercase block">BLOOD GROUP</span>
              <span className="text-base font-extrabold text-rose-400 mt-1 block">{userProfile.bloodGroup}</span>
              <span className="text-[10px] text-slate-400">Universal Compatible</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06]">
              <span className="text-[10px] text-slate-500 uppercase block">VOCAL SAFEWORD</span>
              <span className="font-bold text-teal-300 mt-1 block">"{userProfile.safeWord}"</span>
              <span className="text-[10px] text-slate-400">Acoustic Keyword Trigger</span>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06]">
              <span className="text-[10px] text-slate-500 uppercase block">ABORT PIN</span>
              <span className="font-bold text-slate-300 mt-1 block">•••• (4321)</span>
              <span className="text-[10px] text-slate-400">Master Cancel Code</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
