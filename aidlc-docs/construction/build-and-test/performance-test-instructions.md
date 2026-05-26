# Performance Test Instructions — Flappy Kiro

## Purpose
Validate the game maintains 60 FPS during gameplay on target browsers.

## Performance Requirements
- **Frame Rate**: 60 FPS (16.67ms per frame)
- **Update Budget**: < 8ms per fixed-timestep update
- **Render Budget**: < 8ms per render frame
- **Memory**: No growth over extended play (no memory leaks)
- **Asset Load Time**: < 2 seconds on broadband

## Manual Performance Testing

### Test 1: Frame Rate Monitoring
- **Setup**: Open game in Chrome, open DevTools (F12) → Performance tab
- **Steps**:
  1. Start recording performance
  2. Play game for 60+ seconds
  3. Stop recording
  4. Analyze frame timing chart
- **Expected**: Consistent 16.67ms frames, no spikes > 33ms

### Test 2: Memory Leak Detection
- **Setup**: Open game in Chrome, open DevTools → Memory tab
- **Steps**:
  1. Take heap snapshot
  2. Play 5 games (start → die → restart)
  3. Take another heap snapshot
  4. Compare snapshots
- **Expected**: No significant heap growth between snapshots. Wall objects should be garbage collected after removal.

### Test 3: Long Session Stability
- **Setup**: Open game, let it run
- **Steps**:
  1. Play continuously for 5+ minutes
  2. Monitor Task Manager for memory usage
  3. Check for frame drops or stuttering
- **Expected**: Stable memory, consistent frame rate

### Test 4: Asset Loading Performance
- **Setup**: Open DevTools → Network tab, disable cache
- **Steps**:
  1. Hard refresh the page
  2. Observe network waterfall
  3. Note total load time
- **Expected**: All assets loaded in < 2 seconds, total bundle < 500KB

## Browser-Specific Testing

| Browser | Version | Test |
|---|---|---|
| Chrome | 90+ | Full performance profiling |
| Firefox | 90+ | Frame rate check |
| Edge | 90+ | Frame rate check |
| Safari | 15+ | Frame rate check |

## Performance Optimization Checklist
- [x] Fixed-timestep loop prevents physics drift
- [x] No object allocation in game loop (reuse patterns)
- [x] Walls removed when off-screen (no unbounded growth)
- [x] Single canvas context (no context switching)
- [x] Sprite loaded once, drawn by reference
- [x] requestAnimationFrame for render timing
