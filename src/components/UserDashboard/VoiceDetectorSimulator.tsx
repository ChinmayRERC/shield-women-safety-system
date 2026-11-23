import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ShieldAlert, Sparkles, Radio } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const VoiceDetectorSimulator: React.FC = () => {
  const { triggerSOS, addSimLog, userProfile } = useSafety();
  const [isListening, setIsListening] = useState(true);
  const [ambientDb, setAmbientDb] = useState(42);
  const [detectedPhrase, setDetectedPhrase] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [isLiveRecognitionActive, setIsLiveRecognitionActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Periodic ambient sound fluctuation simulation
  useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => {
      setAmbientDb((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(35, Math.min(65, prev + delta));
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isListening]);

  // Live Web Speech Recognition setup
  const startLiveSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please use the simulated trigger buttons.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsLiveRecognitionActive(true);
        addSimLog({
          type: 'AI',
          title: 'Live Microphone Recognition Started',
          detail: 'Web Speech API listening. Say "HELP", "SHIELD", or your safeword.',
        });
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);

        const lower = transcript.toLowerCase();
        const safeWordLower = (userProfile.safeWord || 'lavender').toLowerCase();

        if (
          lower.includes('help') ||
          lower.includes('shield') ||
          lower.includes('emergency') ||
          lower.includes('danger') ||
          lower.includes('save me') ||
          lower.includes(safeWordLower)
        ) {
          setDetectedPhrase(`LIVE VOICE TRIGGER: "${transcript.trim()}"`);
          addSimLog({
            type: 'AI',
            title: `Voice Distress Trigger Matched: "${transcript.trim()}"`,
            detail: 'Natural language speech model matched high-risk distress acoustic signature.',
          });
          recognition.stop();
          setIsLiveRecognitionActive(false);
          triggerSOS('VOICE_TRIGGER');
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        if (e.error !== 'no-speech') {
          setIsLiveRecognitionActive(false);
        }
      };

      recognition.onend = () => {
        setIsLiveRecognitionActive(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      setIsLiveRecognitionActive(false);
    }
  };

  const stopLiveSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsLiveRecognitionActive(false);
  };

  const handleSimulateScream = () => {
    setAmbientDb(94);
    setDetectedPhrase('HIGH ACOUSTIC DISTRESS (SCREAM PATTERN)');
    addSimLog({
      type: 'AI',
      title: 'Acoustic Threat Signature Detected (94 dB)',
      detail: 'Audio analyzer matched high-pitch vocal distress waveform >88 dB threshold.',
    });
    setTimeout(() => {
      triggerSOS('VOICE_TRIGGER');
    }, 600);
  };

  const handleSimulateKeyphrase = () => {
    setDetectedPhrase('"HELP SHIELD" [Confidence 98.4%]');
    addSimLog({
      type: 'AI',
      title: 'SafeWord / Keyphrase Recognized',
      detail: 'NLP speech recognizer matched distress trigger phrase "HELP SHIELD".',
    });
    setTimeout(() => {
      triggerSOS('VOICE_TRIGGER');
    }, 600);
  };

  return (
    <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4 text-slate-500" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Acoustic Distress & SafeWord Engine
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              {isLiveRecognitionActive
                ? '🔴 Live browser microphone active: Speak aloud now'
                : isListening
                ? 'Passive background acoustic monitoring active'
                : 'Microphone listener paused'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Mic Speech API Toggle */}
          <button
            onClick={() => {
              if (isLiveRecognitionActive) {
                stopLiveSpeechRecognition();
              } else {
                startLiveSpeechRecognition();
              }
            }}
            className={`px-3 py-1 rounded-md text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
              isLiveRecognitionActive
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-glow-crimson'
                : 'bg-obsidian-950 text-teal-300 border-teal-500/30 hover:border-teal-400'
            }`}
            title="Use your real computer/phone microphone to test saying 'Help' or 'Shield'"
          >
            <Radio className="w-3 h-3" />
            <span>{isLiveRecognitionActive ? 'MIC ACTIVE' : 'LIVE SPEECH API'}</span>
          </button>
        </div>
      </div>

      {/* Visual Audio Waveform Equalizer */}
      <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-end gap-1.5 h-8 w-1/2">
          {[40, 65, 30, 80, 50, 90, 70, 45, 60, 35, 75, 55].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-300 ${
                ambientDb > 80
                  ? 'bg-rose-500'
                  : ambientDb > 60
                  ? 'bg-amber-400'
                  : 'bg-teal-400'
              }`}
              style={{
                height: isListening ? `${(h * (ambientDb / 50)) % 100}%` : '15%',
              }}
            />
          ))}
        </div>

        <div className="text-right">
          <div className="text-lg font-mono font-black text-white">
            {isListening ? `${ambientDb} dB` : '-- dB'}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            {ambientDb > 85 ? '🚨 Scream Trigger' : ambientDb > 65 ? 'Elevated Sound' : 'Ambient Safe'}
          </div>
        </div>
      </div>

      {/* Real-time live transcript if mic active */}
      {isLiveRecognitionActive && (
        <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>
            Live Mic Transcript: <strong className="text-white font-mono">{liveTranscript || 'Listening... say "Help" or "Shield"'}</strong>
          </span>
        </div>
      )}

      {detectedPhrase && (
        <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs flex items-center gap-2 animate-fade">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Matched: <strong>{detectedPhrase}</strong></span>
        </div>
      )}

      {/* Acoustic trigger action buttons */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={handleSimulateScream}
          className="p-2.5 rounded-lg bg-obsidian-950 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:border-rose-500/60 font-bold transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <span>&gt; SIMULATE SCREAM</span>
            <span className="text-[10px] font-mono">92 dB</span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Sudden acoustic spike</span>
        </button>

        <button
          onClick={handleSimulateKeyphrase}
          className="p-2.5 rounded-lg bg-obsidian-950 hover:bg-teal-950/40 border border-teal-500/30 text-teal-300 hover:border-teal-500/60 font-bold transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <span>&gt; SAY "HELP SHIELD"</span>
            <span className="text-[10px] font-mono">SAFEWORD</span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Discreet vocal pattern</span>
        </button>
      </div>
    </div>
  );
};
