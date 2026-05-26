import { GameState } from '../types/index.js';
import { CONFIG } from '../types/config.js';
import { InputHandler } from '../input/InputHandler.js';
import { ScoreManager } from '../systems/ScoreManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { StateMachine } from '../StateMachine.js';
import {
    NEON,
    drawNeonBorder,
    drawGrid,
    drawGlowText,
    drawGround,
} from '../rendering/NeonTheme.js';

/**
 * Game over state with cyberpunk neon styling.
 */
export class GameOverState implements GameState {
    private input: InputHandler;
    private scoreManager: ScoreManager;
    private audioManager: AudioManager;
    private stateMachine: StateMachine | null;
    private blinkTimer: number;

    constructor(input: InputHandler, scoreManager: ScoreManager, audioManager: AudioManager) {
        this.input = input;
        this.scoreManager = scoreManager;
        this.audioManager = audioManager;
        this.stateMachine = null;
        this.blinkTimer = 0;
    }

    setStateMachine(sm: StateMachine): void {
        this.stateMachine = sm;
    }

    enter(): void {
        this.audioManager.playGameOver();
        this.scoreManager.saveHighScore();
        this.blinkTimer = 0;
    }

    exit(): void {
        // Nothing
    }

    update(): void {
        this.blinkTimer += 1;

        // Check restart (spacebar)
        if (this.input.isFlapping()) {
            this.stateMachine?.transition('playing');
        }

        this.input.reset();
    }

    render(ctx: CanvasRenderingContext2D): void {
        const W = CONFIG.CANVAS_WIDTH;
        const H = CONFIG.CANVAS_HEIGHT;

        // Dark background
        ctx.fillStyle = NEON.BG_DARK;
        ctx.fillRect(0, 0, W, H);

        // Grid (dimmer)
        drawGrid(ctx, W, H);

        // Ground
        drawGround(ctx, W, CONFIG.GROUND_Y, H);

        // Neon border
        drawNeonBorder(ctx, W, H);

        // Game Over title (pink neon)
        drawGlowText(ctx, 'GAME  OVER', W / 2, 200, NEON.TEXT_PINK, NEON.FONT_LARGE, 25);

        // Score
        drawGlowText(
            ctx,
            `SCORE: ${this.scoreManager.getCurrentScore()}`,
            W / 2,
            290,
            NEON.TEXT_WHITE,
            NEON.FONT_SCORE,
            5,
        );

        // High score
        drawGlowText(
            ctx,
            `HIGH: ${this.scoreManager.getHighScore()}`,
            W / 2,
            340,
            NEON.TEXT_WHITE,
            NEON.FONT_SCORE,
            5,
        );

        // New high score indicator
        if (this.scoreManager.isNewHighScore()) {
            drawGlowText(ctx, '*** NEW HIGH SCORE ***', W / 2, 390, NEON.TEXT_YELLOW, NEON.FONT_BODY, 10);
        }

        // Blinking restart prompt
        if (Math.floor(this.blinkTimer / 30) % 2 === 0) {
            drawGlowText(ctx, '>>> SPACE TO RESTART <<<', W / 2, 470, NEON.TEXT_GREEN, NEON.FONT_BODY, 8);
        }
    }
}
