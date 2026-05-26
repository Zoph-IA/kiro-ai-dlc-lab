# Flappy Kiro — Non-Functional Requirements

## NFR-PERF-01: Frame Rate
- **Target**: 60 FPS (16.67ms per frame)
- **Frame budget**: Update logic must complete within 8ms to leave headroom for rendering
- **Measurement**: requestAnimationFrame timing, no dropped frames during normal gameplay
- **Degradation**: If frame drops occur, game logic uses fixed timestep (physics remain consistent)

## NFR-PERF-02: Rendering Performance
- **Canvas operations**: Minimize draw calls per frame
- **Sprite caching**: Load images once, reuse references
- **No garbage collection pressure**: Avoid allocating objects in the game loop (reuse BoundingBox instances)
- **Wall pool**: Consider object pooling for walls if GC pauses are observed

## NFR-PERF-03: Asset Loading
- **Initial load**: All assets (sprite, sounds) loaded before game starts
- **Loading indicator**: Show loading state until all assets are ready
- **Asset size budget**: Total assets < 500KB (sprite + 2 sound files)

---

## NFR-SEC-01: HTTP Security Headers (SECURITY-04)
- **Content-Security-Policy**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; media-src 'self'`
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains`
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Implementation**: Vite dev server headers config + production deployment headers

Note: `unsafe-inline` for style-src is justified because Canvas games often need inline styles for canvas sizing. CSP does not use `unsafe-eval`.

## NFR-SEC-02: Supply Chain Security (SECURITY-10)
- **Lock file**: `package-lock.json` committed to version control
- **Pinned versions**: All dependencies use exact versions in package.json
- **Minimal dependencies**: Only essential dev dependencies (Vite, TypeScript, Vitest, fast-check, ESLint, Prettier)
- **No runtime dependencies**: Game has zero production npm dependencies (pure TypeScript compiled to JS)
- **Vulnerability scanning**: `npm audit` included in build instructions

## NFR-SEC-03: Input Validation (SECURITY-05)
- **localStorage reads**: Validate stored values before use (high score must be non-negative integer, sound preference must be "true"/"false")
- **No user-generated content**: Game has no text input fields or user-submitted data
- **No network requests**: Purely offline client-side application

## NFR-SEC-04: Error Handling (SECURITY-15)
- **Global error handler**: window.onerror and unhandledrejection handlers
- **Asset load failures**: Graceful fallback (game still playable without sound)
- **localStorage unavailable**: Graceful degradation (no persistence, game still works)
- **No stack traces exposed**: Error handler logs to console only in development

---

## NFR-QUAL-01: TypeScript Configuration
- **Strict mode**: `strict: true` in tsconfig.json
- **No implicit any**: `noImplicitAny: true`
- **Strict null checks**: `strictNullChecks: true`
- **Module system**: ES modules (`"module": "ESNext"`)
- **Target**: `"target": "ES2020"` (modern browsers)

## NFR-QUAL-02: Code Organization
- **One class per file**: Each component in its own .ts file
- **Barrel exports**: index.ts files for directory re-exports
- **JSDoc comments**: All public methods documented
- **Consistent naming**: PascalCase for classes, camelCase for methods/variables

## NFR-QUAL-03: Linting and Formatting
- **ESLint**: TypeScript-aware rules, no-unused-vars, consistent-return
- **Prettier**: Consistent formatting (2-space indent, single quotes, trailing commas)
- **Pre-commit**: Lint and format checks in build instructions

---

## NFR-COMPAT-01: Browser Support
- **Target browsers**: Chrome 90+, Firefox 90+, Edge 90+, Safari 15+
- **Required APIs**: Canvas 2D, requestAnimationFrame, localStorage, Audio
- **No polyfills needed**: All target browsers support ES2020+ and required APIs

## NFR-COMPAT-02: Responsive Display
- **Scaling**: Canvas scales to fit browser window maintaining aspect ratio
- **Minimum window**: 400x300 (below this, game may be difficult to play)
- **Resize handling**: Canvas re-scales on window resize event

---

## NFR-TEST-01: Test Coverage
- **Unit tests**: All pure logic components (Player physics, CollisionDetector, DifficultyManager, ScoreManager)
- **Property-based tests**: All 22 identified properties (see testable-properties.md)
- **Integration tests**: State machine transitions, game flow
- **No E2E tests**: Out of scope for this project (manual testing sufficient for UI)

## NFR-TEST-02: PBT Framework (PBT-09)
- **Framework**: fast-check (TypeScript-native, integrates with Vitest)
- **Shrinking**: Enabled (default fast-check behavior)
- **Reproducibility**: Seed logged on failure
- **CI integration**: PBT runs as part of `npm test`
