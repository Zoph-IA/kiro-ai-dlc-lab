# Flappy Kiro — Services

## Service Layer Overview

Since Flappy Kiro is a single-page client-side game, the "service layer" is lightweight. The `Game` class acts as the primary orchestrator, and each game state acts as a mini-service coordinating the relevant components for its screen.

---

## Service: Game (Orchestrator)

**Role**: Top-level coordinator that initializes all components and runs the game loop.

**Orchestration Pattern**: Fixed-timestep loop with variable rendering.

**Coordinates**:
- StateMachine (delegates update/render per frame)
- InputHandler (captures input each frame)
- AudioManager (initialized once, used by states)
- ScoreManager (initialized once, used by states)
- Renderer (initialized once, used by states)

**Loop Logic**:
```
accumulator += frameTime
while (accumulator >= FIXED_TIMESTEP):
    stateMachine.update(FIXED_TIMESTEP)
    accumulator -= FIXED_TIMESTEP
stateMachine.render(ctx)
```

---

## Service: StartState

**Role**: Coordinate the start screen experience.

**Coordinates**:
- Renderer (draw start screen)
- InputHandler (detect start action)
- ScoreManager (display high score)
- AudioManager (display sound toggle)

**Transitions**:
- On spacebar/click start → transition to `PlayingState`

---

## Service: PlayingState

**Role**: Coordinate active gameplay — the core game loop logic.

**Coordinates**:
- Player (update physics, handle flap)
- WallManager (spawn, scroll, remove walls)
- CollisionDetector (check collisions each tick)
- ScoreManager (increment on wall pass)
- AudioManager (play jump sound)
- Renderer (draw gameplay elements)
- InputHandler (detect flap input)
- DifficultyManager (calculate current speed/gap based on score)

**Transitions**:
- On collision detected → transition to `GameOverState`

---

## Service: GameOverState

**Role**: Coordinate the game over screen and restart flow.

**Coordinates**:
- Renderer (draw game over screen)
- ScoreManager (display final/high score, save high score)
- AudioManager (play game over sound on enter, display toggle)
- InputHandler (detect restart/menu action)

**Transitions**:
- On restart → reset game, transition to `PlayingState`
- On menu → transition to `StartState`

---

## Service: DifficultyManager

**Role**: Calculate difficulty parameters based on current score.

**Coordinates**: None (pure calculation service)

**Provides**:
- Current wall speed (increases with score)
- Current gap size (decreases with score, with minimum)
- Current spawn interval (decreases with score, with minimum)

---

## Persistence Services

### LocalStorage Abstraction

Both `ScoreManager` and `AudioManager` interact with `localStorage` for persistence. This is handled internally by each component (no separate persistence service needed for this scope).

| Component | Key | Value |
|---|---|---|
| ScoreManager | `flappyKiro_highScore` | number (string) |
| AudioManager | `flappyKiro_soundEnabled` | "true" / "false" |
