import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { CONFIG } from '../../src/types/config.js';
import { windowSizeArb } from './generators.js';

/** Calculate scale factor (same logic as Game.handleResize) */
function getScaleFactor(windowWidth: number, windowHeight: number): number {
    return Math.min(windowWidth / CONFIG.CANVAS_WIDTH, windowHeight / CONFIG.CANVAS_HEIGHT);
}

/** Convert game coordinate to screen coordinate */
function toScreen(gameCoord: number, scale: number): number {
    return gameCoord * scale;
}

/** Convert screen coordinate back to game coordinate */
function toGame(screenCoord: number, scale: number): number {
    return screenCoord / scale;
}

describe('Scaling - Property-Based Tests', () => {
    // P-21: Scale Factor Preserves Aspect Ratio
    it('P-21: scale factor is uniform (same for x and y)', () => {
        fc.assert(
            fc.property(windowSizeArb, ({ width, height }) => {
                const scale = getScaleFactor(width, height);
                // The scale is a single value applied to both axes
                // Verify it fits within the window
                const scaledWidth = CONFIG.CANVAS_WIDTH * scale;
                const scaledHeight = CONFIG.CANVAS_HEIGHT * scale;
                expect(scaledWidth).toBeLessThanOrEqual(width + 0.01);
                expect(scaledHeight).toBeLessThanOrEqual(height + 0.01);
                // At least one dimension should be at the window boundary
                const atWidth = Math.abs(scaledWidth - width) < 0.01;
                const atHeight = Math.abs(scaledHeight - height) < 0.01;
                expect(atWidth || atHeight).toBe(true);
            }),
        );
    });

    // P-22: Input Coordinate Round-Trip
    it('P-22: toGame(toScreen(point)) == point within tolerance', () => {
        fc.assert(
            fc.property(
                windowSizeArb,
                fc.float({ min: 0, max: CONFIG.CANVAS_WIDTH, noNaN: true }),
                ({ width, height }, gameX) => {
                    const scale = getScaleFactor(width, height);
                    if (scale === 0) return; // Skip degenerate case
                    const screenX = toScreen(gameX, scale);
                    const roundTrip = toGame(screenX, scale);
                    expect(roundTrip).toBeCloseTo(gameX, 5);
                },
            ),
        );
    });
});
