/**
 * Neon cyberpunk theme constants and drawing utilities.
 */
export const NEON = {
    // Colors
    BG_DARK: '#0a0e1a',
    BG_PANEL: '#0d1525',
    GRID_LINE: 'rgba(0, 255, 255, 0.05)',
    BORDER_CYAN: '#00ffff',
    BORDER_GLOW: 'rgba(0, 255, 255, 0.3)',
    TEXT_CYAN: '#00ffff',
    TEXT_GREEN: '#39ff14',
    TEXT_PINK: '#ff2d6b',
    TEXT_YELLOW: '#ffd700',
    TEXT_WHITE: '#e0e0e0',
    WALL_COLOR: '#1a3a5c',
    WALL_BORDER: '#00bfff',
    GROUND_COLOR: '#0a1628',
    GROUND_CROSS: '#00ffff',
    PLAYER_GLOW: 'rgba(200, 180, 255, 0.4)',
    PARTICLE_COLOR: 'rgba(255, 255, 255, 0.6)',

    // Fonts
    FONT_TITLE: 'bold 42px "Courier New", monospace',
    FONT_SUBTITLE: '18px "Courier New", monospace',
    FONT_BODY: '20px "Courier New", monospace',
    FONT_SCORE: 'bold 32px "Courier New", monospace',
    FONT_SMALL: '14px "Courier New", monospace',
    FONT_LARGE: 'bold 52px "Courier New", monospace',
} as const;

/** Draw a glowing neon border around the game area */
export function drawNeonBorder(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const inset = 12;
    ctx.save();

    // Outer glow
    ctx.shadowColor = NEON.BORDER_CYAN;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = NEON.BORDER_CYAN;
    ctx.lineWidth = 2;
    ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

    // Inner border (slightly smaller)
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1;
    ctx.strokeRect(inset + 6, inset + 6, w - (inset + 6) * 2, h - (inset + 6) * 2);

    ctx.restore();
}

/** Draw background grid pattern */
export function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.strokeStyle = NEON.GRID_LINE;
    ctx.lineWidth = 1;
    const spacing = 30;

    for (let x = 0; x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = 0; y < h; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

/** Draw floating particles (stars) */
export function drawParticles(
    ctx: CanvasRenderingContext2D,
    particles: { x: number; y: number; size: number; alpha: number }[],
): void {
    for (const p of particles) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
}

/** Draw text with neon glow effect */
export function drawGlowText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string,
    font: string,
    glowStrength: number = 10,
): void {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.shadowColor = color;
    ctx.shadowBlur = glowStrength;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
}

/** Draw the ground with cross/tombstone markers */
export function drawGround(ctx: CanvasRenderingContext2D, w: number, groundY: number, h: number): void {
    // Ground fill
    ctx.fillStyle = NEON.GROUND_COLOR;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Ground line
    ctx.strokeStyle = NEON.BORDER_CYAN;
    ctx.lineWidth = 1;
    ctx.shadowColor = NEON.BORDER_CYAN;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Cross markers
    ctx.strokeStyle = NEON.GROUND_CROSS;
    ctx.lineWidth = 1.5;
    const crossSpacing = 50;
    for (let x = 25; x < w; x += crossSpacing) {
        const cy = groundY + 20;
        // Vertical
        ctx.beginPath();
        ctx.moveTo(x, cy - 8);
        ctx.lineTo(x, cy + 8);
        ctx.stroke();
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(x - 5, cy - 3);
        ctx.lineTo(x + 5, cy - 3);
        ctx.stroke();
    }
}
