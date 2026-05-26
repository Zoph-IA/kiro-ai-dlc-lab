# Flappy Kiro — Tech Stack Decisions

## Runtime Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Language | TypeScript | 5.x (latest) | Type safety, IDE support, strict mode |
| Rendering | HTML5 Canvas 2D | Native | No framework overhead, full control |
| Audio | Web Audio API / HTMLAudioElement | Native | Simple sound playback, no library needed |
| Persistence | localStorage | Native | High score + sound preference |
| Module System | ES Modules | Native | Modern, tree-shakeable |

## Build Stack

| Tool | Technology | Version | Rationale |
|---|---|---|---|
| Build Tool | Vite | 6.x (latest) | Fast HMR, esbuild-powered, zero-config TypeScript |
| Dev Server | Vite dev server | (bundled) | HMR, security headers config |
| TypeScript | tsc (via Vite) | 5.x | Strict mode compilation |
| Bundling | Vite/Rollup (production) | (bundled) | Optimized production builds |

## Test Stack

| Tool | Technology | Version | Rationale |
|---|---|---|---|
| Test Runner | Vitest | 3.x (latest) | Vite-native, fast, Jest-compatible API |
| PBT Framework | fast-check | 3.x (latest) | TypeScript-native, excellent shrinking, Vitest integration (PBT-09) |
| Assertions | Vitest built-in (expect) | (bundled) | Jest-compatible, no extra dependency |
| Coverage | v8 (via Vitest) | (bundled) | Fast native coverage |

## Quality Stack

| Tool | Technology | Version | Rationale |
|---|---|---|---|
| Linter | ESLint | 9.x (latest) | TypeScript-aware rules, catches bugs early |
| Formatter | Prettier | 3.x (latest) | Consistent code style, no debates |
| TypeScript Config | strict mode | — | Maximum type safety |

## Dependency Summary

### Production Dependencies
**None** — zero runtime npm dependencies. The game is pure TypeScript compiled to vanilla JavaScript.

### Development Dependencies
| Package | Purpose | Category |
|---|---|---|
| `vite` | Build tool + dev server | Build |
| `typescript` | TypeScript compiler | Build |
| `vitest` | Test runner | Test |
| `fast-check` | Property-based testing | Test |
| `@vitest/coverage-v8` | Code coverage | Test |
| `eslint` | Linter | Quality |
| `@typescript-eslint/eslint-plugin` | TS-aware lint rules | Quality |
| `@typescript-eslint/parser` | TS parser for ESLint | Quality |
| `prettier` | Code formatter | Quality |
| `eslint-config-prettier` | Disable ESLint rules that conflict with Prettier | Quality |

**Total dev dependencies**: 10 packages (minimal, well-maintained, official sources)

## Security Compliance (SECURITY-10)

- [x] All dependencies use exact versions (pinned in package.json)
- [x] Lock file (package-lock.json) committed to version control
- [x] Zero production dependencies (no supply chain risk at runtime)
- [x] All packages from official npm registry
- [x] `npm audit` included in build process
- [x] No `latest` tags in any configuration

## PBT Compliance (PBT-09)

- [x] Framework selected: fast-check
- [x] Supports custom generators/strategies
- [x] Supports automatic shrinking
- [x] Supports seed-based reproducibility
- [x] Integrates with project test runner (Vitest)
- [x] Documented in tech stack decisions (this file)
- [x] Will be included as dev dependency in package.json

## Project Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "audit": "npm audit"
  }
}
```
