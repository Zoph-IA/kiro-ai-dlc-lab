import { GameState } from '../types/index.js';
import { CONFIG } from '../types/config.js';
import { InputHandler } from '../input/InputHandler.js';
import { ScoreManager } from '../systems/ScoreManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { StateMachine } from '../StateMachine.js';

/**
 * Game over state: displays final score, high score, and restart options.
 */
export class GameOverState implements GameState {
    private input: InputHandler;
    private scoreManager: ScoreManager;
    private audioManager: AudioManager;
    private stateMachine: StateMachine | null;
    private soundToggleRegion = { x: CONFIG.CANVAS_WIDTH - 50, y: 10, width: 40, height: 40 };
    private restartRegion = { x: 300, y: 380, width: 200, height: 50 };
    private menuRegion = { x: 300, y: 450, width: 200, height: 50 };

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
        // Play game over sound and save high score
        this.audioManager.playGameOver();
        this.scoreManager.saveHighScore();
    }

    exit(): void {
        // Nothing special on exit
    }

    update(): void {
        // Check sound toggle
        if (this.input.isClicking(this.soundToggleRegion)) {
            this.audioManager.toggleSound();
        }

        // Check restart (spacebar or click restart button)
        if (this.input.isFlapping()) {
            this.stateMachine?.transition('playing');
        } else if (this.input.isClicking(this.menuRegion)) {
            this.stateMachine?.transition('start');
        }

        this.input.reset();
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Game Over title
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', CONFIG.CANVAS_WIDTH / 2, 150);

        // Score
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '32px Arial, sans-serif';
        ctx.fillText(`Score: ${this.scoreManager.getCurrentScore()}`, CONFIG.CANVAS_WIDTH / 2, 230);

        // High score
        const isNew = this.scoreManager.isNewHighScore();
        ctx.fillStyle = isNew ? '#f39c12' : '#ecf0f1';
        ctx.font = '28px Arial, sans-serif';
        ctx.fillText(
            `High Score: ${this.scoreManager.getHighScore()}${isNew ? ' 🏆 NEW!' : ''}`,
            CONFIG.CANVAS_WIDTH / 2,
            290,
        );

        // Restart button
        this.renderButton(ctx, this.restartRegion, 'Restart (SPACE)');

        // Menu button
        this.renderButton(ctx, this.menuRegion, 'Main Menu');

        // Sound toggle
        this.renderSoundToggle(ctx);
    }

    private renderButton(
        ctx: CanvasRenderingContext2D,
        region: { x: number; y: number; width: number; height: number },
        text: string,
    ): void {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(region.x, region.y, region.width, region.height);
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.strokeRect(region.x, region.y, region.width, region.height);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, region.x + region.width / 2, region.y + region.height / 2 + 7);
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
