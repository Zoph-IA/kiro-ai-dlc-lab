# Flappy Kiro — Business Rules

## BR-01: Gravity Application
- **Rule**: Gravity is applied to player velocity every fixed update tick
- **Formula**: `velocity.y += GRAVITY` (0.5 px/tick)
- **Constraint**: velocity.y capped at TERMINAL_VELOCITY_DOWN (12 px/tick)

## BR-02: Flap Mechanics
- **Rule**: On spacebar press, player velocity is set to FLAP_IMPULSE
- **Formula**: `velocity.y = FLAP_IMPULSE` (-8 px/tick) — replaces current velocity, not additive
- **Constraint**: velocity.y capped at TERMINAL_VELOCITY_UP (-10 px/tick)
- **Constraint**: Flap only works during PlayingState

## BR-03: Position Update
- **Rule**: Player position updated by velocity each tick
- **Formula**: `position.y += velocity.y`
- **Constraint**: position.y clamped to [0, groundY - playerHeight]

## BR-04: Ceiling Behavior
- **Rule**: Player cannot pass above the ceiling
- **Action**: Clamp position.y to 0, set velocity.y to 0
- **Note**: Ceiling contact does NOT end the game

## BR-05: Ground Collision
- **Rule**: Player touching or passing below ground ends the game
- **Condition**: `player.y + player.height >= GROUND_Y`
- **Action**: Transition to GameOverState

## BR-06: Wall Collision
- **Rule**: Player overlapping any wall rectangle ends the game
- **Condition**: AABB intersection between player collision box and any wall rectangle
- **Action**: Transition to GameOverState

## BR-07: Score Increment
- **Rule**: Score increases by 1 when player passes a wall pair
- **Condition**: `player.x + player.width > wall.x + wall.width` AND `wall.passed === false`
- **Action**: Set `wall.passed = true`, increment score by 1
- **Constraint**: Each wall pair can only award 1 point

## BR-08: High Score Update
- **Rule**: High score is updated only when current score exceeds stored high score
- **Condition**: `currentScore > highScore`
- **Action**: Update highScore, persist to localStorage
- **Timing**: On GameOverState entry

## BR-09: Wall Spawning
- **Rule**: New wall spawns when the rightmost wall is at least WALL_SPACING from the right edge
- **Condition**: `rightmostWall.x <= canvasWidth - WALL_SPACING`
- **Action**: Create new Wall at x = canvasWidth with random gap position

## BR-10: Wall Removal
- **Rule**: Walls are removed when fully off-screen
- **Condition**: `wall.x + WALL_WIDTH < 0`
- **Action**: Remove wall from active wall list

## BR-11: Difficulty Scaling
- **Rule**: Speed and gap size adjust linearly with score
- **Speed**: `currentSpeed = min(MAX_SPEED, BASE_SPEED + SPEED_INCREMENT * score)`
- **Gap**: `currentGap = max(MIN_GAP, BASE_GAP - GAP_REDUCTION * score)`
- **Constraint**: Speed never exceeds MAX_SPEED, gap never below MIN_GAP

## BR-12: Gap Randomization
- **Rule**: Gap vertical position is uniformly random within valid bounds
- **Bounds**: `gapY ∈ [MIN_GAP_TOP, canvasHeight - gapSize - MIN_GAP_BOTTOM]`
- **Constraint**: MIN_GAP_TOP = MIN_GAP_BOTTOM = 80px

## BR-13: Sound Toggle
- **Rule**: Sound toggle immediately enables/disables all audio playback
- **Action**: Toggle `soundEnabled` flag, persist to localStorage
- **Default**: `soundEnabled = true` on first visit

## BR-14: Game Reset
- **Rule**: On new game start, all game state resets to initial values
- **Resets**: Player position, velocity, score, walls cleared, difficulty to base values
- **Preserves**: High score, sound preference

## BR-15: Input Debouncing
- **Rule**: Spacebar flap is consumed once per press (not held)
- **Mechanism**: Track keydown event, clear after processing
- **Constraint**: Holding spacebar does not continuously flap

## BR-16: Responsive Scaling
- **Rule**: Game renders at internal 800x600 resolution, scaled to fit window
- **Scale factor**: `min(windowWidth / 800, windowHeight / 600)`
- **Constraint**: Maintain aspect ratio (letterbox if needed)
- **Input mapping**: Mouse/click coordinates must be inverse-scaled to game coordinates
