# Unit Test Execution — Flappy Kiro

## Run All Tests
```bash
npm test
```

## Run Tests in Watch Mode (Development)
```bash
npm run test:watch
```

## Run with Coverage
```bash
npm run test:coverage
```

## Test Structure

### Example-Based Tests (`tests/unit/`)
| File | Tests | Coverage |
|---|---|---|
| Player.test.ts | 10 | Player physics, flap, ceiling, reset |
| CollisionDetector.test.ts | 12 | AABB intersection, ground, wall collision |
| ScoreManager.test.ts | 12 | Score increment, high score, localStorage |
| DifficultyManager.test.ts | 8 | Speed/gap formulas, caps |
| WallManager.test.ts | 7 | Spawn, scroll, removal, scoring |
| StateMachine.test.ts | 5 | State transitions, delegation |

### Property-Based Tests (`tests/pbt/`)
| File | Properties | Coverage |
|---|---|---|
| Player.pbt.test.ts | P-01 to P-05 | Gravity, terminal velocity, flap, ceiling, position |
| CollisionDetector.pbt.test.ts | P-06 to P-09 | Commutativity, self-collision, separation, ground |
| DifficultyManager.pbt.test.ts | P-10 to P-14 | Monotonicity, caps, round-trip |
| WallManager.pbt.test.ts | P-15 to P-17 | Gap bounds, height coverage, spacing |
| ScoreManager.pbt.test.ts | P-18 to P-20 | Non-negative, monotonic high score, increment |
| Scaling.pbt.test.ts | P-21 to P-22 | Aspect ratio, coordinate round-trip |

## Expected Results
- **Total Tests**: 76
- **Passed**: 76
- **Failed**: 0
- **Test Duration**: ~2 seconds

## PBT Seed Reproduction (PBT-08)
If a property-based test fails, fast-check logs the seed:
```
Property failed after X tests
Seed: [seed-value]
Shrunk counterexample: [minimal failing input]
```

To reproduce:
```typescript
fc.assert(fc.property(...), { seed: [seed-value] });
```

## Fix Failing Tests
1. Read the test output to identify the failing assertion
2. For PBT failures: note the shrunk counterexample (minimal failing input)
3. Fix the source code to satisfy the property/assertion
4. Re-run tests: `npm test`
5. For PBT regressions: add the shrunk example as a permanent example-based test (PBT-10)
