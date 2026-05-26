import * as fc from 'fast-check';
import { BoundingBox } from '../../src/types/index.js';
import { CONFIG } from '../../src/types/config.js';

/** Generate a valid BoundingBox with positive dimensions */
export const boundingBoxArb: fc.Arbitrary<BoundingBox> = fc.record({
    x: fc.float({ min: -100, max: CONFIG.CANVAS_WIDTH + 100, noNaN: true }),
    y: fc.float({ min: -100, max: CONFIG.CANVAS_HEIGHT + 100, noNaN: true }),
    width: fc.float({ min: 1, max: 200, noNaN: true }),
    height: fc.float({ min: 1, max: 200, noNaN: true }),
});

/** Generate a valid score (non-negative integer) */
export const scoreArb: fc.Arbitrary<number> = fc.nat({ max: 200 });

/** Generate a valid velocity */
export const velocityArb: fc.Arbitrary<number> = fc.float({
    min: CONFIG.TERMINAL_VELOCITY_UP - 5,
    max: CONFIG.TERMINAL_VELOCITY_DOWN + 5,
    noNaN: true,
});

/** Generate a valid player Y position */
export const playerYArb: fc.Arbitrary<number> = fc.float({
    min: 0,
    max: CONFIG.CANVAS_HEIGHT,
    noNaN: true,
});

/** Generate a valid gap Y position for a given gap size */
export function gapYArb(gapSize: number): fc.Arbitrary<number> {
    const min = CONFIG.MIN_GAP_MARGIN;
    const max = CONFIG.CANVAS_HEIGHT - gapSize - CONFIG.MIN_GAP_MARGIN;
    if (max <= min) return fc.constant(min);
    return fc.float({ min, max, noNaN: true });
}

/** Generate a valid gap size */
export const gapSizeArb: fc.Arbitrary<number> = fc.float({
    min: CONFIG.MIN_GAP,
    max: CONFIG.BASE_GAP,
    noNaN: true,
});

/** Generate a valid window size for scaling tests */
export const windowSizeArb: fc.Arbitrary<{ width: number; height: number }> = fc.record({
    width: fc.integer({ min: 100, max: 3840 }),
    height: fc.integer({ min: 100, max: 2160 }),
});

/** Generate two non-overlapping bounding boxes */
export const separatedBoxesArb: fc.Arbitrary<[BoundingBox, BoundingBox]> = fc
    .record({
        x1: fc.float({ min: 0, max: 200, noNaN: true }),
        y1: fc.float({ min: 0, max: 200, noNaN: true }),
        w1: fc.float({ min: 1, max: 50, noNaN: true }),
        h1: fc.float({ min: 1, max: 50, noNaN: true }),
        gap: fc.float({ min: 1, max: 100, noNaN: true }),
    })
    .map(({ x1, y1, w1, h1, gap }) => [
        { x: x1, y: y1, width: w1, height: h1 },
        { x: x1 + w1 + gap, y: y1, width: w1, height: h1 },
    ]);
