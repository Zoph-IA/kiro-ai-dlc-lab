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

/**
 * Active gameplay state: physics, walls, scoring, collision detection.
 */
export class PlayingState implements GameState {
    private player: Player;
    private wallManager: WallManager;
    private scoreManager: ScoreManager;
    private audioManager: AudioManager;
    private input: InputHandler;
    private stateMachine: StateMachine | null;
    private soundToggleRegion = { x: CONFIG.CANVAS_WIDTH - 50, y: 10, width: 40, height: 40 };

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
    }

    /** Set state machine reference for transitions */
    setStateMachine(sm: StateMachine): void {
        this.stateMachine = sm;
    }

    enter(): void {
        // Reset game state for new round (BR-14)
        this.player.reset();
        this.wallManager.reset();
        this.scoreManager.reset();
    }

    exit(): void {
        // Nothing special on exit
    }

    update(): void {
        // Check sound toggle
        if (this.input.isClicking(this.soundToggleRegion)) {
            this.audioManager.toggleSound();
        }

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

        // Check scoring (BR-07)
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

        this.input.reset();
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Background
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Ground
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(0, CONFIG.GROUND_Y, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT - CONFIG.GROUND_Y);

        // Walls
        this.wallManager.render(ctx);

        // Player
        this.player.render(ctx);

        // Score
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(this.scoreManager.getCurrentScore()), CONFIG.CANVAS_WIDTH / 2, 50);

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
