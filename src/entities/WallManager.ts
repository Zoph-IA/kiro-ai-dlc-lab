import { Wall } from './Wall.js';
import { CONFIG } from '../types/config.js';

/**
 * Manages the lifecycle of wall obstacles: spawning, scrolling, and removal.
 */
export class WallManager {
    private walls: Wall[];
    private canvasWidth: number;

    constructor() {
        this.walls = [];
        this.canvasWidth = CONFIG.CANVAS_WIDTH;
    }

    /** Update all walls: scroll left, spawn new, remove off-screen */
    update(speed: number, gapSize: number): void {
        // Scroll all walls left
        for (const wall of this.walls) {
            wall.x -= speed;
        }

        // Remove off-screen walls (BR-10)
        this.walls = this.walls.filter((wall) => wall.x + wall.width > 0);

        // Spawn new wall if needed (BR-09)
        if (this.shouldSpawn()) {
            this.spawn(gapSize);
        }
    }

    /** Check if a new wall should be spawned */
    private shouldSpawn(): boolean {
        if (this.walls.length === 0) {
            return true;
        }
        const rightmost = this.walls[this.walls.length - 1];
        return rightmost.x <= this.canvasWidth - CONFIG.WALL_SPACING;
    }

    /** Spawn a new wall with random gap position (BR-12) */
    private spawn(gapSize: number): void {
        const minGapY = CONFIG.MIN_GAP_MARGIN;
        const maxGapY = CONFIG.CANVAS_HEIGHT - gapSize - CONFIG.MIN_GAP_MARGIN;
        const gapY = minGapY + Math.random() * (maxGapY - minGapY);

        const wall = new Wall(this.canvasWidth, gapY, gapSize);
        this.walls.push(wall);
    }

    /** Get all active walls */
    getWalls(): Wall[] {
        return this.walls;
    }

    /** Get walls that the player has newly passed (for scoring) */
    getNewlyPassedWalls(playerX: number, playerWidth: number): Wall[] {
        const passed: Wall[] = [];
        for (const wall of this.walls) {
            if (!wall.passed && wall.isPassed(playerX, playerWidth)) {
                wall.markPassed();
                passed.push(wall);
            }
        }
        return passed;
    }

    /** Clear all walls (on game reset) */
    reset(): void {
        this.walls = [];
    }

    /** Render all walls */
    render(ctx: CanvasRenderingContext2D): void {
        for (const wall of this.walls) {
            wall.render(ctx);
        }
    }
}
