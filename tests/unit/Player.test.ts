import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../../src/entities/Player.js';
import { CONFIG } from '../../src/types/config.js';

describe('Player', () => {
    let player: Player;

    beforeEach(() => {
        player = new Player(null);
    });

    describe('initialization', () => {
        it('should start at configured position', () => {
            expect(player.x).toBe(CONFIG.PLAYER_START_X);
            expect(player.y).toBe(CONFIG.PLAYER_START_Y);
        });

        it('should start with zero velocity', () => {
            expect(player.velocityY).toBe(0);
        });
    });

    describe('update (gravity)', () => {
        it('should increase velocity by gravity each tick', () => {
            player.update();
            expect(player.velocityY).toBe(CONFIG.GRAVITY);
        });

        it('should move player down by velocity', () => {
            const startY = player.y;
            player.update();
            expect(player.y).toBe(startY + CONFIG.GRAVITY);
        });

        it('should cap downward velocity at terminal velocity', () => {
            player.velocityY = CONFIG.TERMINAL_VELOCITY_DOWN;
            player.update();
            expect(player.velocityY).toBe(CONFIG.TERMINAL_VELOCITY_DOWN);
        });
    });

    describe('flap', () => {
        it('should set velocity to flap impulse', () => {
            player.velocityY = 5;
            player.flap();
            expect(player.velocityY).toBe(CONFIG.FLAP_IMPULSE);
        });

        it('should override current velocity regardless of direction', () => {
            player.velocityY = -3;
            player.flap();
            expect(player.velocityY).toBe(CONFIG.FLAP_IMPULSE);
        });
    });

    describe('ceiling clamp', () => {
        it('should clamp position at y=0', () => {
            player.y = 2;
            player.velocityY = -10;
            player.update();
            expect(player.y).toBe(0);
            expect(player.velocityY).toBe(0);
        });
    });

    describe('getBoundingBox', () => {
        it('should return inset bounding box', () => {
            const box = player.getBoundingBox();
            expect(box.x).toBe(player.x + CONFIG.COLLISION_INSET);
            expect(box.y).toBe(player.y + CONFIG.COLLISION_INSET);
            expect(box.width).toBe(player.width - 2 * CONFIG.COLLISION_INSET);
            expect(box.height).toBe(player.height - 2 * CONFIG.COLLISION_INSET);
        });
    });

    describe('reset', () => {
        it('should restore starting position and zero velocity', () => {
            player.y = 500;
            player.velocityY = 10;
            player.reset();
            expect(player.x).toBe(CONFIG.PLAYER_START_X);
            expect(player.y).toBe(CONFIG.PLAYER_START_Y);
            expect(player.velocityY).toBe(0);
        });
    });
});
