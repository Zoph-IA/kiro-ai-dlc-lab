import { describe, it, expect } from 'vitest';
import { CollisionDetector } from '../../src/systems/CollisionDetector.js';
import { Wall } from '../../src/entities/Wall.js';
import { BoundingBox } from '../../src/types/index.js';
import { CONFIG } from '../../src/types/config.js';

describe('CollisionDetector', () => {
    describe('intersects', () => {
        it('should detect overlapping boxes', () => {
            const a: BoundingBox = { x: 0, y: 0, width: 10, height: 10 };
            const b: BoundingBox = { x: 5, y: 5, width: 10, height: 10 };
            expect(CollisionDetector.intersects(a, b)).toBe(true);
        });

        it('should not detect non-overlapping boxes', () => {
            const a: BoundingBox = { x: 0, y: 0, width: 10, height: 10 };
            const b: BoundingBox = { x: 20, y: 20, width: 10, height: 10 };
            expect(CollisionDetector.intersects(a, b)).toBe(false);
        });

        it('should not detect touching but non-overlapping boxes', () => {
            const a: BoundingBox = { x: 0, y: 0, width: 10, height: 10 };
            const b: BoundingBox = { x: 10, y: 0, width: 10, height: 10 };
            expect(CollisionDetector.intersects(a, b)).toBe(false);
        });

        it('should detect fully contained box', () => {
            const a: BoundingBox = { x: 0, y: 0, width: 20, height: 20 };
            const b: BoundingBox = { x: 5, y: 5, width: 5, height: 5 };
            expect(CollisionDetector.intersects(a, b)).toBe(true);
        });
    });

    describe('checkGroundCollision', () => {
        it('should detect player at ground level', () => {
            const box: BoundingBox = { x: 100, y: CONFIG.GROUND_Y - 10, width: 32, height: 32 };
            expect(CollisionDetector.checkGroundCollision(box)).toBe(true);
        });

        it('should not detect player above ground', () => {
            const box: BoundingBox = { x: 100, y: 200, width: 32, height: 32 };
            expect(CollisionDetector.checkGroundCollision(box)).toBe(false);
        });
    });

    describe('checkWallCollision', () => {
        it('should detect collision with top wall', () => {
            const wall = new Wall(100, 200, 160);
            const playerBox: BoundingBox = { x: 110, y: 50, width: 32, height: 32 };
            expect(CollisionDetector.checkWallCollision(playerBox, [wall])).toBe(true);
        });

        it('should detect collision with bottom wall', () => {
            const wall = new Wall(100, 200, 160);
            const playerBox: BoundingBox = { x: 110, y: 400, width: 32, height: 32 };
            expect(CollisionDetector.checkWallCollision(playerBox, [wall])).toBe(true);
        });

        it('should not detect collision when player is in gap', () => {
            const wall = new Wall(100, 200, 160);
            const playerBox: BoundingBox = { x: 110, y: 250, width: 32, height: 32 };
            expect(CollisionDetector.checkWallCollision(playerBox, [wall])).toBe(false);
        });

        it('should not detect collision when player is past wall', () => {
            const wall = new Wall(100, 200, 160);
            const playerBox: BoundingBox = { x: 200, y: 250, width: 32, height: 32 };
            expect(CollisionDetector.checkWallCollision(playerBox, [wall])).toBe(false);
        });
    });

    describe('check (combined)', () => {
        it('should return ground collision', () => {
            const box: BoundingBox = { x: 100, y: CONFIG.GROUND_Y - 10, width: 32, height: 32 };
            const result = CollisionDetector.check(box, []);
            expect(result.collided).toBe(true);
            expect(result.target).toBe('ground');
        });

        it('should return no collision when safe', () => {
            const box: BoundingBox = { x: 100, y: 200, width: 32, height: 32 };
            const result = CollisionDetector.check(box, []);
            expect(result.collided).toBe(false);
            expect(result.target).toBe('none');
        });
    });
});
