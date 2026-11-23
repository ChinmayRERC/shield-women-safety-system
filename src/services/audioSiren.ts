// Web Audio API synthesizer for offline sound effects (Loud Siren, Countdown Beeper, Pulse)

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isSirenPlaying = false;
  private sirenInterval: any = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a quick countdown pip (e.g. 5, 4, 3, 2, 1)
  playCountdownPip(frequency: number = 880, durationMs: number = 100) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn('Audio playback not permitted or unavailable:', e);
    }
  }

  // Play success or cancelled chime
  playSuccessTone() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Start continuous loud police/emergency wail siren (deterrent alarm)
  startEmergencySiren() {
    if (this.isSirenPlaying) return;
    try {
      const ctx = this.getContext();
      this.isSirenPlaying = true;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      gain.gain.setValueAtTime(0.25, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      this.sirenOsc1 = osc1;
      this.sirenOsc2 = osc2;
      this.sirenGain = gain;

      osc1.start();
      osc2.start();

      let rising = true;
      let currentFreq = 650;
      this.sirenInterval = setInterval(() => {
        if (!this.isSirenPlaying || !this.sirenOsc1 || !this.sirenOsc2) return;
        const now = ctx.currentTime;
        if (rising) {
          currentFreq += 150;
          if (currentFreq >= 1200) rising = false;
        } else {
          currentFreq -= 150;
          if (currentFreq <= 500) rising = true;
        }
        this.sirenOsc1.frequency.setValueAtTime(currentFreq, now);
        this.sirenOsc2.frequency.setValueAtTime(currentFreq * 1.05, now);
      }, 120);

    } catch (e) {
      console.warn('Emergency siren failed to start:', e);
      this.isSirenPlaying = false;
    }
  }

  // Stop emergency siren
  stopEmergencySiren() {
    this.isSirenPlaying = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    try {
      if (this.sirenOsc1) {
        this.sirenOsc1.stop();
        this.sirenOsc1.disconnect();
        this.sirenOsc1 = null;
      }
      if (this.sirenOsc2) {
        this.sirenOsc2.stop();
        this.sirenOsc2.disconnect();
        this.sirenOsc2 = null;
      }
      if (this.sirenGain) {
        this.sirenGain.disconnect();
        this.sirenGain = null;
      }
    } catch (e) {
      console.warn('Error stopping siren:', e);
    }
  }

  // Play an authentic double-tone police/referee whistle burst (piercing acoustic deterrent)
  playPoliceWhistle(bursts: number = 2) {
    try {
      const ctx = this.getContext();
      let delay = 0;

      for (let b = 0; b < bursts; b++) {
        const startTime = ctx.currentTime + delay;
        const duration = 0.35;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const flutter = ctx.createOscillator();
        const flutterGain = ctx.createGain();
        const mainGain = ctx.createGain();

        // Authentic dual whistle frequencies
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(2700, startTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2950, startTime);

        // Pea-whistle flutter vibration at 32Hz
        flutter.type = 'sine';
        flutter.frequency.setValueAtTime(32, startTime);
        flutterGain.gain.setValueAtTime(150, startTime);

        flutter.connect(osc1.frequency);
        flutter.connect(osc2.frequency);

        mainGain.gain.setValueAtTime(0, startTime);
        mainGain.gain.linearRampToValueAtTime(0.35, startTime + 0.05);
        mainGain.gain.setValueAtTime(0.35, startTime + duration - 0.05);
        mainGain.gain.linearRampToValueAtTime(0.001, startTime + duration);

        osc1.connect(mainGain);
        osc2.connect(mainGain);
        mainGain.connect(ctx.destination);

        flutter.start(startTime);
        osc1.start(startTime);
        osc2.start(startTime);

        flutter.stop(startTime + duration);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);

        delay += 0.45;
      }
    } catch (e) {
      console.warn('Whistle audio failed:', e);
    }
  }

  getIsSirenPlaying(): boolean {
    return this.isSirenPlaying;
  }
}

export const soundService = new SoundSynthesizer();
