# Flappy Kiro — Requirements Document

## Intent Analysis Summary

- **User Request**: Build a Flappy Bird clone called "Flappy Kiro" featuring a ghost character (Ghosty) navigating through walls with gaps
- **Request Type**: New Project (Greenfield)
- **Scope Estimate**: Single application (browser-based game)
- **Complexity Estimate**: Moderate — game loop, physics simulation, collision detection, scoring, progressive difficulty, UI screens, audio

---

## Functional Requirements

### FR-01: Game Character (Ghosty)
- The player controls a ghost character called "Ghosty"
- Ghosty moves persistently to the right (horizontal scrolling)
- Ghosty automatically descends due to gravity
- Ghosty ascends when the player presses the spacebar
- Ghosty uses the existing `assets/ghosty.png` sprite

### FR-02: Wall Obstacles
- Walls appear as vertical barriers with a gap for Ghosty to pass through
- Gaps are equally sized across all wall pairs
- Gap vertical position is randomized for each wall pair
- Walls scroll from right to left (relative to Ghosty's rightward movement)
- Wall spacing and speed increase gradually over time (see FR-06)

### FR-03: Collision Detection
- Colliding with a wall ends the game
- Colliding with the ground ends the game
- Ghosty cannot fly above the top of the screen (ceiling boundary)
- Collision detection must be accurate to the visual representation

### FR-04: Scoring
- Each successful pass through a pair of walls awards one point
- Score is displayed during gameplay
- High score is persisted in browser localStorage

### FR-05: Game Screens and Flow
- **Start Screen**: Game title "Flappy Kiro", start button/prompt, high score display, sound toggle
- **Gameplay Screen**: Active game with score overlay, sound toggle accessible
- **Game Over Screen**: Final score, high score, restart button, return to start screen option

### FR-06: Difficulty Progression
- Difficulty increases gradually over time
- Walls speed up as the game progresses
- Gaps may shrink slightly as score increases
- Difficulty curve should feel fair and gradual (not sudden spikes)

### FR-07: Audio
- Jump sound effect plays when spacebar is pressed (`assets/jump.wav`)
- Game over sound effect plays on collision (`assets/game_over.wav`)
- Sound can be toggled on/off via a UI control
- Sound preference persists across sessions (localStorage)

### FR-08: Controls
- Spacebar: Make Ghosty ascend (flap)
- Click/tap on start button to begin game
- Click/tap on restart button after game over
- Sound toggle button accessible at all times

---

## Non-Functional Requirements

### NFR-01: Technology Stack
- HTML5 Canvas for rendering
- TypeScript for game logic (type safety)
- No external game framework dependencies
- Modern ES module structure

### NFR-02: Performance
- Smooth 60 FPS gameplay on modern desktop browsers
- Efficient rendering using requestAnimationFrame
- No memory leaks during extended play sessions

### NFR-03: Platform
- Desktop web browser only
- Target browsers: Chrome, Firefox, Edge, Safari (latest versions)
- Minimum resolution: 800x600

### NFR-04: Visual Style
- Clean modern minimalist aesthetic
- Simple geometric shapes for walls
- Smooth animations and transitions
- Clear visual feedback for scoring and game state changes

### NFR-05: Code Quality
- TypeScript strict mode enabled
- Modular architecture with clear separation of concerns
- Well-documented code with JSDoc comments

### NFR-06: Build and Development
- TypeScript compilation to JavaScript
- Simple build process (no complex bundler required for MVP)
- Development server for local testing

---

## Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | Yes | Requirements Analysis |
| Property-Based Testing | Yes (Full) | Requirements Analysis |

---

## Assets Inventory

| Asset | Path | Usage |
|---|---|---|
| Ghost sprite | `assets/ghosty.png` | Player character |
| Jump sound | `assets/jump.wav` | Spacebar press feedback |
| Game over sound | `assets/game_over.wav` | Collision/death event |

---

## Constraints

- Must use existing assets from the workspace
- Desktop-only (no mobile/touch controls required)
- No server-side components — purely client-side
- No external CDN dependencies for core game logic
