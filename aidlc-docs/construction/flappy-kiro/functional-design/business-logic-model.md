# Flappy Kiro — Business Logic Model

## Game Physics Model

### Canvas
- **Size**: Responsive — fills browser window
- **Aspect ratio**: Maintains playable proportions via internal game coordinate system
- **Internal resolution**: 800 x 600 logical units (scaled to fit window)
- **Scaling**: Uniform scale factor = min(windowWidth/800, windowHeight/600)

### Gravity and Movement
- **Gravity acceleration**: 0.5 px/tick (applied every fixed update)
- **Flap impulse**: -8 px/tick (negative = upward, applied instantly on spacebar)
- **Terminal velocity (down)**: 12 px/tick (cap to prevent tunneling through walls)
- **Terminal velocity (up)**: -10 px/tick (cap to prevent overshooting ceiling)
- **Horizontal movement**: Ghosty is stationary; world scrolls left (simulates rightward movement)

### Player Dimensions
- **Sprite size**: 40 x 40 px (logical units)
- **Collision box**: 32 x 32 px (slightly smaller than sprite for fairness — 4px inset on each side)
- **Starting position**: x = 150, y = 300 (left-center of screen)

### Screen Boundaries
- **Ceiling**: y = 0 (player position clamped, velocity zeroed on contact)
- **Ground**: y = 560 (canvas height - 40px ground zone)
- **Ground collision**: Triggers game over

---

## Wall Generation Rules

### Wall Dimensions
- **Wall width**: 60 px
- **Gap size (initial)**: 160 px (vertical space between top and bottom wall)
- **Gap size (minimum)**: 120 px (never shrinks below this)
- **Gap reduction rate**: -0.5 px per point scored (linear)

### Wall Spacing
- **Horizontal distance between walls**: 300 px (fixed)
- **First wall spawn**: x = 600 (gives player time to orient)

### Gap Positioning
- **Minimum gap top**: 80 px from ceiling (ensures top wall is visible)
- **Maximum gap bottom**: 80 px from ground (ensures bottom wall is visible)
- **Randomization**: Uniform random within [minGapTop, canvasHeight - gapSize - maxGapBottom]

### Wall Lifecycle
- **Spawn trigger**: When rightmost wall is 300px from right edge, spawn next
- **Removal**: When wall.x + wallWidth < 0 (fully off-screen left)

---

## Difficulty Progression (Linear)

### Formula
```
speed(score) = BASE_SPEED + (SPEED_INCREMENT * score)
gapSize(score) = max(MIN_GAP, BASE_GAP - (GAP_REDUCTION * score))
```

### Constants
| Parameter | Value | Description |
|---|---|---|
| BASE_SPEED | 3 px/tick | Initial wall scroll speed |
| SPEED_INCREMENT | 0.1 px/tick per point | Speed increase per point |
| MAX_SPEED | 8 px/tick | Speed cap |
| BASE_GAP | 160 px | Initial gap size |
| GAP_REDUCTION | 0.5 px per point | Gap shrinkage per point |
| MIN_GAP | 120 px | Minimum gap size |

### Effective Difficulty at Key Scores
| Score | Speed | Gap Size | Notes |
|---|---|---|---|
| 0 | 3.0 | 160 | Starting difficulty |
| 10 | 4.0 | 155 | Noticeable but manageable |
| 20 | 5.0 | 150 | Moderate challenge |
| 30 | 6.0 | 145 | Skilled play required |
| 50 | 8.0 (capped) | 135 | Near maximum difficulty |
| 80 | 8.0 (capped) | 120 (capped) | Maximum difficulty plateau |

---

## State Machine Transitions

### States and Transitions

| From State | Event | To State | Side Effects |
|---|---|---|---|
| Start | spacebar OR click start | Playing | Reset game, start loop |
| Playing | collision (wall or ground) | GameOver | Play game over sound, save high score |
| GameOver | spacebar OR click restart | Playing | Reset game, start loop |
| GameOver | click menu | Start | Reset game |

### State Entry/Exit Actions

**StartState.enter()**:
- Display title, high score, sound toggle
- Listen for start input

**PlayingState.enter()**:
- Reset player position
- Clear all walls
- Reset score to 0
- Reset difficulty to base values
- Begin spawning walls

**PlayingState.exit()**:
- Stop wall spawning

**GameOverState.enter()**:
- Play game over sound
- Check and save high score
- Display final score, high score, new high score indicator
- Listen for restart/menu input

---

## Scoring Rules

### Point Award
- **Trigger**: Player's right edge (x + width) passes wall's right edge (wall.x + wallWidth)
- **Award**: +1 point per wall pair
- **Constraint**: Each wall can only award points once (tracked via `wall.passed` flag)

### High Score Persistence
- **Storage key**: `flappyKiro_highScore`
- **Save trigger**: On game over, if currentScore > highScore
- **Load trigger**: On game initialization
- **Default value**: 0 (if no stored value)

---

## Audio Trigger Rules

| Event | Sound | Condition |
|---|---|---|
| Spacebar press (during Playing) | jump.wav | Sound enabled |
| Collision detected | game_over.wav | Sound enabled |

### Sound Toggle
- **Storage key**: `flappyKiro_soundEnabled`
- **Default**: true (sound on for first-time players)
- **Toggle**: Immediate effect, persisted to localStorage
- **Visual indicator**: Speaker icon (on/off state)

---

## Collision Detection Algorithm

### AABB (Axis-Aligned Bounding Box) Intersection
```
collides(a: BoundingBox, b: BoundingBox): boolean =
    a.x < b.x + b.width AND
    a.x + a.width > b.x AND
    a.y < b.y + b.height AND
    a.y + a.height > b.y
```

### Collision Checks Per Frame (in order)
1. Player vs Ground (y + height >= groundY) → game over
2. Player vs Ceiling (y <= 0) → clamp position, zero velocity (NOT game over)
3. Player vs each wall's top rectangle → game over
4. Player vs each wall's bottom rectangle → game over

### Collision Box Fairness
- Player collision box is 4px smaller on each side than the sprite
- This prevents "unfair" deaths where the sprite visually clears but the box clips
