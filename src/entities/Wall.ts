import { BoundingBox } from '../types/index.js';
import { CONFIG } from '../types/config.js';

/**
 * Represents a single wall pair (top + bottom) with a gap.
 */
export class Wall {
    public x: number;
    public gapY: number;
    public gapSize: number;
    public width: number;
    public passed: boolean;

    constructor(x: number, gapY: number, gapSize: number) {
        this.x = x;
        this.gapY = gapY;
        this.gapSize = gapSize;
        this.width = CONFIG.WALL_WIDTH;
        this.passed = false;
    }

    /** Get bounding box for the top wall section */
    getTopRect(): BoundingBox {
        return {
            x: this.x,
            y: 0,
            width: this.width,
            height: this.gapY,
        };
    }

    /** Get bounding box for the bottom wall section */
    getBottomRect(): BoundingBox {
        return {
            x: this.x,
            y: this.gapY + this.gapSize,
            width: this.width,
            height: CONFIG.CANVAS_HEIGHT - (this.gapY + this.gapSize),
        };
    }

    /** Check if the player has passed this wall */
    isPassed(playerX: number, playerWidth: number): boolean {
        return playerX + playerWidth > this.x + this.width;
    }

    /** Mark this wall as scored */
    markPassed(): void {
        this.passed = true;
    }

    /** Render the wall pair */
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#2c3e50';

        // Top wall
        const top = this.getTopRect();
        ctx.fillRect(top.x, top.y, top.width, top.height);

        // Bottom wall
        const bottom = this.getBottomRect();
        ctx.fillRect(bottom.x, bottom.y, bottom.width, bottom.height);

        // Wall edges (subtle border)
        ctx.strokeStyle = '#1a252f';
        ctx.lineWidth = 2;
        ctx.strokeRect(top.x, top.y, top.width, top.height);
        ctx.strokeRect(bottom.x, bottom.y, bottom.width, bottom.height);
    }
}
