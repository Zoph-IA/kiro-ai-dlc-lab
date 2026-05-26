import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { CollisionDetector } from '../../src/systems/CollisionDetector.js';
import { BoundingBox } from '../../src/types/index.js';
import { CONFIG } from '../../src/types/config.js';
import { boundingBoxArb, separatedBoxesArb } from './generators.js';

describe('CollisionDetector - Property-Based Tests', () => {
    // P-06: AABB Commutativity
    it('P-06: intersects(a, b) == intersects(b, a)', () => {
        fc.assert(
            fc.property(boundingBoxArb, boundingBoxArb, (a, b) => {
                expect(CollisionDetector.intersects(a, b)).toBe(CollisionDetector.intersects(b, a));
            }),
        );
    });

    // P-07: AABB Self-Collision
    it('P-07: any non-zero-area box collides with itself', () => {
        fc.assert(
            fc.property(boundingBoxArb, (box) => {
                expect(CollisionDetector.intersects(box, box)).toBe(true);
            }),
        );
    });

    // P-08: AABB Non-Overlapping
    it('P-08: separated boxes do not collide', () => {
        fc.assert(
            fc.property(separatedBoxesArb, ([a, b]) => {
                expect(CollisionDetector.intersects(a, b)).toBe(false);
            }),
        );
    });

    // P-09: Ground Collision Consistency
    it('P-09: player at or below ground always triggers ground collision', () => {
        fc.assert(
            fc.property(
                fc.float({ min: 0, max: CONFIG.CANVAS_WIDTH, noNaN: true }),
                fc.float({ min: CONFIG.GROUND_Y - 32, max: CONFIG.CANVAS_HEIGHT, noNaN: true }),
                (x, y) => {
                    const box: BoundingBox = { x, y, width: 32, height: 32 };
                    if (box.y + box.height >= CONFIG.GROUND_Y) {
                        expect(CollisionDetector.checkGroundCollision(box)).toBe(true);
                    }
                },
            ),
        );
    });
});
