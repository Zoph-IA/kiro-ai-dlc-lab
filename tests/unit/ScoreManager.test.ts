import { describe, it, expect, beforeEach, vi } from 'vitest';
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

describe('ScoreManager', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should start with score 0', () => {
            const sm = new ScoreManager();
            expect(sm.getCurrentScore()).toBe(0);
        });

        it('should load high score from localStorage', () => {
            localStorageMock.getItem.mockReturnValueOnce('42');
            const sm = new ScoreManager();
            expect(sm.getHighScore()).toBe(42);
        });

        it('should default to 0 if no stored high score', () => {
            const sm = new ScoreManager();
            expect(sm.getHighScore()).toBe(0);
        });

        it('should default to 0 if stored value is invalid', () => {
            localStorageMock.getItem.mockReturnValueOnce('not-a-number');
            const sm = new ScoreManager();
            expect(sm.getHighScore()).toBe(0);
        });

        it('should default to 0 if stored value is negative', () => {
            localStorageMock.getItem.mockReturnValueOnce('-5');
            const sm = new ScoreManager();
            expect(sm.getHighScore()).toBe(0);
        });
    });

    describe('increment', () => {
        it('should increase score by 1', () => {
            const sm = new ScoreManager();
            sm.increment();
            expect(sm.getCurrentScore()).toBe(1);
        });

        it('should accumulate multiple increments', () => {
            const sm = new ScoreManager();
            sm.increment();
            sm.increment();
            sm.increment();
            expect(sm.getCurrentScore()).toBe(3);
        });
    });

    describe('high score', () => {
        it('should detect new high score', () => {
            const sm = new ScoreManager();
            sm.increment();
            expect(sm.isNewHighScore()).toBe(true);
        });

        it('should not detect new high score when below', () => {
            localStorageMock.getItem.mockReturnValueOnce('10');
            const sm = new ScoreManager();
            sm.increment();
            expect(sm.isNewHighScore()).toBe(false);
        });

        it('should save high score to localStorage', () => {
            const sm = new ScoreManager();
            sm.increment();
            sm.increment();
            sm.saveHighScore();
            expect(localStorageMock.setItem).toHaveBeenCalledWith('flappyKiro_highScore', '2');
        });
    });

    describe('reset', () => {
        it('should reset current score to 0', () => {
            const sm = new ScoreManager();
            sm.increment();
            sm.increment();
            sm.reset();
            expect(sm.getCurrentScore()).toBe(0);
        });

        it('should not reset high score', () => {
            localStorageMock.getItem.mockReturnValueOnce('10');
            const sm = new ScoreManager();
            sm.reset();
            expect(sm.getHighScore()).toBe(10);
        });
    });
});
