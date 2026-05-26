import { describe, it, expect, beforeEach } from 'vitest';
import { WallManager } from '../../src/entities/WallManager.js';
import { CONFIG } from '../../src/types/config.js';

describe('WallManager', () => {
    let wm: WallManager;

    beforeEach(() => {
        wm = new WallManager();
    });

    describe('initialization', () => {
        it('should start with no walls', () => {
            expect(wm.getWalls()).toHaveLength(0);
        });
    });

    describe('update', () => {
        it('should spawn first wall on first update', () => {
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            expect(wm.getWalls().length).toBeGreaterThan(0);
        });

        it('should scroll walls left by speed', () => {
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            const initialX = wm.getWalls()[0].x;
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            expect(wm.getWalls()[0].x).toBe(initialX - CONFIG.BASE_SPEED);
        });

        it('should remove walls that go off-screen', () => {
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            const wall = wm.getWalls()[0];
            // Move wall far off-screen
            wall.x = -CONFIG.WALL_WIDTH - 1;
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            // The off-screen wall should be removed
            const walls = wm.getWalls();
            const hasOffscreen = walls.some((w) => w.x < -CONFIG.WALL_WIDTH);
            expect(hasOffscreen).toBe(false);
        });
    });

    describe('getNewlyPassedWalls', () => {
        it('should return walls the player has passed', () => {
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            const wall = wm.getWalls()[0];
            // Position player past the wall
            const playerX = wall.x + wall.width + 10;
            const passed = wm.getNewlyPassedWalls(playerX, CONFIG.PLAYER_SIZE);
            expect(passed).toHaveLength(1);
        });

        it('should not return already-passed walls', () => {
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            const wall = wm.getWalls()[0];
            const playerX = wall.x + wall.width + 10;
            wm.getNewlyPassedWalls(playerX, CONFIG.PLAYER_SIZE);
            // Second call should return empty
            const passed = wm.getNewlyPassedWalls(playerX, CONFIG.PLAYER_SIZE);
            expect(passed).toHaveLength(0);
        });
    });

    describe('reset', () => {
        it('should clear all walls', () => {
            wm.update(CONFIG.BASE_SPEED, CONFIG.BASE_GAP);
            expect(wm.getWalls().length).toBeGreaterThan(0);
            wm.reset();
            expect(wm.getWalls()).toHaveLength(0);
        });
    });
});
