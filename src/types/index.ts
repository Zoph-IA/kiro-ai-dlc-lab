/** Axis-aligned bounding box for collision detection */
export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** Result of a collision check */
export interface CollisionResult {
    collided: boolean;
    target: 'wall' | 'ground' | 'none';
}

/** Available game state names */
export type GameStateName = 'start' | 'playing' | 'gameOver';

/** Interface for game state objects */
export interface GameState {
    enter(): void;
    exit(): void;
    update(dt: number): void;
    render(ctx: CanvasRenderingContext2D): void;
}
