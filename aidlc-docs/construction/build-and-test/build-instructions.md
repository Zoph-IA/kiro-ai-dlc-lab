# Build Instructions — Flappy Kiro

## Prerequisites
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ (bundled with Node.js)
- **OS**: Windows, macOS, or Linux
- **Disk Space**: ~200MB (including node_modules)

## Build Steps

### 1. Install Dependencies
```bash
npm install
```
Expected: 226 packages installed, 0 errors.

### 2. Type Check
```bash
npx tsc --noEmit
```
Expected: No output (clean compilation).

### 3. Lint
```bash
npm run lint
```
Expected: No errors or warnings.

### 4. Format Check
```bash
npm run format:check
```
Expected: All files formatted correctly.

### 5. Run Tests
```bash
npm test
```
Expected: 76 tests pass, 0 failures.

### 6. Build for Production
```bash
npm run build
```
Expected output:
```
vite v6.x building for production...
✓ 18 modules transformed.
dist/index.html                 ~0.7 kB
dist/assets/index-[hash].js    ~14.5 kB │ gzip: ~4.2 kB
✓ built in <1s
```

### 7. Security Audit
```bash
npm audit
```
Review any reported vulnerabilities.

## Build Artifacts
- `dist/index.html` — Production HTML
- `dist/assets/index-[hash].js` — Bundled JavaScript (source-mapped)
- `dist/assets/` — Copied game assets (ghosty.png, jump.wav, game_over.wav)

## Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173` with HMR and security headers.

## Troubleshooting

### TypeScript Compilation Errors
- **Cause**: Missing type definitions or strict mode violations
- **Solution**: Run `npx tsc --noEmit` to see specific errors, fix type issues

### Test Failures
- **Cause**: Logic changes that break invariants
- **Solution**: Run `npm test` to identify failing tests, check PBT seed for reproduction

### Vite Build Fails
- **Cause**: Import resolution issues
- **Solution**: Verify all imports use `.js` extensions (required for ESM)
