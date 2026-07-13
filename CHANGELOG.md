# Changelog

## Implementation — Desktop Application Shell

**Date:** 2026-07-14
**Phase:** 1 of 17 (Desktop Shell)

### Added
- Monorepo `pnpm` workspace setup with `@notebook/shared-types` and `@notebook/ipc-contracts`.
- Electron 43 main process (`main.ts`) with strict security (context isolation, no node integration).
- Electron preload script (`preload.ts`) exposing typed `window.notebookApi`.
- IPC handler registration with whitelist verification (`app:ping`).
- Angular 22 shell application with standalone components and hash-location routing.
- Initial lazy-loaded feature modules: Dashboard and Settings.
- SCSS-based theme architecture with light/dark variables.
- Concurrently-based dev server workflow (`pnpm run dev`).

### Changed
- Upgraded TypeScript to 6.0.3 across the workspace (`ignoreDeprecations: "6.0"`).
- Adjusted Electron and shared packages to compile as `CommonJS` for native runtime resolution.
- Updated `pnpm-workspace.yaml` to allow build scripts for native dependencies.
- Added `.angular/`, `release-builds/`, and `electron-dist/` to `.gitignore`.

### Dependencies
- Installed `@angular/*` packages (v22.0.x).
- Installed `electron` (v43.1.x) and `electron-builder`.
- Installed `rxjs`, `zone.js`, `concurrently`, `cross-env`, and `wait-on`.

### Build
- Implemented dual-build process: Angular builds via `@angular/build` (esbuild), Electron/packages build via `tsc`.

### Documentation
- Updated `PROJECT_PROGRESS.md` with implementation metrics and phase tracking.
- Synced `CHANGELOG.md`.

### Validation
- Verified `pnpm run dev` successfully launches Angular + Electron.
- Verified IPC ping/pong bridge functionality.

## Phase 3 — Module Specifications — Version 1.0

Summary:

- Completed all Phase 3 module documentation.
- Completed architectural consistency audit.
- Approved with only administrative updates.
- Phase 3 frozen as Version 1.0.
- Ready to begin Phase 4.
