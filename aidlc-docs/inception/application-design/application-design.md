# Flappy Kiro — Application Design (Consolidated)

## Architecture Overview

Flappy Kiro uses a **class-based OOP architecture** with a **state machine pattern** for game flow and a **fixed-timestep game loop** with variable rendering.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Architecture Style | Class-based OOP | Clear boundaries, familiar patterns, good for game components |
| State Management | State Machine | Clean transitions, dedicated state logic, extensible |
| Game Loop | Fixed timestep + variable render | Physics-accurate, frame-rate independent, smooth visuals |
| File Organization | One class per file | Maintainable, testable, clear imports |

---

## Component Summary (10 components)

| Component | Responsibility | Coupling |
|---|---|---|
| **Game** | Top-level orchestrator, game loop | High (expected) |
| **StateMachine** | State transitions, delegation | Medium |
| **Player** | Ghost physics, position, sprite | Low |
| **WallManager** | Wall lifecycle, spawning, scrolling | Low |
| **Wall** | Single wall pair data + rendering | Low |
| **CollisionDetector** | AABB collision checks | Low |
| **ScoreManager** | Score tracking, localStorage persistence | Low |
| **AudioManager** | Sound playback, mute toggle, persistence | Low |
| **InputHandler** | Keyboard/mouse event capture | Low |
| **Renderer** | All canvas drawing operations | Low |
| **DifficultyManager** | Difficulty curve calculations | Low |

Plus 3 game states: `StartState`, `PlayingState`, `GameOverState`

---

## Game Loop (Fixed Timestep)

```
const FIXED_TIMESTEP = 1000 / 60;  // ~16.67ms
let accumulator = 0;
let lastTime = performance.now();

function loop(currentTime) {
    const frameTime = currentTime - lastTime;
    lastTime = currentTime;
    accumulator += frameTime;

    while (accumulator >= FIXED_TIMESTEP) {
        stateMachine.update(FIXED_TIMESTEP);
        accumulator -= FIXED_TIMESTEP;
    }

    renderer.clear();
    stateMachine.render(ctx);
    requestAnimationFrame(loop);
}
```

---

## State Machine Flow

```
    ┌─────────────┐
    │ StartState  │
    └──────┬──────┘
           │ spacebar / click start
           v
    ┌─────────────┐
    │PlayingState │◄────────┐
    └──────┬──────┘         │
           │ collision      │ restart
           v                │
    ┌─────────────┐         │
    │GameOverState├─────────┘
    └──────┬──────┘
           │ menu
           v
    ┌─────────────┐
    │ StartState  │
    └─────────────┘
```

---

## Data Flow (Playing State)

```
    InputHandler
        │
        │ flap?
        v
    PlayingState ──────► Player.flap()
        │
        │ update tick
        ├──► Player.update(dt)
        ├──► WallManager.update(dt, speed, gap)
        ├──► CollisionDetector.check(player, walls, ground)
        │         │
        │         └──► collision? → transition(gameOver)
        ├──► ScoreManager.increment() (if wall passed)
        ├──► DifficultyManager.getParams(score)
        │
        │ render
        └──► Renderer.draw(player, walls, score, soundToggle)
```

---

## File Structure (Planned)

```
src/
├── main.ts              # Entry point, canvas setup
├── Game.ts              # Game orchestrator + loop
├── StateMachine.ts      # State machine implementation
├── states/
│   ├── GameState.ts     # Interface
│   ├── StartState.ts
│   ├── PlayingState.ts
│   └── GameOverState.ts
├── entities/
│   ├── Player.ts
│   ├── Wall.ts
│   └── WallManager.ts
├── systems/
│   ├── CollisionDetector.ts
│   ├── DifficultyManager.ts
│   ├── ScoreManager.ts
│   └── AudioManager.ts
├── input/
│   └── InputHandler.ts
├── rendering/
│   └── Renderer.ts
└── types/
    └── index.ts         # Shared interfaces (BoundingBox, etc.)
```

---

## Key Interfaces

```typescript
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CollisionResult {
  collided: boolean;
  target: 'wall' | 'ground' | 'none';
}

interface GameState {
  enter(): void;
  exit(): void;
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  handleInput(input: InputHandler): void;
}

type GameStateName = 'start' | 'playing' | 'gameOver';
```

---

## Requirements Coverage

| Requirement | Components Involved |
|---|---|
| FR-01: Ghosty movement | Player, InputHandler |
| FR-02: Wall obstacles | WallManager, Wall, DifficultyManager |
| FR-03: Collision detection | CollisionDetector, Player, WallManager |
| FR-04: Scoring | ScoreManager, WallManager |
| FR-05: Game screens | StateMachine, StartState, PlayingState, GameOverState, Renderer |
| FR-06: Difficulty progression | DifficultyManager |
| FR-07: Audio | AudioManager |
| FR-08: Controls | InputHandler |
| NFR-01: TypeScript | All components (typed) |
| NFR-02: 60 FPS | Game (fixed timestep loop) |
| NFR-04: Minimalist style | Renderer |
