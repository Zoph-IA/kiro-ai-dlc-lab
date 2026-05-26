# Flappy Kiro — User Stories

Organization: User Journey-Based (launch → play → game over → replay)
Granularity: Medium
Acceptance Criteria: Checklist format
Persona: Alex (Casual Desktop Gamer)

---

## Epic 1: Game Launch and Start

### US-01: View Start Screen
**As** Alex, **I want** to see a welcoming start screen when I open the game **so that** I know what the game is and how to begin.

**Acceptance Criteria:**
- [ ] Game title "Flappy Kiro" is displayed prominently
- [ ] A "Start" or "Play" button/prompt is visible
- [ ] Current high score is displayed (or "0" if no previous score)
- [ ] Sound toggle button is visible and accessible
- [ ] Ghosty character is visible on the start screen

### US-02: Start the Game
**As** Alex, **I want** to start the game by clicking a start button or pressing spacebar **so that** I can begin playing immediately.

**Acceptance Criteria:**
- [ ] Clicking the start button transitions to gameplay
- [ ] Pressing spacebar also starts the game from the start screen
- [ ] Transition to gameplay is smooth (no jarring jumps)
- [ ] Score resets to 0 when a new game begins

---

## Epic 2: Core Gameplay

### US-03: Control Ghosty's Movement
**As** Alex, **I want** Ghosty to respond to my spacebar presses by ascending **so that** I feel in control of the character.

**Acceptance Criteria:**
- [ ] Pressing spacebar causes Ghosty to move upward (flap)
- [ ] Ghosty descends automatically when spacebar is not pressed (gravity)
- [ ] Controls feel responsive with no noticeable input delay
- [ ] Ghosty cannot fly above the top of the screen (ceiling boundary)
- [ ] Jump sound plays on each spacebar press (when sound is enabled)

### US-04: Navigate Through Walls
**As** Alex, **I want** to guide Ghosty through gaps in walls **so that** I can keep playing and score points.

**Acceptance Criteria:**
- [ ] Walls appear from the right side of the screen and scroll left
- [ ] Each wall pair has a gap large enough for Ghosty to pass through
- [ ] Gap positions are randomized vertically for each wall pair
- [ ] Walls are evenly spaced horizontally
- [ ] Walls are visually distinct from the background

### US-05: Score Points
**As** Alex, **I want** to earn a point each time I pass through a wall pair **so that** I can track my progress during the game.

**Acceptance Criteria:**
- [ ] Score increases by 1 when Ghosty fully passes a wall pair
- [ ] Current score is displayed on screen during gameplay
- [ ] Score display is readable and doesn't obstruct gameplay
- [ ] Score only increments once per wall pair (no double-counting)

### US-06: Experience Increasing Difficulty
**As** Alex, **I want** the game to gradually get harder **so that** I stay challenged and engaged as I improve.

**Acceptance Criteria:**
- [ ] Wall scroll speed increases gradually as score increases
- [ ] Gap size may decrease slightly at higher scores
- [ ] Difficulty progression feels gradual (no sudden spikes)
- [ ] Game remains playable at higher difficulties (not impossible)

---

## Epic 3: Collision and Game Over

### US-07: Collide and End Game
**As** Alex, **I want** the game to end clearly when Ghosty hits a wall or the ground **so that** I understand why the game ended.

**Acceptance Criteria:**
- [ ] Colliding with a wall immediately ends the game
- [ ] Colliding with the ground immediately ends the game
- [ ] Game over sound plays on collision (when sound is enabled)
- [ ] Collision detection is fair and matches visual representation
- [ ] Game freezes or transitions smoothly to game over state

### US-08: View Game Over Screen
**As** Alex, **I want** to see my final score and high score after dying **so that** I know how well I did.

**Acceptance Criteria:**
- [ ] Final score for the current run is displayed
- [ ] All-time high score is displayed
- [ ] If current score is a new high score, it is highlighted or indicated
- [ ] Restart button is visible and accessible
- [ ] Option to return to start screen is available

---

## Epic 4: Replay and Persistence

### US-09: Restart Quickly
**As** Alex, **I want** to restart the game quickly after dying **so that** I can try again without delay.

**Acceptance Criteria:**
- [ ] Clicking restart button begins a new game immediately
- [ ] Pressing spacebar on game over screen also restarts
- [ ] Game state fully resets (score, position, walls, difficulty)
- [ ] Restart transition is fast and smooth

### US-10: Persist High Score
**As** Alex, **I want** my high score to be saved between sessions **so that** I can track my best performance over time.

**Acceptance Criteria:**
- [ ] High score is saved to browser localStorage
- [ ] High score persists after closing and reopening the browser
- [ ] High score updates only when current score exceeds it
- [ ] High score is displayed on start screen and game over screen

---

## Epic 5: Audio and Settings

### US-11: Hear Sound Feedback
**As** Alex, **I want** to hear sound effects during gameplay **so that** I get satisfying feedback for my actions.

**Acceptance Criteria:**
- [ ] Jump sound (`jump.wav`) plays on each spacebar press
- [ ] Game over sound (`game_over.wav`) plays on collision
- [ ] Sounds play without noticeable delay
- [ ] Sounds don't overlap or cause audio glitches

### US-12: Toggle Sound On/Off
**As** Alex, **I want** to mute and unmute game sounds **so that** I can play silently when needed.

**Acceptance Criteria:**
- [ ] Sound toggle button is accessible on all screens (start, gameplay, game over)
- [ ] Clicking toggle immediately mutes/unmutes all sounds
- [ ] Toggle state is visually indicated (icon change or label)
- [ ] Sound preference persists across sessions (localStorage)
- [ ] Game defaults to sound-on for first-time players

---

## Story-Persona Mapping

| Story | Persona: Alex |
|---|---|
| US-01: View Start Screen | ✓ |
| US-02: Start the Game | ✓ |
| US-03: Control Ghosty's Movement | ✓ |
| US-04: Navigate Through Walls | ✓ |
| US-05: Score Points | ✓ |
| US-06: Experience Increasing Difficulty | ✓ |
| US-07: Collide and End Game | ✓ |
| US-08: View Game Over Screen | ✓ |
| US-09: Restart Quickly | ✓ |
| US-10: Persist High Score | ✓ |
| US-11: Hear Sound Feedback | ✓ |
| US-12: Toggle Sound On/Off | ✓ |

---

## INVEST Criteria Verification

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable |
|---|---|---|---|---|---|---|
| US-01 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-02 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-03 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-04 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-05 | Depends on US-04 | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-06 | Depends on US-04 | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-07 | Depends on US-03/04 | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-08 | Depends on US-07 | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-09 | Depends on US-08 | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-10 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-11 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-12 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Note: Some stories have logical dependencies (can't score without walls, can't die without collision), but each is independently implementable and testable in isolation with mocked dependencies.
