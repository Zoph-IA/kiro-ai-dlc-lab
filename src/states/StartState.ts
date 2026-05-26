import { GameState } from '../types/index.js';
import { CONFIG } from '../types/config.js';
import { InputHandler } from '../input/InputHandler.js';
import { ScoreManager } from '../systems/ScoreManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { StateMachine } from '../StateMachine.js';

/**
 * Start screen state: displays title, high score, and start prompt.
 */
export class StartState implements GameState {
    private input: InputHandler;
    private scoreManager: ScoreManager;
    private audioManager: AudioManager;
    private stateMachine: StateMachine | null;
    private soundToggleRegion = { x: CONFIG.CANVAS_WIDTH - 50, y: 10, width: 40, height: 40 };

    constructor(input: InputHandler, scoreManager: ScoreManager, audioManager: AudioManager) {
        this.input = input;
        this.scoreManager = scoreManager;
        this.audioManager = audioManager;
        this.stateMachine = null;
    }

    /** Set state machine reference for transitions */
    setStateMachine(sm: StateMachine): void {
        this.stateMachine = sm;
    }

    enter(): void {
        // Nothing special on enter
    }

    exit(): void {
        // Nothing special on exit
    }

    update(): void {
        // Check for sound toggle click
        if (this.input.isClicking(this.soundToggleRegion)) {
            this.audioManager.toggleSound();
        }

        // Check for start action (spacebar or click)
        if (this.input.isFlapping()) {
            this.stateMachine?.transition('playing');
        }

        this.input.reset();
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Background
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Ground
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(0, CONFIG.GROUND_Y, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT - CONFIG.GROUND_Y);

        // Title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Flappy Kiro', CONFIG.CANVAS_WIDTH / 2, 150);

        // Subtitle
        ctx.font = '20px Arial, sans-serif';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText('Press SPACE or Click to Start', CONFIG.CANVAS_WIDTH / 2, 350);

        // High score
        ctx.font = '24px Arial, sans-serif';
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(`High Score: ${this.scoreManager.getHighScore()}`, CONFIG.CANVAS_WIDTH / 2, 420);

        // Sound toggle
        this.renderSoundToggle(ctx);
    }

    private renderSoundToggle(ctx: CanvasRenderingContext2D): void {
        const r = this.soundToggleRegion;
        ctx.fillStyle = this.audioManager.isSoundEnabled() ? '#27ae60' : '#e74c3c';
        ctx.fillRect(r.x, r.y, r.width, r.height);
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.audioManager.isSoundEnabled() ? '🔊' : '🔇',
            r.x + r.width / 2,
            r.y + r.height / 2 + 6,
        );
    }
}
