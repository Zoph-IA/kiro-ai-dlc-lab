# Flappy Kiro — Components

## Component Overview

The game uses a class-based OOP architecture with clear separation of concerns. Each component is a TypeScript class in its own file.

---

## Component: Game

**Purpose**: Top-level orchestrator that owns the game loop and coordinates all other components.

**Responsibilities**:
- Initialize canvas and all game components
- Run the fixed-timestep game loop (update) with variable render
- Delegate to the current game state for update/render logic
- Manage the overall lifecycle (start, stop, reset)

---

## Component: StateMachine

**Purpose**: Manage game state transitions between screens (Start, Playing, GameOver).

**Responsibilities**:
- Track current state
- Validate and execute state transitions
- Notify the active state on enter/exit
- Provide state-specific update and render delegation

**States**:
- `StartState` — displays title, high score, start prompt
- `PlayingState` — active gameplay with physics, walls, scoring
- `GameOverState` — displays final score, high score, restart options

---

## Component: Player (Ghosty)

**Purpose**: Represent the player character with physics-based movement.

**Responsibilities**:
- Track position (x, y) and velocity
- Apply gravity each update tick
- Apply upward impulse on flap (spacebar)
- Enforce screen boundaries (ceiling)
- Provide bounding box for collision detection
- Render the ghost sprite on canvas

---

## Component: WallManager

**Purpose**: Manage the lifecycle of wall obstacles (spawning, scrolling, removal).

**Responsibilities**:
- Spawn new wall pairs at intervals
- Scroll walls leftward each tick
- Remove off-screen walls
- Track which walls have been passed (for scoring)
- Apply difficulty scaling (speed, gap size)
- Provide wall bounding boxes for collision detection

---

## Component: Wall

**Purpose**: Represent a single wall pair (top + bottom) with a gap.

**Responsibilities**:
- Store position, gap position, and gap size
- Track whether the player has passed this wall
- Provide top and bottom bounding rectangles
- Render the wall pair on canvas

---

## Component: CollisionDetector

**Purpose**: Detect collisions between the player and walls/ground.

**Responsibilities**:
- Check player bounding box against wall bounding boxes
- Check player position against ground boundary
- Return collision result (hit/no-hit, what was hit)

---

## Component: ScoreManager

**Purpose**: Track current score and persist high score.

**Responsibilities**:
- Increment score when player passes a wall
- Track current game score
- Load/save high score from/to localStorage
- Determine if current score is a new high score

---

## Component: AudioManager

**Purpose**: Manage sound effects and sound toggle state.

**Responsibilities**:
- Load audio assets (jump.wav, game_over.wav)
- Play sound effects on demand
- Toggle sound on/off
- Persist sound preference to localStorage

---

## Component: InputHandler

**Purpose**: Capture and normalize player input.

**Responsibilities**:
- Listen for spacebar keydown events
- Listen for click events (buttons)
- Provide input state to the game loop
- Prevent default browser behavior for game keys

---

## Component: Renderer

**Purpose**: Handle all canvas drawing operations.

**Responsibilities**:
- Clear canvas each frame
- Draw background
- Draw player sprite
- Draw walls
- Draw UI elements (score, buttons, text)
- Draw state-specific screens (start, game over)
