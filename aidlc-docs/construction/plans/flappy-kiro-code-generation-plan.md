# Code Generation Plan — Flappy Kiro

## Unit Context
- **Unit**: flappy-kiro (single unit — entire game)
- **Project Type**: Greenfield single unit
- **Code Location**: `f:\kiro-ai-dlc-lab\` (workspace root)
- **Source Directory**: `src/`
- **Test Directory**: `tests/`
- **Stories Covered**: US-01 through US-12

## Story Traceability

| Step | Stories Implemented |
|---|---|
| Step 1 | — (project setup) |
| Step 2 | — (shared types) |
| Step 3 | US-03 (Ghosty movement) |
| Step 4 | US-04 (walls) |
| Step 5 | US-03, US-07 (collision) |
| Step 6 | US-05, US-10 (scoring) |
| Step 7 | US-06 (difficulty) |
| Step 8 | US-11, US-12 (audio) |
| Step 9 | US-08 (controls) |
| Step 10 | US-01, US-02, US-08, US-09 (states) |
| Step 11 | — (rendering) |
| Step 12 | — (game loop + orchestrator) |
| Step 13 | US-01, US-02 (entry point + HTML) |
| Step 14 | — (config files) |
| Step 15 | — (unit tests — example-based) |
| Step 16 | — (property-based tests) |
| Step 17 | — (documentation summary) |

---

## Code Generation Steps

- [x] **Step 1**: Project Structure Setup
  - Create directory structure: `src/`, `src/states/`, `src/entities/`, `src/systems/`, `src/input/`, `src/rendering/`, `src/types/`, `tests/`, `tests/unit/`, `tests/pbt/`
  - Create `package.json` with all dependencies (pinned versions) and scripts
  - Create `tsconfig.json` with strict mode
  - Create `vite.config.ts` with security headers
  - Create `.eslintrc.cjs` and `.prettierrc`

- [x] **Step 2**: Shared Types and Constants
  - Create `src/types/index.ts` (BoundingBox, CollisionResult, GameStateName, GameConfig)
  - Create `src/types/config.ts` (all game constants from functional design)

- [x] **Step 3**: Player Entity (US-03)
  - Create `src/entities/Player.ts`
  - Implements: gravity, flap, position update, ceiling clamp, bounding box
  - References: BR-01, BR-02, BR-03, BR-04

- [x] **Step 4**: Wall Entities (US-04)
  - Create `src/entities/Wall.ts`
  - Create `src/entities/WallManager.ts`
  - Implements: wall pair data, spawning, scrolling, removal, gap randomization
  - References: BR-09, BR-10, BR-12

- [x] **Step 5**: Collision Detection System (US-03, US-07)
  - Create `src/systems/CollisionDetector.ts`
  - Implements: AABB intersection, ground check, ceiling check, wall check
  - References: BR-05, BR-06

- [x] **Step 6**: Score Manager (US-05, US-10)
  - Create `src/systems/ScoreManager.ts`
  - Implements: increment, high score persistence, localStorage read/write
  - References: BR-07, BR-08

- [x] **Step 7**: Difficulty Manager (US-06)
  - Create `src/systems/DifficultyManager.ts`
  - Implements: linear speed formula, gap reduction formula, caps
  - References: BR-11

- [x] **Step 8**: Audio Manager (US-11, US-12)
  - Create `src/systems/AudioManager.ts`
  - Implements: sound playback, toggle, persistence
  - References: BR-13

- [x] **Step 9**: Input Handler (US-08)
  - Create `src/input/InputHandler.ts`
  - Implements: spacebar detection, click detection, debouncing
  - References: BR-15

- [x] **Step 10**: Game States (US-01, US-02, US-08, US-09)
  - Create `src/states/GameState.ts` (interface)
  - Create `src/states/StartState.ts`
  - Create `src/states/PlayingState.ts`
  - Create `src/states/GameOverState.ts`
  - Create `src/StateMachine.ts`
  - Implements: state transitions, enter/exit, update/render delegation
  - References: BR-14, state machine from functional design

- [x] **Step 11**: Renderer
  - Create `src/rendering/Renderer.ts`
  - Implements: clear, background, player, walls, score, start screen, game over screen, sound toggle
  - References: NFR-PERF-02, responsive scaling (BR-16)

- [x] **Step 12**: Game Orchestrator
  - Create `src/Game.ts`
  - Implements: fixed-timestep loop, component initialization, state machine coordination
  - References: NFR-PERF-01, game loop from application design

- [x] **Step 13**: Entry Point and HTML
  - Create `src/main.ts` (canvas setup, asset loading, Game instantiation)
  - Create `index.html` (canvas element, minimal markup)
  - Copy assets reference (ghosty.png, jump.wav, game_over.wav)
  - Add `data-testid` attributes to interactive elements

- [x] **Step 14**: Configuration Files
  - Create `tsconfig.json` (strict, ES2020, ESNext modules)
  - Create `vite.config.ts` (security headers, asset handling)
  - Create `.eslintrc.cjs` (TypeScript rules)
  - Create `.prettierrc` (2-space, single quotes, trailing commas)
  - Create `.gitignore` updates (node_modules, dist)

- [x] **Step 15**: Unit Tests (Example-Based)
  - Create `tests/unit/Player.test.ts`
  - Create `tests/unit/CollisionDetector.test.ts`
  - Create `tests/unit/ScoreManager.test.ts`
  - Create `tests/unit/DifficultyManager.test.ts`
  - Create `tests/unit/WallManager.test.ts`
  - Create `tests/unit/StateMachine.test.ts`
  - Cover critical business scenarios from user stories (PBT-10 compliance)

- [x] **Step 16**: Property-Based Tests (PBT)
  - Create `tests/pbt/Player.pbt.test.ts` (P-01 through P-05)
  - Create `tests/pbt/CollisionDetector.pbt.test.ts` (P-06 through P-09)
  - Create `tests/pbt/DifficultyManager.pbt.test.ts` (P-10 through P-14)
  - Create `tests/pbt/WallManager.pbt.test.ts` (P-15 through P-17)
  - Create `tests/pbt/ScoreManager.pbt.test.ts` (P-18 through P-20)
  - Create `tests/pbt/Scaling.pbt.test.ts` (P-21, P-22)
  - Create `tests/pbt/generators.ts` (domain-specific generators — PBT-07)
  - All 22 properties from testable-properties.md covered

- [x] **Step 17**: Documentation Summary
  - Create `aidlc-docs/construction/flappy-kiro/code/code-summary.md`
  - Document file structure, key decisions, story coverage
