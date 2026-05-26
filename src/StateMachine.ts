import { GameState, GameStateName } from './types/index.js';

/**
 * Manages game state transitions between screens.
 * Calls enter/exit on state changes and delegates update/render.
 */
export class StateMachine {
    private states: Map<GameStateName, GameState>;
    private currentStateName: GameStateName;

    constructor(states: Map<GameStateName, GameState>, initialState: GameStateName) {
        this.states = states;
        this.currentStateName = initialState;
    }

    /** Start the initial state */
    start(): void {
        const state = this.states.get(this.currentStateName);
        if (state) {
            state.enter();
        }
    }

    /** Transition to a new state (calls exit on current, enter on new) */
    transition(stateName: GameStateName): void {
        const currentState = this.states.get(this.currentStateName);
        if (currentState) {
            currentState.exit();
        }

        this.currentStateName = stateName;

        const newState = this.states.get(stateName);
        if (newState) {
            newState.enter();
        }
    }

    /** Delegate update to current state */
    update(dt: number): void {
        const state = this.states.get(this.currentStateName);
        if (state) {
            state.update(dt);
        }
    }

    /** Delegate render to current state */
    render(ctx: CanvasRenderingContext2D): void {
        const state = this.states.get(this.currentStateName);
        if (state) {
            state.render(ctx);
        }
    }

    /** Get current state name */
    getCurrentStateName(): GameStateName {
        return this.currentStateName;
    }
}
