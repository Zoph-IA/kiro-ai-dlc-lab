import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Player } from '../../src/entities/Player.js';
import { CONFIG } from '../../src/types/config.js';
import { velocityArb } from './generators.js';

describe('Player - Property-Based Tests', () => {
    // P-01: Gravity Invariant
    it('P-01: velocity increases by exactly GRAVITY each tick (below terminal)', () => {
        fc.assert(
            fc.property(
                fc.float({ min: Math.fround(-5), max: Math.fround(CONFIG.TERMINAL_VELOCITY_DOWN - CONFIG.GRAVITY - 0.1), noNaN: true }),
                (startVelocity) => {
                    const player = new Player(null);
                    player.y = CONFIG.PLAYER_START_Y; // Ensure not at ceiling
                    player.velocityY = startVelocity;
                    player.update();
                    expect(player.velocityY).toBeCloseTo(startVelocity + CONFIG.GRAVITY, 5);
                },
            ),
        );
    });

    // P-02: Terminal Velocity Cap
    it('P-02: velocity never exceeds TERMINAL_VELOCITY_DOWN', () => {
        fc.assert(
            fc.property(fc.nat({ max: 100 }), (ticks) => {
                const player = new Player(null);
                for (let i = 0; i < ticks; i++) {
                    player.update();
                }
                expect(player.velocityY).toBeLessThanOrEqual(CONFIG.TERMINAL_VELOCITY_DOWN);
            }),
        );
    });

    // P-03: Flap Impulse
    it('P-03: after flap, velocity equals FLAP_IMPULSE regardless of starting velocity', () => {
        fc.assert(
            fc.property(velocityArb, (startVelocity) => {
                const player = new Player(null);
                player.velocityY = startVelocity;
                player.flap();
                expect(player.velocityY).toBe(CONFIG.FLAP_IMPULSE);
            }),
        );
    });

    // P-04: Ceiling Clamp
    it('P-04: player position never goes below 0', () => {
        fc.assert(
            fc.property(
                fc.array(fc.boolean(), { minLength: 1, maxLength: 200 }),
                (actions) => {
                    const player = new Player(null);
                    for (const shouldFlap of actions) {
                        if (shouldFlap) player.flap();
                        player.update();
                    }
                    expect(player.y).toBeGreaterThanOrEqual(0);
                },
            ),
        );
    });

    // P-05: Position Update
    it('P-05: position changes by velocity (before clamping)', () => {
        fc.assert(
            fc.property(
                fc.float({ min: 50, max: 400, noNaN: true }),
                fc.float({ min: -5, max: 5, noNaN: true }),
                (startY, velocity) => {
                    const player = new Player(null);
                    player.y = startY;
                    player.velocityY = velocity;
                    const expectedY = startY + velocity + CONFIG.GRAVITY;
                    player.update();
                    // If not clamped by ceiling, position should match
                    if (expectedY >= 0) {
                        expect(player.y).toBeCloseTo(expectedY, 5);
                    }
                },
            ),
        );
    });
});
