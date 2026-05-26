import { GameStateName } from './types/index.js';
import { CONFIG } from './types/config.js';
import { Player } from './entities/Player.js';
import { WallManager } from './entities/WallManager.js';
import { ScoreManager } from './systems/ScoreManager.js';
import { AudioManager } from './systems/AudioManager.js';
import { InputHandler } from './input/InputHandler.js';
import { StateMachine } from './StateMachine.js';
import { StartState } from './states/StartState.js';
import { PlayingState } from './states/PlayingState.js';
import { GameOverState } from './states/GameOverState.js';

/**
 * Top-level game orchestrator.
 * Owns all components, runs the fixed-timestep game loop.
 */
export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private stateMachine: StateMachine;
    private input: InputHandler;
    private lastTime: number;
    private accumulator: number;
    private running: boolean;
    private animationFrameId: number | null;

    constructor(canvas: HTMLCanvasElement, sprite: HTMLImageElement | null) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D canvas context');
        }
        this.ctx = ctx;

        // Set internal resolution
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;

        // Initialize components
        this.input = new InputHandler(canvas);
        const scoreManager = new ScoreManager();
        const audioManager = new AudioManager();
        const player = new Player(sprite);
        const wallManager = new WallManager();

        // Initialize states
        const startState = new StartState(this.input, scoreManager, audioManager);
        const playingState = new PlayingState(
            player,
            wallManager,
            scoreManager,
            audioManager,
            this.input,
        );
        const gameOverState = new GameOverState(this.input, scoreManager, audioManager);

        // Create state machine
        const states = new Map<GameStateName, StartState | PlayingState | GameOverState>();
        states.set('start', startState);
        states.set('playing', playingState);
        states.set('gameOver', gameOverState);

        this.stateMachine = new StateMachine(states as Map<GameStateName, StartState>, 'start');

        // Wire state machine references
        startState.setStateMachine(this.stateMachine);
        playingState.setStateMachine(this.stateMachine);
        gameOverState.setStateMachine(this.stateMachine);

        // Load audio assets
        audioManager.loadAssets();

        // Loop state
        this.lastTime = 0;
        this.accumulator = 0;
        this.running = false;
        this.animationFrameId = null;

        // Handle window resize
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    /** Start the game loop */
    start(): void {
        this.running = true;
        this.lastTime = performance.now();
        this.stateMachine.start();
        this.loop(this.lastTime);
    }

    /** Stop the game loop */
    stop(): void {
        this.running = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /** Fixed-timestep game loop with variable rendering */
    private loop(currentTime: number): void {
        if (!this.running) return;

        const frameTime = Math.min(currentTime - this.lastTime, 100); // Cap to prevent spiral of death
        this.lastTime = currentTime;
        this.accumulator += frameTime;

        // Fixed-timestep updates
        while (this.accumulator >= CONFIG.FIXED_TIMESTEP) {
            this.stateMachine.update(CONFIG.FIXED_TIMESTEP);
            this.accumulator -= CONFIG.FIXED_TIMESTEP;
        }

        // Render
        this.stateMachine.render(this.ctx);

        this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
    }

    /** Handle responsive canvas scaling (BR-16) */
    private handleResize(): void {
        const scale = Math.min(
            window.innerWidth / CONFIG.CANVAS_WIDTH,
            window.innerHeight / CONFIG.CANVAS_HEIGHT,
        );

        this.canvas.style.width = `${CONFIG.CANVAS_WIDTH * scale}px`;
        this.canvas.style.height = `${CONFIG.CANVAS_HEIGHT * scale}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${(window.innerWidth - CONFIG.CANVAS_WIDTH * scale) / 2}px`;
        this.canvas.style.top = `${(window.innerHeight - CONFIG.CANVAS_HEIGHT * scale) / 2}px`;
    }
}
