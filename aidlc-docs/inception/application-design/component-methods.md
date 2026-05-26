# Flappy Kiro — Component Methods

## Game

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor(canvas: HTMLCanvasElement)` | Canvas element | void | Initialize game and all components |
| `start()` | — | void | Begin the game loop |
| `stop()` | — | void | Stop the game loop |
| `reset()` | — | void | Reset all game state for a new round |

---

## StateMachine

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor(states: Map<string, GameState>)` | State map | void | Initialize with available states |
| `transition(stateName: string)` | Target state name | void | Switch to a new state (calls exit/enter) |
| `update(dt: number)` | Delta time (ms) | void | Delegate update to current state |
| `render(ctx: CanvasRenderingContext2D)` | Canvas context | void | Delegate render to current state |
| `getCurrentState()` | — | GameState | Return the active state |

### GameState Interface

| Method | Input | Output | Purpose |
|---|---|---|---|
| `enter()` | — | void | Called when state becomes active |
| `exit()` | — | void | Called when state is deactivated |
| `update(dt: number)` | Delta time (ms) | void | Per-tick logic for this state |
| `render(ctx: CanvasRenderingContext2D)` | Canvas context | void | Draw this state's visuals |
| `handleInput(input: InputEvent)` | Input event | void | Process input for this state |

---

## Player

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor(x: number, y: number, sprite: HTMLImageElement)` | Position, sprite | void | Initialize player |
| `update(dt: number)` | Delta time (ms) | void | Apply gravity, update position |
| `flap()` | — | void | Apply upward impulse |
| `getBoundingBox()` | — | BoundingBox | Return collision rectangle |
| `render(ctx: CanvasRenderingContext2D)` | Canvas context | void | Draw ghost sprite |
| `reset(x: number, y: number)` | Position | void | Reset to starting position |

---

## WallManager

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor(canvasWidth: number, canvasHeight: number)` | Dimensions | void | Initialize wall system |
| `update(dt: number, speed: number, gapSize: number)` | Delta, speed, gap | void | Scroll walls, spawn new, remove old |
| `getWalls()` | — | Wall[] | Return all active walls |
| `getPassedWalls(playerX: number)` | Player X position | Wall[] | Return newly passed walls |
| `reset()` | — | void | Clear all walls |
| `render(ctx: CanvasRenderingContext2D)` | Canvas context | void | Draw all walls |

---

## Wall

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor(x: number, gapY: number, gapSize: number, height: number)` | Position, gap params | void | Create wall pair |
| `getTopRect()` | — | BoundingBox | Top wall bounding box |
| `getBottomRect()` | — | BoundingBox | Bottom wall bounding box |
| `isPassed(playerX: number)` | Player X | boolean | Check if player has passed |
| `markPassed()` | — | void | Mark as scored |
| `render(ctx: CanvasRenderingContext2D)` | Canvas context | void | Draw wall pair |

---

## CollisionDetector

| Method | Input | Output | Purpose |
|---|---|---|---|
| `checkWallCollision(player: BoundingBox, walls: Wall[])` | Player box, walls | CollisionResult | Check player vs walls |
| `checkGroundCollision(player: BoundingBox, groundY: number)` | Player box, ground | boolean | Check player vs ground |
| `checkCeilingCollision(player: BoundingBox)` | Player box | boolean | Check player vs ceiling |

---

## ScoreManager

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor()` | — | void | Load high score from localStorage |
| `increment()` | — | void | Add 1 to current score |
| `getCurrentScore()` | — | number | Return current score |
| `getHighScore()` | — | number | Return persisted high score |
| `isNewHighScore()` | — | boolean | Check if current > high |
| `saveHighScore()` | — | void | Persist high score to localStorage |
| `reset()` | — | void | Reset current score to 0 |

---

## AudioManager

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor()` | — | void | Load audio files, restore sound preference |
| `playJump()` | — | void | Play jump sound effect |
| `playGameOver()` | — | void | Play game over sound effect |
| `toggleSound()` | — | boolean | Toggle mute state, return new state |
| `isSoundEnabled()` | — | boolean | Return current sound state |

---

## InputHandler

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor()` | — | void | Register event listeners |
| `isFlapping()` | — | boolean | Check if spacebar was pressed this frame |
| `isClicking(region: BoundingBox)` | Click region | boolean | Check if click in region |
| `reset()` | — | void | Clear input state for next frame |
| `destroy()` | — | void | Remove event listeners |

---

## Renderer

| Method | Input | Output | Purpose |
|---|---|---|---|
| `constructor(ctx: CanvasRenderingContext2D)` | Canvas context | void | Initialize renderer |
| `clear()` | — | void | Clear entire canvas |
| `drawBackground()` | — | void | Draw game background |
| `drawPlayer(player: Player)` | Player instance | void | Draw ghost sprite |
| `drawWalls(walls: Wall[])` | Wall array | void | Draw all wall pairs |
| `drawScore(score: number)` | Score value | void | Draw score overlay |
| `drawStartScreen(highScore: number, soundOn: boolean)` | High score, sound | void | Draw start screen |
| `drawGameOverScreen(score: number, highScore: number, isNew: boolean)` | Scores | void | Draw game over screen |
| `drawSoundToggle(enabled: boolean)` | Sound state | void | Draw sound button |

---

## Shared Types

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

type GameStateName = 'start' | 'playing' | 'gameOver';
```
