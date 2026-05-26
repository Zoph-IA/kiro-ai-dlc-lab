/** Game configuration constants derived from functional design */
export const CONFIG = {
    // Canvas (internal logical resolution)
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,

    // Physics
    GRAVITY: 0.35,
    FLAP_IMPULSE: -6.5,
    TERMINAL_VELOCITY_DOWN: 9,
    TERMINAL_VELOCITY_UP: -8,

    // Ground
    GROUND_Y: 560,

    // Player
    PLAYER_START_X: 150,
    PLAYER_START_Y: 300,
    PLAYER_SIZE: 40,
    COLLISION_INSET: 4,

    // Walls
    WALL_WIDTH: 60,
    WALL_SPACING: 300,
    FIRST_WALL_X: 600,

    // Difficulty (linear progression)
    BASE_SPEED: 2.5,
    SPEED_INCREMENT: 0.08,
    MAX_SPEED: 6.5,
    BASE_GAP: 160,
    GAP_REDUCTION: 0.5,
    MIN_GAP: 120,
    MIN_GAP_MARGIN: 80,

    // Timing
    FIXED_TIMESTEP: 1000 / 60,

    // Storage keys
    STORAGE_HIGH_SCORE: 'flappyKiro_highScore',
    STORAGE_SOUND_ENABLED: 'flappyKiro_soundEnabled',
} as const;
