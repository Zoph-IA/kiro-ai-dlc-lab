import { CONFIG } from '../types/config.js';

/**
 * Manages sound effects and sound toggle state.
 * Persists sound preference to localStorage.
 */
export class AudioManager {
    private soundEnabled: boolean;
    private jumpSound: HTMLAudioElement | null;
    private gameOverSound: HTMLAudioElement | null;

    constructor() {
        this.soundEnabled = this.loadSoundPreference();
        this.jumpSound = null;
        this.gameOverSound = null;
    }

    /** Load audio assets */
    async loadAssets(): Promise<void> {
        try {
            this.jumpSound = new Audio('jump.wav');
            this.gameOverSound = new Audio('game_over.wav');
            // Preload
            this.jumpSound.load();
            this.gameOverSound.load();
        } catch {
            // Audio load failure — graceful degradation (NFR-SEC-04)
            this.jumpSound = null;
            this.gameOverSound = null;
        }
    }

    /** Play jump sound effect */
    playJump(): void {
        if (this.soundEnabled && this.jumpSound) {
            this.jumpSound.currentTime = 0;
            this.jumpSound.play().catch(() => {
                // Silently handle autoplay restrictions
            });
        }
    }

    /** Play game over sound effect */
    playGameOver(): void {
        if (this.soundEnabled && this.gameOverSound) {
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play().catch(() => {
                // Silently handle autoplay restrictions
            });
        }
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
            if (stored === null) {
                return true; // Default: sound on (BR-13)
            }
            // Validate: must be "true" or "false" (NFR-SEC-03)
            if (stored === 'true') return true;
            if (stored === 'false') return false;
            return true; // Invalid value — default to on
        } catch {
            return true; // localStorage unavailable — default to on
        }
    }

    /** Persist sound preference to localStorage */
    private persistSoundPreference(): void {
        try {
            localStorage.setItem(CONFIG.STORAGE_SOUND_ENABLED, String(this.soundEnabled));
        } catch {
            // Silently fail if localStorage unavailable
        }
    }
}
