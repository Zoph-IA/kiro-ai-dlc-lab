# Integration Test Instructions — Flappy Kiro

## Purpose
Test interactions between game components to ensure they work together correctly as a complete game.

## Integration Test Approach
Since Flappy Kiro is a single-unit client-side application, integration testing is performed manually by playing the game and verifying the complete user flow.

## Manual Integration Test Scenarios

### Scenario 1: Complete Game Flow
- **Description**: Full game lifecycle from start to game over to restart
- **Setup**: Run `npm run dev`, open browser to localhost
- **Test Steps**:
  1. Verify start screen displays (title, high score, sound toggle)
  2. Press spacebar to start game
  3. Verify Ghosty appears and responds to spacebar
  4. Navigate through at least 3 wall pairs
  5. Verify score increments on each pass
  6. Intentionally collide with a wall
  7. Verify game over screen displays (score, high score, restart button)
  8. Press spacebar to restart
  9. Verify game resets cleanly
- **Expected Results**: Smooth transitions, accurate scoring, responsive controls

### Scenario 2: Difficulty Progression
- **Description**: Verify difficulty increases over time
- **Setup**: Run `npm run dev`
- **Test Steps**:
  1. Start game and score 10+ points
  2. Observe wall speed increasing
  3. Observe gap size decreasing slightly
  4. Verify game remains playable (not impossible)
- **Expected Results**: Gradual, noticeable difficulty increase

### Scenario 3: Sound System
- **Description**: Verify audio plays correctly and toggle works
- **Setup**: Run `npm run dev`
- **Test Steps**:
  1. Verify sound toggle visible on start screen
  2. Start game, verify jump sound on spacebar
  3. Collide, verify game over sound
  4. Toggle sound off, restart
  5. Verify no sounds play
  6. Toggle sound on, verify sounds resume
- **Expected Results**: Sounds play/mute correctly, preference persists

### Scenario 4: High Score Persistence
- **Description**: Verify high score saves across sessions
- **Setup**: Run `npm run dev`
- **Test Steps**:
  1. Play game, score some points, die
  2. Note the high score displayed
  3. Close browser tab
  4. Reopen the game
  5. Verify high score is still displayed on start screen
- **Expected Results**: High score persists via localStorage

### Scenario 5: Responsive Scaling
- **Description**: Verify canvas scales correctly on window resize
- **Setup**: Run `npm run dev`
- **Test Steps**:
  1. Open game in browser
  2. Resize window to various sizes
  3. Verify game maintains aspect ratio
  4. Verify game is centered in window
  5. Verify controls still work after resize
- **Expected Results**: Canvas scales uniformly, no distortion

## Running Integration Tests
```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
# Execute manual test scenarios above
```

## Automated Integration Testing (Future)
For future automation, consider:
- Playwright or Cypress for browser automation
- Canvas snapshot testing for visual regression
- Simulated input sequences for gameplay testing
