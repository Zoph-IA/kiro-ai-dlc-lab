import { GameState } from '../types/index.js';
import { CONFIG } from '../types/config.js';
import { Player } from '../entities/Player.js';
import { WallManager } from '../entities/WallManager.js';
import { CollisionDetector } from '../systems/CollisionDetector.js';
import { ScoreManager } from '../systems/ScoreManager.js';
import { DifficultyManager } from '../systems/DifficultyManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { InputHandler } from '../input/InputHandler.js';
import { StateMachine } from '../StateMachine.js';
import {
    NEON,
    drawNeonBorder,
    drawGrid,
    drawParticles,
    drawGlowText,
    drawGround,
} from '../rendering/NeonTheme.js';

/**
 * Active gameplay state with cyberpunk neon visuals.
 */
export class PlayingState implements GameState {
    private player: Player;
    private wallManager: WallManager;
    private scoreManager: ScoreManager;
    private audioManager: AudioManager;
    private input: InputHandler;
    private stateMachine: StateMachine | null;
    private particles: { x: number; y: number; size: number; alpha: number; speed: number }[];

    constructor(
        player: Player,
        wallManager: WallManager,
        scoreManager: ScoreManager,
        audioManager: AudioManager,
        input: InputHandler,
    ) {
        this.player = player;
        this.wallManager = wallManager;
        this.scoreManager = scoreManager;
        this.audioManager = audioManager;
        this.input = input;
        this.stateMachine = null;

        // Generate particles
        this.particles = [];
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: Math.random() * CONFIG.CANVAS_WIDTH,
                y: Math.random() * CONFIG.CANVAS_HEIGHT,
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
                speed: Math.random() * 0.2 + 0.05,
            });
        }
    }

    setStateMachine(sm: StateMachine): void {
        this.stateMachine = sm;
    }

    enter(): void {
        this.player.reset();
        this.wallManager.reset();
        this.scoreManager.reset();
    }

    exit(): void {
        // Nothing
    }

    update(): void {
        // Handle flap input
        if (this.input.isFlapping()) {
            this.player.flap();
            this.audioManager.playJump();
        }

        // Update player physics
        this.player.update();

        // Get difficulty params
        const { speed, gapSize } = DifficultyManager.getParams(this.scoreManager.getCurrentScore());

        // Update walls
        this.wallManager.update(speed, gapSize);

        // Check scoring
        const passedWalls = this.wallManager.getNewlyPassedWalls(this.player.x, this.player.width);
        for (let i = 0; i < passedWalls.length; i++) {
            this.scoreManager.increment();
        }

        // Check collisions
        const playerBox = this.player.getBoundingBox();
        const result = CollisionDetector.check(playerBox, this.wallManager.getWalls());

        if (result.collided) {
            this.stateMachine?.transition('gameOver');
        }

        // Animate particles
        for (const p of this.particles) {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = CONFIG.CANVAS_HEIGHT;
                p.x = Math.random() * CONFIG.CANVAS_WIDTH;
            }
        }

        this.input.reset();
    }

    render(ctx: CanvasRenderingContext2D): void {
        const W = CONFIG.CANVAS_WIDTH;
        const H = CONFIG.CANVAS_HEIGHT;

        // Dark background
        ctx.fillStyle = NEON.BG_DARK;
        ctx.fillRect(0, 0, W, H);

        // Grid
        drawGrid(ctx, W, H);

        // Particles
        drawParticles(ctx, this.particles);

        // Ground
        drawGround(ctx, W, CONFIG.GROUND_Y, H);

        // Walls (neon style)
        this.renderWalls(ctx);

        // Player with glow
        this.renderPlayer(ctx);

        // Neon border
        drawNeonBorder(ctx, W, H);

        // Score
        drawGlowText(
            ctx,
            `${this.scoreManager.getCurrentScore()}`,
            W / 2,
            55,
            NEON.TEXT_CYAN,
            NEON.FONT_SCORE,
            12,
        );

        // Sound indicator
        const text = this.audioManager.isSoundEnabled() ? '[SND: ON]' : '[SND: OFF]';
        const color = this.audioManager.isSoundEnabled() ? NEON.TEXT_GREEN : NEON.TEXT_PINK;
        ctx.save();
        ctx.font = NEON.FONT_SMALL;
        ctx.textAlign = 'right';
        ctx.fillStyle = color;
        ctx.fillText(text, W - 20, 30);
        ctx.restore();
    }

    private renderWalls(ctx: CanvasRenderingContext2D): void {
        const walls = this.wallManager.getWalls();
        for (const wall of walls) {
            const top = wall.getTopRect();
            const bottom = wall.getBottomRect();

            // Wall fill
            ctx.fillStyle = NEON.WALL_COLOR;
            ctx.fillRect(top.x, top.y, top.width, top.height);
            ctx.fillRect(bottom.x, bottom.y, bottom.width, bottom.height);

            // Wall neon border
            ctx.save();
            ctx.shadowColor = NEON.WALL_BORDER;
            ctx.shadowBlur = 6;
            ctx.strokeStyle = NEON.WALL_BORDER;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(top.x, top.y, top.width, top.height);
            ctx.strokeRect(bottom.x, bottom.y, bottom.width, bottom.height);
            ctx.restore();
        }
    }

    private renderPlayer(ctx: CanvasRenderingContext2D): void {
        // Glow effect behind player
        ctx.save();
        ctx.shadowColor = NEON.PLAYER_GLOW;
        ctx.shadowBlur = 15;
        this.player.render(ctx);
        ctx.restore();
    }
}
