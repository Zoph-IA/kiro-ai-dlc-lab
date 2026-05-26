import { Game } from './Game.js';

/**
 * Entry point: loads assets, creates canvas, and starts the game.
 */
async function main(): Promise<void> {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('Canvas element not found');
    }

    // Load ghost sprite
    const sprite = await loadImage('ghosty.png');

    // Create and start game
    const game = new Game(canvas, sprite);
    game.start();
}

/** Load an image asset and return a promise */
function loadImage(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            resolve(null); // Graceful degradation
        };
        img.src = src;
    });
}

// Global error handler (SECURITY-15, NFR-SEC-04)
window.onerror = (_message, _source, _lineno, _colno, _error) => {
    // Log to console in development, generic message only
    console.error('An unexpected error occurred');
    return true; // Prevent default browser error handling
};

window.addEventListener('unhandledrejection', (_event) => {
    console.error('An unexpected error occurred');
});

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    main().catch(() => {
        console.error('Failed to initialize game');
    });
});
