import React from 'react';
import {
  X,
  ShieldCheck,
  AlertOctagon,
  MapPin,
  Brain,
  Radio,
  ClipboardList,
  Home,
  Usb,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

const steps = [
  {
    n: '1',
    title: 'In danger? Press the red SOS button',
    body: 'A 5-second timer starts. If it was a mistake, tap Cancel (the code is 4321). If not, your location and a simulated alert are sent automatically.',
  },
  {
    n: '2',
    title: 'Walking somewhere? Start Safe Walk',
    body: 'Tell the app how long you expect to take. If you don’t confirm you arrived safely, an alert is raised for you.',
  },
  {
    n: '3',
    title: 'Need to hide it? Open Silent Mode or Fake Call',
    body: 'Silent Mode turns the screen into a working calculator. Fake Call shows an incoming call from “Mom” with an escape script. Both can quietly raise an SOS.',
  },
];

const screens = [
  { id: 'landing', label: 'Home', icon: Home, text: 'A simple overview and the buttons to try each feature.' },
  { id: 'user', label: 'Safety', icon: AlertOctagon, text: 'SOS button, safe walk, emergency contacts, and disguise tools.' },
  { id: 'map', label: 'Map', icon: MapPin, text: 'Shows your location, nearby safe places, and danger zones.' },
  { id: 'ai-lab', label: 'Risk score', icon: Brain, text: 'Move the sliders to see how a risk score out of 100 is calculated.' },
  { id: 'iot', label: 'Sensors', icon: Radio, text: 'Simulated heart rate and fall/shake tests — plus ESP8266 setup.' },
  { id: 'admin', label: 'Help desk', icon: ClipboardList, text: 'The operator view: incoming alerts and which helper is sent.' },
];

export const QuickStartGuide: React.FC = () => {
  const { isGuideOpen, setGuideOpen, setActiveTab } = useSafety();

  if (!isGuideOpen) return null;

  const go = (id: string) => {
    setActiveTab(id);
    setGuideOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={() => setGuideOpen(false)}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How to use SHIELD"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-teal-500/30 bg-obsidian-900 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-obsidian-900/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-teal-400/15 p-2 text-teal-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Start here — how SHIELD works</h2>
              <p className="mt-0.5 text-sm text-slate-400">
                A two-minute plain-English tour. No technical terms needed.
              </p>
            </div>
          </div>
          <button
            onClick={() => setGuideOpen(false)}
            aria-label="Close guide"
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-7 px-6 py-6">
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-teal-300">
              The three things you need to know
            </h3>
            <div className="space-y-2.5">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="flex gap-3 rounded-xl border border-white/10 bg-obsidian-950/70 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-400 text-sm font-black text-obsidian-950">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-teal-300">
              What’s on each screen
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {screens.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => go(s.id)}
                    className="group flex items-start gap-3 rounded-xl border border-white/10 bg-obsidian-950/70 p-3 text-left transition hover:border-teal-500/40 hover:bg-teal-500/5"
                  >
                    <span className="mt-0.5 rounded-lg bg-white/5 p-2 text-teal-300 group-hover:bg-teal-400/15">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-white">{s.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{s.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-teal-500/30 bg-teal-500/[0.06] p-4">
            <div className="flex items-start gap-3">
              <Usb className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />
              <div>
                <h3 className="text-sm font-bold text-white">Using real hardware?</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">
                  You can wire an ESP8266 with a buzzer, LED, switch and battery. The Sensors screen has
                  the wiring chart and setup steps, and the app can listen for your switch press and drive
                  the buzzer/LED during an alert.
                </p>
                <button
                  onClick={() => go('iot')}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-bold text-obsidian-950 transition hover:bg-teal-300"
                >
                  Open the hardware guide <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>

          <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            This is a demonstration. It never calls real 112/911 lines — alerts, messages and dispatch are
            simulated locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
