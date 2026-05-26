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
    drawParticles,
    drawGlowText,
    drawGround,
} from '../rendering/NeonTheme.js';

/**
 * Start screen state: cyberpunk neon style with title, instructions, and high score.
 */
export class StartState implements GameState {
    private input: InputHandler;
    private scoreManager: ScoreManager;
    private audioManager: AudioManager;
    private stateMachine: StateMachine | null;
    private particles: { x: number; y: number; size: number; alpha: number; speed: number }[];
    private blinkTimer: number;

    constructor(input: InputHandler, scoreManager: ScoreManager, audioManager: AudioManager) {
        this.input = input;
        this.scoreManager = scoreManager;
        this.audioManager = audioManager;
        this.stateMachine = null;
        this.particles = [];
        this.blinkTimer = 0;

        // Generate particles
        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: Math.random() * CONFIG.CANVAS_WIDTH,
                y: Math.random() * CONFIG.CANVAS_HEIGHT,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                speed: Math.random() * 0.3 + 0.1,
            });
        }
    }

    setStateMachine(sm: StateMachine): void {
        this.stateMachine = sm;
    }

    enter(): void {
        this.blinkTimer = 0;
    }

    exit(): void {
        // Nothing
    }

    update(): void {
        this.blinkTimer += 1;

        // Animate particles
        for (const p of this.particles) {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = CONFIG.CANVAS_HEIGHT;
                p.x = Math.random() * CONFIG.CANVAS_WIDTH;
            }
        }

        // Check for start action
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

        // Grid
        drawGrid(ctx, W, H);

        // Particles
        drawParticles(ctx, this.particles);

        // Ground with crosses
        drawGround(ctx, W, CONFIG.GROUND_Y, H);

        // Neon border
        drawNeonBorder(ctx, W, H);

        // Title with lightning bolts
        drawGlowText(ctx, '⚡ FLAPPY  KIRO ⚡', W / 2, 170, NEON.TEXT_CYAN, NEON.FONT_TITLE, 20);

        // Subtitle
        drawGlowText(ctx, 'VIKING CYBER EDITION', W / 2, 210, NEON.TEXT_GREEN, NEON.FONT_SMALL, 5);

        // Instructions
        drawGlowText(ctx, '[ SPACE ] TO JUMP', W / 2, 300, NEON.TEXT_WHITE, NEON.FONT_BODY, 3);
        drawGlowText(ctx, '[ P ] TO PAUSE', W / 2, 340, NEON.TEXT_WHITE, NEON.FONT_BODY, 3);

        // High score
        if (this.scoreManager.getHighScore() > 0) {
            drawGlowText(
                ctx,
                `HIGH: ${this.scoreManager.getHighScore()}`,
                W / 2,
                400,
                NEON.TEXT_YELLOW,
                NEON.FONT_BODY,
                5,
            );
        }

        // Blinking start prompt
        if (Math.floor(this.blinkTimer / 30) % 2 === 0) {
            drawGlowText(ctx, '>>> PRESS SPACE TO START <<<', W / 2, 480, NEON.TEXT_GREEN, NEON.FONT_BODY, 8);
        }

        // Sound indicator
        this.renderSoundIndicator(ctx);
    }

    private renderSoundIndicator(ctx: CanvasRenderingContext2D): void {
        const text = this.audioManager.isSoundEnabled() ? '[SND: ON]' : '[SND: OFF]';
        const color = this.audioManager.isSoundEnabled() ? NEON.TEXT_GREEN : NEON.TEXT_PINK;
        ctx.save();
        ctx.font = NEON.FONT_SMALL;
        ctx.textAlign = 'right';
        ctx.fillStyle = color;
        ctx.fillText(text, CONFIG.CANVAS_WIDTH - 20, 30);
        ctx.restore();
    }
}
