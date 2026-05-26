import { BoundingBox, CollisionResult } from '../types/index.js';
import { CONFIG } from '../types/config.js';
import { Wall } from '../entities/Wall.js';

/**
 * Detects collisions between the player and walls/ground using AABB intersection.
 */
export class CollisionDetector {
    /** Check AABB intersection between two bounding boxes */
    static intersects(a: BoundingBox, b: BoundingBox): boolean {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    /** Check if player collides with the ground (BR-05) */
    static checkGroundCollision(playerBox: BoundingBox): boolean {
        return playerBox.y + playerBox.height >= CONFIG.GROUND_Y;
    }

    /** Check if player collides with any wall (BR-06) */
    static checkWallCollision(playerBox: BoundingBox, walls: Wall[]): boolean {
        for (const wall of walls) {
            const topRect = wall.getTopRect();
            const bottomRect = wall.getBottomRect();

            if (
                CollisionDetector.intersects(playerBox, topRect) ||
                CollisionDetector.intersects(playerBox, bottomRect)
            ) {
                return true;
            }
        }
        return false;
    }

    /** Perform all collision checks and return result */
    static check(playerBox: BoundingBox, walls: Wall[]): CollisionResult {
        // Check ground first
        if (CollisionDetector.checkGroundCollision(playerBox)) {
            return { collided: true, target: 'ground' };
        }

        // Check walls
        if (CollisionDetector.checkWallCollision(playerBox, walls)) {
            return { collided: true, target: 'wall' };
        }

        return { collided: false, target: 'none' };
    }
}
