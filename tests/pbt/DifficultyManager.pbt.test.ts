import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { DifficultyManager } from '../../src/systems/DifficultyManager.js';
import { CONFIG } from '../../src/types/config.js';
import { scoreArb } from './generators.js';

describe('DifficultyManager - Property-Based Tests', () => {
    // P-10: Speed Monotonicity
    it('P-10: speed is monotonically non-decreasing with score', () => {
        fc.assert(
            fc.property(scoreArb, scoreArb, (s1, s2) => {
                const [low, high] = s1 < s2 ? [s1, s2] : [s2, s1];
                expect(DifficultyManager.getSpeed(low)).toBeLessThanOrEqual(
                    DifficultyManager.getSpeed(high),
                );
            }),
        );
    });

    // P-11: Speed Cap
    it('P-11: speed never exceeds MAX_SPEED', () => {
        fc.assert(
            fc.property(scoreArb, (score) => {
                expect(DifficultyManager.getSpeed(score)).toBeLessThanOrEqual(CONFIG.MAX_SPEED);
            }),
        );
    });

    // P-12: Gap Monotonicity
    it('P-12: gap size is monotonically non-increasing with score', () => {
        fc.assert(
            fc.property(scoreArb, scoreArb, (s1, s2) => {
                const [low, high] = s1 < s2 ? [s1, s2] : [s2, s1];
                expect(DifficultyManager.getGapSize(low)).toBeGreaterThanOrEqual(
                    DifficultyManager.getGapSize(high),
                );
            }),
        );
    });

    // P-13: Gap Floor
    it('P-13: gap size never goes below MIN_GAP', () => {
        fc.assert(
            fc.property(scoreArb, (score) => {
                expect(DifficultyManager.getGapSize(score)).toBeGreaterThanOrEqual(CONFIG.MIN_GAP);
            }),
        );
    });

    // P-14: Difficulty Formula Round-Trip
    it('P-14: given a speed in range, can derive the score that produces it', () => {
        fc.assert(
            fc.property(
                fc.float({ min: CONFIG.BASE_SPEED, max: CONFIG.MAX_SPEED, noNaN: true }),
                (targetSpeed) => {
                    // Derive score from speed formula: score = (speed - BASE_SPEED) / SPEED_INCREMENT
                    const derivedScore = (targetSpeed - CONFIG.BASE_SPEED) / CONFIG.SPEED_INCREMENT;
                    if (derivedScore >= 0 && targetSpeed <= CONFIG.MAX_SPEED) {
                        const actualSpeed = DifficultyManager.getSpeed(derivedScore);
                        expect(actualSpeed).toBeCloseTo(targetSpeed, 5);
                    }
                },
            ),
        );
    });
});
