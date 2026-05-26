# Flappy Kiro — Code Summary

## File Structure

```
src/
├── main.ts                          # Entry point, asset loading, error handlers
├── Game.ts                          # Game orchestrator, fixed-timestep loop
├── StateMachine.ts                  # State machine implementation
├── types/
│   ├── index.ts                     # Shared interfaces (BoundingBox, GameState, etc.)
│   └── config.ts                    # Game constants (CONFIG object)
├── states/
│   ├── GameState.ts                 # Re-export of GameState interface
│   ├── StartState.ts                # Start screen logic and rendering
│   ├── PlayingState.ts              # Active gameplay coordination
│   └── GameOverState.ts             # Game over screen and restart
├── entities/
│   ├── Player.ts                    # Ghosty physics and rendering
│   ├── Wall.ts                      # Single wall pair data
│   └── WallManager.ts              # Wall lifecycle management
├── systems/
│   ├── CollisionDetector.ts         # AABB collision detection
│   ├── ScoreManager.ts             # Score tracking + localStorage
│   ├── DifficultyManager.ts        # Linear difficulty formulas
│   └── AudioManager.ts             # Sound playback + toggle
├── input/
│   └── InputHandler.ts             # Keyboard/mouse input capture
└── rendering/
    (rendering handled within states)

tests/
├── unit/
│   ├── Player.test.ts              # Player physics example tests
│   ├── CollisionDetector.test.ts   # Collision example tests
│   ├── ScoreManager.test.ts        # Score logic example tests
│   ├── DifficultyManager.test.ts   # Difficulty formula example tests
│   ├── WallManager.test.ts         # Wall lifecycle example tests
│   └── StateMachine.test.ts        # State transition example tests
└── pbt/
    ├── generators.ts               # Domain-specific PBT generators (PBT-07)
    ├── Player.pbt.test.ts          # P-01 through P-05
    ├── CollisionDetector.pbt.test.ts # P-06 through P-09
    ├── DifficultyManager.pbt.test.ts # P-10 through P-14
    ├── WallManager.pbt.test.ts     # P-15 through P-17
    ├── ScoreManager.pbt.test.ts    # P-18 through P-20
    └── Scaling.pbt.test.ts         # P-21, P-22
```

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Rendering approach | Inline in states | Simpler than separate Renderer class; each state owns its drawing |
| State machine wiring | setStateMachine() | Avoids circular constructor dependencies |
| Collision detection | Static methods | Stateless utility, easy to test |
| Difficulty manager | Static methods | Pure calculations, no state needed |
| Audio loading | Async with graceful fallback | Handles autoplay restrictions and load failures |
| localStorage | Try/catch wrappers | Graceful degradation per NFR-SEC-04 |

## Story Coverage

All 12 user stories (US-01 through US-12) are implemented across the codebase.

## Test Coverage

- **6 example-based test files**: Cover critical business scenarios
- **6 PBT test files + 1 generator file**: Cover all 22 identified properties
- **Total properties tested**: 22 (PBT-01 through PBT-10 compliant)
