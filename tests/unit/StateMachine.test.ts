import { describe, it, expect, vi } from 'vitest';
import { StateMachine } from '../../src/StateMachine.js';
import { GameState, GameStateName } from '../../src/types/index.js';

function createMockState(): GameState {
    return {
        enter: vi.fn(),
        exit: vi.fn(),
        update: vi.fn(),
        render: vi.fn(),
    };
}

describe('StateMachine', () => {
    describe('initialization', () => {
        it('should set initial state', () => {
            const states = new Map<GameStateName, GameState>();
            states.set('start', createMockState());
            const sm = new StateMachine(states, 'start');
            expect(sm.getCurrentStateName()).toBe('start');
        });
    });

    describe('start', () => {
        it('should call enter on initial state', () => {
            const startState = createMockState();
            const states = new Map<GameStateName, GameState>();
            states.set('start', startState);
            const sm = new StateMachine(states, 'start');
            sm.start();
            expect(startState.enter).toHaveBeenCalledOnce();
        });
    });

    describe('transition', () => {
        it('should call exit on current state and enter on new state', () => {
            const startState = createMockState();
            const playingState = createMockState();
            const states = new Map<GameStateName, GameState>();
            states.set('start', startState);
            states.set('playing', playingState);
            const sm = new StateMachine(states, 'start');
            sm.start();

            sm.transition('playing');

            expect(startState.exit).toHaveBeenCalledOnce();
            expect(playingState.enter).toHaveBeenCalledOnce();
            expect(sm.getCurrentStateName()).toBe('playing');
        });
    });

    describe('update', () => {
        it('should delegate to current state', () => {
            const startState = createMockState();
            const states = new Map<GameStateName, GameState>();
            states.set('start', startState);
            const sm = new StateMachine(states, 'start');

            sm.update(16.67);

            expect(startState.update).toHaveBeenCalledWith(16.67);
        });
    });

    describe('render', () => {
        it('should delegate to current state', () => {
            const startState = createMockState();
            const states = new Map<GameStateName, GameState>();
            states.set('start', startState);
            const sm = new StateMachine(states, 'start');

            const mockCtx = {} as CanvasRenderingContext2D;
            sm.render(mockCtx);

            expect(startState.render).toHaveBeenCalledWith(mockCtx);
        });
    });
});
