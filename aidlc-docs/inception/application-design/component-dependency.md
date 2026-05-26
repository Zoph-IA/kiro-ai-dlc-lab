# Flappy Kiro — Component Dependencies

## Dependency Matrix

| Component | Depends On | Depended On By |
|---|---|---|
| Game | StateMachine, InputHandler, AudioManager, ScoreManager, Renderer, Player, WallManager, CollisionDetector, DifficultyManager | — (top-level) |
| StateMachine | GameState interface | Game |
| StartState | Renderer, InputHandler, ScoreManager, AudioManager | StateMachine |
| PlayingState | Player, WallManager, CollisionDetector, ScoreManager, AudioManager, InputHandler, Renderer, DifficultyManager | StateMachine |
| GameOverState | Renderer, InputHandler, ScoreManager, AudioManager | StateMachine |
| Player | — (self-contained physics) | PlayingState, CollisionDetector, Renderer |
| WallManager | Wall | PlayingState, CollisionDetector, Renderer |
| Wall | — (data class) | WallManager |
| CollisionDetector | BoundingBox interface | PlayingState |
| ScoreManager | localStorage | StartState, PlayingState, GameOverState |
| AudioManager | HTMLAudioElement, localStorage | StartState, PlayingState, GameOverState |
| InputHandler | DOM events | All states |
| Renderer | CanvasRenderingContext2D | All states |
| DifficultyManager | — (pure functions) | PlayingState |

---

## Communication Patterns

### Data Flow

```
InputHandler ──→ Active State ──→ Player (flap command)
                      │
                      ├──→ WallManager (update tick)
                      │
                      ├──→ CollisionDetector (check)
                      │         │
                      │         └──→ StateMachine (transition on collision)
                      │
                      ├──→ ScoreManager (increment)
                      │
                      ├──→ DifficultyManager (get params)
                      │
                      └──→ Renderer (draw frame)
```

### Ownership Model

- **Game** owns all component instances (creates them in constructor)
- **StateMachine** receives references to components it needs
- **States** receive component references via constructor injection
- **Components** are stateless services or self-contained state holders

### Coupling Assessment

| Relationship | Coupling Level | Notes |
|---|---|---|
| Game → All Components | High (expected) | Orchestrator pattern — acceptable |
| States → Components | Medium | States coordinate multiple components |
| Player → nothing | Low | Self-contained, only exposes data |
| Wall → nothing | Low | Pure data class |
| CollisionDetector → BoundingBox | Low | Interface-only dependency |
| DifficultyManager → nothing | Low | Pure calculation, no side effects |
| ScoreManager → localStorage | Low | Single external dependency |
| AudioManager → DOM Audio API | Low | Single external dependency |

### Initialization Order

1. Canvas + Context
2. Renderer (needs context)
3. InputHandler (needs DOM)
4. AudioManager (needs audio files)
5. ScoreManager (needs localStorage)
6. DifficultyManager (no dependencies)
7. Player (needs sprite image)
8. WallManager (needs canvas dimensions)
9. CollisionDetector (no dependencies)
10. States (need component references)
11. StateMachine (needs states)
12. Game (orchestrates all above)
