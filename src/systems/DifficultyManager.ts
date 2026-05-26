import { CONFIG } from '../types/config.js';

/**
 * Calculates difficulty parameters based on current score.
 * Uses linear progression with caps (BR-11).
 */
export class DifficultyManager {
    /** Calculate current wall scroll speed based on score */
    static getSpeed(score: number): number {
        const speed = CONFIG.BASE_SPEED + CONFIG.SPEED_INCREMENT * score;
        return Math.min(speed, CONFIG.MAX_SPEED);
    }

    /** Calculate current gap size based on score */
    static getGapSize(score: number): number {
        const gap = CONFIG.BASE_GAP - CONFIG.GAP_REDUCTION * score;
        return Math.max(gap, CONFIG.MIN_GAP);
    }

    /** Get all difficulty parameters for a given score */
    static getParams(score: number): { speed: number; gapSize: number } {
        return {
            speed: DifficultyManager.getSpeed(score),
            gapSize: DifficultyManager.getGapSize(score),
        };
    }
}
