import { BoundingBox } from '../types/index.js';

/**
 * Captures and normalizes player input (keyboard and mouse).
 * Implements debouncing for spacebar (BR-15).
 */
export class InputHandler {
    private flapPressed: boolean;
    private clickX: number;
    private clickY: number;
    private clicked: boolean;
    private boundKeyDown: (e: KeyboardEvent) => void;
    private boundClick: (e: MouseEvent) => void;
    private boundKeyUp: (e: KeyboardEvent) => void;
    private spaceHeld: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.flapPressed = false;
        this.clickX = 0;
        this.clickY = 0;
        this.clicked = false;
        this.spaceHeld = false;

        this.boundKeyDown = this.onKeyDown.bind(this);
        this.boundKeyUp = this.onKeyUp.bind(this);
        this.boundClick = this.onClick.bind(this, canvas);

        document.addEventListener('keydown', this.boundKeyDown);
        document.addEventListener('keyup', this.boundKeyUp);
        canvas.addEventListener('click', this.boundClick);
    }

    /** Check if flap was pressed this frame (consumed on read) */
    isFlapping(): boolean {
        const pressed = this.flapPressed;
        this.flapPressed = false;
        return pressed;
    }

    /** Check if a click occurred within a given region */
    isClicking(region: BoundingBox): boolean {
        if (!this.clicked) return false;
        const hit =
            this.clickX >= region.x &&
            this.clickX <= region.x + region.width &&
            this.clickY >= region.y &&
            this.clickY <= region.y + region.height;
        return hit;
    }

    /** Get raw click position (for general click detection) */
    hasClicked(): boolean {
        return this.clicked;
    }

    /** Reset input state for next frame */
    reset(): void {
        this.clicked = false;
    }

    /** Remove event listeners */
    destroy(): void {
        document.removeEventListener('keydown', this.boundKeyDown);
        document.removeEventListener('keyup', this.boundKeyUp);
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (e.code === 'Space') {
            e.preventDefault();
            // Debounce: only register on initial press, not hold (BR-15)
            if (!this.spaceHeld) {
                this.flapPressed = true;
                this.spaceHeld = true;
            }
        }
    }

    private onKeyUp(e: KeyboardEvent): void {
        if (e.code === 'Space') {
            this.spaceHeld = false;
        }
    }

    private onClick(canvas: HTMLCanvasElement, e: MouseEvent): void {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        this.clickX = (e.clientX - rect.left) * scaleX;
        this.clickY = (e.clientY - rect.top) * scaleY;
        this.clicked = true;
        // Also treat click as flap during gameplay
        this.flapPressed = true;
    }
}
