# Flappy Kiro — Domain Entities

## Entity: Player

| Property | Type | Description |
|---|---|---|
| x | number | Horizontal position (logical px) |
| y | number | Vertical position (logical px) |
| width | number | Sprite width (40 px) |
| height | number | Sprite height (40 px) |
| velocityY | number | Vertical velocity (px/tick) |
| sprite | HTMLImageElement | Ghost sprite image |
| collisionInset | number | Collision box inset (4 px per side) |

**Derived**:
- `collisionBox`: { x: x + inset, y: y + inset, width: width - 2*inset, height: height - 2*inset }

---

## Entity: Wall

| Property | Type | Description |
|---|---|---|
| x | number | Horizontal position (logical px) |
| gapY | number | Top of gap (vertical position) |
| gapSize | number | Gap height (px) |
| width | number | Wall width (60 px) |
| canvasHeight | number | Reference to canvas height for bottom wall |
| passed | boolean | Whether player has passed this wall |

**Derived**:
- `topRect`: { x, y: 0, width, height: gapY }
- `bottomRect`: { x, y: gapY + gapSize, width, height: canvasHeight - (gapY + gapSize) }

---

## Entity: GameConfig

| Property | Type | Description |
|---|---|---|
| CANVAS_WIDTH | number | 800 (internal logical width) |
| CANVAS_HEIGHT | number | 600 (internal logical height) |
| GRAVITY | number | 0.5 px/tick |
| FLAP_IMPULSE | number | -8 px/tick |
| TERMINAL_VELOCITY_DOWN | number | 12 px/tick |
| TERMINAL_VELOCITY_UP | number | -10 px/tick |
| GROUND_Y | number | 560 px |
| PLAYER_START_X | number | 150 px |
| PLAYER_START_Y | number | 300 px |
| PLAYER_SIZE | number | 40 px |
| COLLISION_INSET | number | 4 px |
| WALL_WIDTH | number | 60 px |
| WALL_SPACING | number | 300 px |
| FIRST_WALL_X | number | 600 px |
| BASE_SPEED | number | 3 px/tick |
| SPEED_INCREMENT | number | 0.1 px/tick per point |
| MAX_SPEED | number | 8 px/tick |
| BASE_GAP | number | 160 px |
| GAP_REDUCTION | number | 0.5 px per point |
| MIN_GAP | number | 120 px |
| MIN_GAP_MARGIN | number | 80 px (top and bottom) |
| FIXED_TIMESTEP | number | 1000/60 ms (~16.67ms) |

---

## Entity: GameState (Runtime)

| Property | Type | Description |
|---|---|---|
| currentScore | number | Points scored this round |
| highScore | number | All-time best (persisted) |
| soundEnabled | boolean | Audio toggle state (persisted) |
| currentSpeed | number | Current wall scroll speed |
| currentGapSize | number | Current gap size |

---

## Entity: BoundingBox (Value Object)

| Property | Type | Description |
|---|---|---|
| x | number | Left edge |
| y | number | Top edge |
| width | number | Box width |
| height | number | Box height |

---

## Entity: CollisionResult (Value Object)

| Property | Type | Description |
|---|---|---|
| collided | boolean | Whether collision occurred |
| target | 'wall' \| 'ground' \| 'none' | What was hit |

---

## Entity Relationships

```
Game (1) ──owns──► Player (1)
Game (1) ──owns──► WallManager (1) ──manages──► Wall (0..n)
Game (1) ──owns──► ScoreManager (1)
Game (1) ──owns──► AudioManager (1)
Game (1) ──owns──► StateMachine (1) ──contains──► GameState (3)
Game (1) ──owns──► CollisionDetector (1)
Game (1) ──owns──► DifficultyManager (1)
Game (1) ──owns──► InputHandler (1)
Game (1) ──owns──► Renderer (1)

Player (1) ──produces──► BoundingBox (1)
Wall (1) ──produces──► BoundingBox (2) [top + bottom]
CollisionDetector ──consumes──► BoundingBox (n)
CollisionDetector ──produces──► CollisionResult (1)
DifficultyManager ──reads──► currentScore
DifficultyManager ──produces──► { speed, gapSize }
```

---

## Persistence Model

| Key | Type | Default | Component |
|---|---|---|---|
| `flappyKiro_highScore` | string (number) | "0" | ScoreManager |
| `flappyKiro_soundEnabled` | string (boolean) | "true" | AudioManager |
