import { describe, it, expect } from 'vitest';
import { DifficultyManager } from '../../src/systems/DifficultyManager.js';
import { CONFIG } from '../../src/types/config.js';

describe('DifficultyManager', () => {
    describe('getSpeed', () => {
        it('should return base speed at score 0', () => {
            expect(DifficultyManager.getSpeed(0)).toBe(CONFIG.BASE_SPEED);
        });

        it('should increase speed linearly with score', () => {
            const speed = DifficultyManager.getSpeed(10);
            expect(speed).toBe(CONFIG.BASE_SPEED + CONFIG.SPEED_INCREMENT * 10);
        });

        it('should cap speed at MAX_SPEED', () => {
            const speed = DifficultyManager.getSpeed(1000);
            expect(speed).toBe(CONFIG.MAX_SPEED);
        });

        it('should return MAX_SPEED at the exact cap score', () => {
            const capScore = (CONFIG.MAX_SPEED - CONFIG.BASE_SPEED) / CONFIG.SPEED_INCREMENT;
            expect(DifficultyManager.getSpeed(capScore)).toBe(CONFIG.MAX_SPEED);
        });
    });

    describe('getGapSize', () => {
        it('should return base gap at score 0', () => {
            expect(DifficultyManager.getGapSize(0)).toBe(CONFIG.BASE_GAP);
        });

        it('should decrease gap linearly with score', () => {
            const gap = DifficultyManager.getGapSize(10);
            expect(gap).toBe(CONFIG.BASE_GAP - CONFIG.GAP_REDUCTION * 10);
        });

        it('should floor gap at MIN_GAP', () => {
            const gap = DifficultyManager.getGapSize(1000);
            expect(gap).toBe(CONFIG.MIN_GAP);
        });
    });

    describe('getParams', () => {
        it('should return both speed and gap for a given score', () => {
            const params = DifficultyManager.getParams(5);
            expect(params.speed).toBe(CONFIG.BASE_SPEED + CONFIG.SPEED_INCREMENT * 5);
            expect(params.gapSize).toBe(CONFIG.BASE_GAP - CONFIG.GAP_REDUCTION * 5);
        });
    });
});
