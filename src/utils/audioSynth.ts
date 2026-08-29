// ==========================================
// PROCEDURAL WEB AUDIO SYNTHESIZER & AMBIENT GENERATOR
// Zero external audio files required! 100% Client-side Web Audio API
// ==========================================

class AudioSynthService {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientType: string | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lifeos_sound_muted');
        this.isMuted = saved === 'true';
      } catch (e) {}
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lifeos_sound_muted', String(this.isMuted));
      } catch (e) {}
    }
    if (!this.isMuted) {
      this.playClick(0.12);
    } else {
      this.stopAmbient();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lifeos_sound_muted', String(muted));
      } catch (e) {}
    }
    if (muted) this.stopAmbient();
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (this.isMuted) return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. UI Micro-interactions
  public playClick(volume = 0.08) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }

  public playSuccess(volume = 0.12) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(volume, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.3);
      });
    } catch (e) {}
  }

  public playLevelUp(volume = 0.15) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(volume, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.4);
      });
    } catch (e) {}
  }

  // 2. Procedural Ambient Sounds for Zen Mode (Rain, White Noise, Campfire)
  public startAmbient(type: 'rain' | 'whitenoise' | 'campfire' | 'cafe', volume = 0.15) {
    if (this.isMuted) return;
    this.stopAmbient();
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.currentAmbientType = type;
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink / Brown / White noise synthesis
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink noise for soothing rain
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        } else if (type === 'campfire') {
          // Brown noise with crackle
          b0 = (b0 + (0.02 * white)) / 1.02;
          const crackle = Math.random() > 0.998 ? (Math.random() - 0.5) * 1.5 : 0;
          output[i] = b0 * 3.5 + crackle;
        } else {
          // Pure soft white noise
          output[i] = white * 0.2;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for ambient shaping
      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);
      } else if (type === 'campfire') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1.2, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      this.ambientSource = whiteNoise;
      this.ambientGain = gain;
    } catch (e) {
      console.error('Error starting ambient sound:', e);
    }
  }

  public setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime + 0.1);
    }
  }

  public stopAmbient() {
    if (this.ambientSource) {
      try {
        if (this.ambientGain && this.ctx) {
          this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            try { (this.ambientSource as any)?.stop(); } catch (e) {}
            this.ambientSource = null;
            this.ambientGain = null;
            this.currentAmbientType = null;
          }, 600);
        } else {
          try { (this.ambientSource as any)?.stop(); } catch (e) {}
          this.ambientSource = null;
          this.ambientGain = null;
          this.currentAmbientType = null;
        }
      } catch (e) {
        this.ambientSource = null;
        this.ambientGain = null;
        this.currentAmbientType = null;
      }
    }
  }

  public getActiveAmbient(): string | null {
    return this.currentAmbientType;
  }
}

export const audioSynth = new AudioSynthService();
