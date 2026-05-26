import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { ScoreManager } from '../../src/systems/ScoreManager.js';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('ScoreManager - Property-Based Tests', () => {
    // P-18: Score Non-Negative
    it('P-18: score is always >= 0 after any sequence of operations', () => {
        fc.assert(
            fc.property(
                fc.array(fc.oneof(fc.constant('increment'), fc.constant('reset')), {
                    minLength: 0,
                    maxLength: 100,
                }),
                (operations) => {
                    localStorageMock.clear();
                    const sm = new ScoreManager();
                    for (const op of operations) {
                        if (op === 'increment') sm.increment();
                        else sm.reset();
                    }
                    expect(sm.getCurrentScore()).toBeGreaterThanOrEqual(0);
                },
            ),
        );
    });

    // P-19: High Score Monotonicity
    it('P-19: high score never decreases across multiple games', () => {
        fc.assert(
            fc.property(
                fc.array(fc.nat({ max: 50 }), { minLength: 1, maxLength: 20 }),
                (gameLengths) => {
                    localStorageMock.clear();
                    let prevHighScore = 0;

                    for (const length of gameLengths) {
                        const sm = new ScoreManager();
                        for (let i = 0; i < length; i++) {
                            sm.increment();
                        }
                        sm.saveHighScore();
                        const currentHigh = sm.getHighScore();
                        expect(currentHigh).toBeGreaterThanOrEqual(prevHighScore);
                        prevHighScore = currentHigh;
                    }
                },
            ),
        );
    });

    // P-20: Score Increment Idempotence Prevention
    it('P-20: incrementing N times yields exactly N', () => {
        fc.assert(
            fc.property(fc.nat({ max: 100 }), (n) => {
                localStorageMock.clear();
                const sm = new ScoreManager();
                for (let i = 0; i < n; i++) {
                    sm.increment();
                }
                expect(sm.getCurrentScore()).toBe(n);
            }),
        );
    });
});
