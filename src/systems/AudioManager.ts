import { CONFIG } from '../types/config.js';

/**
 * Manages futuristic synthesized sound effects using Web Audio API.
 * Falls back gracefully if Web Audio is unavailable.
 */
export class AudioManager {
    private soundEnabled: boolean;
    private audioCtx: AudioContext | null;

    constructor() {
        this.soundEnabled = this.loadSoundPreference();
        this.audioCtx = null;
    }

    /** Initialize audio context (must be called after user interaction) */
    private ensureContext(): AudioContext | null {
        if (!this.audioCtx) {
            try {
                this.audioCtx = new AudioContext();
            } catch {
                return null;
            }
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => { });
        }
        return this.audioCtx;
    }

    /** Load audio assets (no-op for synthesized sounds) */
    async loadAssets(): Promise<void> {
        // Synthesized sounds don't need preloading
    }

    /** Play futuristic jump sound — short rising synth blip */
    playJump(): void {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    /** Play futuristic game over sound — descending glitch buzz */
    playGameOver(): void {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Low buzz
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(300, now);
        osc1.frequency.exponentialRampToValueAtTime(80, now + 0.4);
        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.linearRampToValueAtTime(0, now + 0.5);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.5);

        // Noise burst
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const noise = ctx.createBufferSource();
        const noiseGain = ctx.createGain();
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now + 0.05);
        noise.stop(now + 0.25);

        // High glitch beep
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800, now);
        osc2.frequency.setValueAtTime(200, now + 0.1);
        osc2.frequency.setValueAtTime(600, now + 0.15);
        osc2.frequency.setValueAtTime(100, now + 0.3);
        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.linearRampToValueAtTime(0, now + 0.4);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.4);
    }

    /** Toggle sound on/off (BR-13) */
    toggleSound(): boolean {
        this.soundEnabled = !this.soundEnabled;
        this.persistSoundPreference();
        return this.soundEnabled;
    }

    /** Check if sound is currently enabled */
    isSoundEnabled(): boolean {
        return this.soundEnabled;
    }

    /** Load sound preference from localStorage with validation */
    private loadSoundPreference(): boolean {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_SOUND_ENABLED);
            if (stored === null) return true;
            if (stored === 'true') return true;
            if (stored === 'false') return false;
            return true;
        } catch {
            return true;
        }
    }

    /** Persist sound preference to localStorage */
    private persistSoundPreference(): void {
        try {
            localStorage.setItem(CONFIG.STORAGE_SOUND_ENABLED, String(this.soundEnabled));
        } catch {
            // Silently fail
        }
    }
}
