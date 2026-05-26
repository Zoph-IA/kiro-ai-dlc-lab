import { CONFIG } from '../types/config.js';

/**
 * Tracks current score and persists high score to localStorage.
 */
export class ScoreManager {
    private currentScore: number;
    private highScore: number;

    constructor() {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
    }

    /** Increment current score by 1 (BR-07) */
    increment(): void {
        this.currentScore++;
    }

    /** Get current game score */
    getCurrentScore(): number {
        return this.currentScore;
    }

    /** Get persisted high score */
    getHighScore(): number {
        return this.highScore;
    }

    /** Check if current score is a new high score */
    isNewHighScore(): boolean {
        return this.currentScore > this.highScore;
    }

    /** Save high score to localStorage if current exceeds it (BR-08) */
    saveHighScore(): void {
        if (this.isNewHighScore()) {
            this.highScore = this.currentScore;
            this.persistHighScore();
        }
    }

    /** Reset current score to 0 (BR-14) */
    reset(): void {
        this.currentScore = 0;
    }

    /** Load high score from localStorage with validation */
    private loadHighScore(): number {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_HIGH_SCORE);
            if (stored === null) {
                return 0;
            }
            const parsed = parseInt(stored, 10);
            // Validate: must be non-negative integer (NFR-SEC-03)
            if (isNaN(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
                return 0;
            }
            return parsed;
        } catch {
            // localStorage unavailable — graceful degradation (NFR-SEC-04)
            return 0;
        }
    }

    /** Persist high score to localStorage */
    private persistHighScore(): void {
        try {
            localStorage.setItem(CONFIG.STORAGE_HIGH_SCORE, String(this.highScore));
        } catch {
            // localStorage unavailable — silently fail (NFR-SEC-04)
        }
    }
}
