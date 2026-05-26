import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Wall } from '../../src/entities/Wall.js';
import { CONFIG } from '../../src/types/config.js';
import { gapSizeArb } from './generators.js';

describe('Wall - Property-Based Tests', () => {
    // P-15: Gap Within Bounds
    it('P-15: generated gap position leaves MIN_GAP_MARGIN from ceiling and ground', () => {
        fc.assert(
            fc.property(gapSizeArb, (gapSize) => {
                const minGapY = CONFIG.MIN_GAP_MARGIN;
                const maxGapY = CONFIG.CANVAS_HEIGHT - gapSize - CONFIG.MIN_GAP_MARGIN;
                if (maxGapY <= minGapY) return; // Skip invalid configs

                // Generate a random gapY within valid bounds
                const gapY = minGapY + Math.random() * (maxGapY - minGapY);
                const wall = new Wall(400, gapY, gapSize);

                expect(wall.gapY).toBeGreaterThanOrEqual(CONFIG.MIN_GAP_MARGIN);
                expect(wall.gapY + wall.gapSize).toBeLessThanOrEqual(
                    CONFIG.CANVAS_HEIGHT - CONFIG.MIN_GAP_MARGIN,
                );
            }),
        );
    });

    // P-16: Wall Rectangles Cover Full Height
    it('P-16: top wall + gap + bottom wall equals canvas height', () => {
        fc.assert(
            fc.property(gapSizeArb, (gapSize) => {
                const gapY = CONFIG.MIN_GAP_MARGIN + 10; // Valid position
                const wall = new Wall(400, gapY, gapSize);

                const topRect = wall.getTopRect();
                const bottomRect = wall.getBottomRect();

                const totalHeight = topRect.height + gapSize + bottomRect.height;
                expect(totalHeight).toBeCloseTo(CONFIG.CANVAS_HEIGHT, 5);
            }),
        );
    });

    // P-17: Wall Spacing Consistency (tested via construction)
    it('P-17: walls created at WALL_SPACING intervals maintain spacing', () => {
        fc.assert(
            fc.property(
                fc.nat({ max: 10 }),
                fc.float({ min: CONFIG.MIN_GAP, max: CONFIG.BASE_GAP, noNaN: true }),
                (wallCount, gapSize) => {
                    const walls: Wall[] = [];
                    for (let i = 0; i <= wallCount; i++) {
                        const x = CONFIG.FIRST_WALL_X + i * CONFIG.WALL_SPACING;
                        walls.push(new Wall(x, 200, gapSize));
                    }

                    for (let i = 1; i < walls.length; i++) {
                        const spacing = walls[i].x - walls[i - 1].x;
                        expect(spacing).toBeCloseTo(CONFIG.WALL_SPACING, 5);
                    }
                },
            ),
        );
    });
});
