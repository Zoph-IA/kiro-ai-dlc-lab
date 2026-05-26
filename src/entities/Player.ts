import { BoundingBox } from '../types/index.js';
import { CONFIG } from '../types/config.js';

/**
 * Player entity representing Ghosty.
 * Handles physics (gravity, flap), position updates, and collision box.
 */
export class Player {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public velocityY: number;
    private sprite: HTMLImageElement | null;

    constructor(sprite: HTMLImageElement | null = null) {
        this.x = CONFIG.PLAYER_START_X;
        this.y = CONFIG.PLAYER_START_Y;
        this.width = CONFIG.PLAYER_SIZE;
        this.height = CONFIG.PLAYER_SIZE;
        this.velocityY = 0;
        this.sprite = sprite;
    }

    /** Apply gravity and update position each tick */
    update(): void {
        // Apply gravity
        this.velocityY += CONFIG.GRAVITY;

        // Cap downward velocity
        if (this.velocityY > CONFIG.TERMINAL_VELOCITY_DOWN) {
            this.velocityY = CONFIG.TERMINAL_VELOCITY_DOWN;
        }

        // Update position
        this.y += this.velocityY;

        // Ceiling clamp (BR-04)
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
    }

    /** Apply upward impulse (BR-02) */
    flap(): void {
        this.velocityY = CONFIG.FLAP_IMPULSE;

        // Cap upward velocity
        if (this.velocityY < CONFIG.TERMINAL_VELOCITY_UP) {
            this.velocityY = CONFIG.TERMINAL_VELOCITY_UP;
        }
    }

    /** Get collision bounding box (4px inset for fairness) */
    getBoundingBox(): BoundingBox {
        return {
            x: this.x + CONFIG.COLLISION_INSET,
            y: this.y + CONFIG.COLLISION_INSET,
            width: this.width - 2 * CONFIG.COLLISION_INSET,
            height: this.height - 2 * CONFIG.COLLISION_INSET,
        };
    }

    /** Render the ghost sprite */
    render(ctx: CanvasRenderingContext2D): void {
        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: draw a simple circle if sprite not loaded
            ctx.fillStyle = '#9b59b6';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.width / 2,
                0,
                Math.PI * 2,
            );
            ctx.fill();
        }
    }

    /** Reset player to starting position */
    reset(): void {
        this.x = CONFIG.PLAYER_START_X;
        this.y = CONFIG.PLAYER_START_Y;
        this.velocityY = 0;
    }
}
