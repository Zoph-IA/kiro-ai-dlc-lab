# Flappy Kiro — Testable Properties (PBT-01 Compliance)

## Property Identification by Component

---

## Player Physics

### P-01: Gravity Invariant (Invariant)
- **Property**: After any update tick without flap, velocity.y increases by exactly GRAVITY
- **Category**: Invariant
- **Test shape**: `player.update(dt) → newVelocity.y == oldVelocity.y + GRAVITY` (when below terminal velocity)

### P-02: Terminal Velocity Cap (Invariant)
- **Property**: Player velocity.y never exceeds TERMINAL_VELOCITY_DOWN
- **Category**: Invariant
- **Test shape**: For all sequences of update ticks, `player.velocityY <= TERMINAL_VELOCITY_DOWN`

### P-03: Flap Impulse (Invariant)
- **Property**: After flap(), velocity.y equals FLAP_IMPULSE (regardless of previous velocity)
- **Category**: Invariant
- **Test shape**: For any starting velocity, `player.flap() → player.velocityY == FLAP_IMPULSE`

### P-04: Ceiling Clamp (Invariant)
- **Property**: Player position.y is never less than 0
- **Category**: Invariant
- **Test shape**: For all sequences of flaps and updates, `player.y >= 0`

### P-05: Position Update (Invariant)
- **Property**: After update, position.y changes by exactly velocity.y (before clamping)
- **Category**: Invariant
- **Test shape**: `newY == clamp(oldY + velocityY, 0, GROUND_Y - height)`

---

## Collision Detection

### P-06: AABB Commutativity (Commutativity)
- **Property**: `collides(a, b) == collides(b, a)` for all bounding boxes
- **Category**: Commutativity
- **Test shape**: Generate random BoundingBox pairs, verify symmetry

### P-07: AABB Self-Collision (Invariant)
- **Property**: Any non-zero-area bounding box collides with itself
- **Category**: Invariant
- **Test shape**: For all valid BoundingBox, `collides(box, box) == true`

### P-08: AABB Non-Overlapping (Invariant)
- **Property**: Two boxes with no spatial overlap do not collide
- **Category**: Invariant
- **Test shape**: Generate separated boxes, verify `collides(a, b) == false`

### P-09: Ground Collision Consistency (Invariant)
- **Property**: Player at y >= GROUND_Y - height always triggers ground collision
- **Category**: Invariant
- **Test shape**: For all x positions, `checkGroundCollision(player at groundY) == true`

---

## Difficulty Manager

### P-10: Speed Monotonicity (Invariant)
- **Property**: Speed is monotonically non-decreasing with score (until cap)
- **Category**: Invariant
- **Test shape**: For all score1 < score2, `speed(score1) <= speed(score2)`

### P-11: Speed Cap (Invariant)
- **Property**: Speed never exceeds MAX_SPEED regardless of score
- **Category**: Invariant
- **Test shape**: For all scores >= 0, `speed(score) <= MAX_SPEED`

### P-12: Gap Monotonicity (Invariant)
- **Property**: Gap size is monotonically non-increasing with score (until floor)
- **Category**: Invariant
- **Test shape**: For all score1 < score2, `gapSize(score1) >= gapSize(score2)`

### P-13: Gap Floor (Invariant)
- **Property**: Gap size never goes below MIN_GAP regardless of score
- **Category**: Invariant
- **Test shape**: For all scores >= 0, `gapSize(score) >= MIN_GAP`

### P-14: Difficulty Formula Round-Trip (Round-trip)
- **Property**: Given a speed value within range, we can derive the score that produces it
- **Category**: Round-trip
- **Test shape**: `score = (speed - BASE_SPEED) / SPEED_INCREMENT → speed(score) == speed`

---

## Wall Generation

### P-15: Gap Within Bounds (Invariant)
- **Property**: Generated gap position always leaves MIN_GAP_MARGIN from ceiling and ground
- **Category**: Invariant
- **Test shape**: For all generated walls, `gapY >= MIN_GAP_MARGIN AND gapY + gapSize <= CANVAS_HEIGHT - MIN_GAP_MARGIN`

### P-16: Wall Rectangles Cover Full Height (Invariant)
- **Property**: Top wall + gap + bottom wall exactly equals canvas height
- **Category**: Invariant
- **Test shape**: `topRect.height + gapSize + bottomRect.height == CANVAS_HEIGHT`

### P-17: Wall Spacing Consistency (Invariant)
- **Property**: Consecutive walls are always WALL_SPACING apart
- **Category**: Invariant
- **Test shape**: For all adjacent wall pairs, `wall[i+1].x - wall[i].x == WALL_SPACING`

---

## Score Manager

### P-18: Score Non-Negative (Invariant)
- **Property**: Score is always >= 0
- **Category**: Invariant
- **Test shape**: For all sequences of operations, `score >= 0`

### P-19: High Score Monotonicity (Invariant)
- **Property**: High score never decreases
- **Category**: Invariant
- **Test shape**: For all sequences of games, `highScore(after) >= highScore(before)`

### P-20: Score Increment Idempotence Prevention (Invariant)
- **Property**: A wall can only be scored once (marking as passed is idempotent for scoring)
- **Category**: Idempotence
- **Test shape**: `score after passing wall twice == score after passing wall once`

---

## Scaling

### P-21: Scale Factor Preserves Aspect Ratio (Invariant)
- **Property**: Scale factor is uniform (same for x and y)
- **Category**: Invariant
- **Test shape**: For all window sizes, `scaleX == scaleY`

### P-22: Input Coordinate Round-Trip (Round-trip)
- **Property**: Scaling a game coordinate to screen and back yields the original
- **Category**: Round-trip
- **Test shape**: `toGame(toScreen(point)) == point` (within floating point tolerance)

---

## Components with No PBT Properties Identified

| Component | Rationale |
|---|---|
| Renderer | Pure side-effect (canvas drawing), no testable invariants |
| AudioManager | I/O side-effect (audio playback), toggle state is trivial |
| InputHandler | DOM event wrapper, no business logic |
| StateMachine | Transition logic is simple enum-based, covered by example tests |
