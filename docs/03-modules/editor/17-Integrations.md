> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 17 — Integrations

---

## 1. Purpose

This document maps the conceptual integrations between the Editor and the rest of the Notebook application ecosystem. It emphasizes the boundaries where the Editor acts purely as a consumer of external services.

## 2. Core Principle

- **The Editor consumes services provided by other modules.**
- **The Editor NEVER becomes the owner of external responsibilities.**

---

## 3. Integrations

### 3.1 Notes Module
- **Purpose:** Requesting payload data and submitting saves.
- **Ownership:** Notes module owns the data. Editor consumes it.
- **Boundaries:** The Editor asks for a session, mutates volatile state, and pushes it back.

### 3.2 Version History
- **Purpose:** Restoring an older snapshot to the Editor canvas.
- **Ownership:** Notes module.
- **Boundaries:** The Editor does not query history directly. The Notes module restores the payload and broadcasts a `VersionRestored` event, which the Editor consumes to reload its canvas.

### 3.3 Autosave
- **Purpose:** Pushing volatile changes to disk automatically.
- **Ownership:** Notes module / Application.
- **Boundaries:** The Editor emits `EditorContentChanged`. An external coordinator debounces this and calls `saveSession()`.

### 3.4 Attachments
- **Purpose:** Displaying embedded images and files.
- **Ownership:** Attachments module.
- **Boundaries:** The Editor encounters an attachment ID in the payload. It queries the Attachments module for a rendering URL. If the user drops an image, the Editor delegates the upload and only stores the returned ID.

### 3.5 Wiki Links
- **Purpose:** Cross-linking Notes.
- **Ownership:** Wiki Links module (Graph logic).
- **Boundaries:** The Editor simply provides the UI to type `[[` and present an autocomplete list. The actual graph indexing is done externally by parsing the saved payload.

### 3.6 Tags
- **Purpose:** Categorizing Notes inline.
- **Ownership:** Metadata / Search modules.
- **Boundaries:** The Editor formats `#tags` visually, but the aggregation and querying happen externally.

### 3.7 Search
- **Purpose:** Finding text within the active document or highlighting global search results.
- **Ownership:** Search module.
- **Boundaries:** The Search module queries the database. If it points to the active Note, the Editor is simply instructed to highlight specific text ranges via its Selection API.

### 3.8 AI
- **Purpose:** Semantic text generation or correction.
- **Ownership:** AI module.
- **Boundaries:** The AI module may be exposed via a plugin hook in the Editor, injecting suggested text blocks.

### 3.9 Synchronization
- **Purpose:** Keeping devices in sync.
- **Ownership:** Sync module.
- **Boundaries:** If Sync detects a remote change, it updates the database and triggers the Notes module, which in turn tells the Editor to reload or merge changes. The Editor knows nothing of networks.

### 3.10 Backup, Import / Export
- **Purpose:** Data portability.
- **Boundaries:** The Editor only participates by providing Markdown parsing (Import) or serialization (Export) utilities upon request.

### 3.11 Themes
- **Purpose:** Visual styling.
- **Ownership:** Application configuration.
- **Boundaries:** The Editor listens for global `ThemeChanged` events to swap its internal CSS variables.

### 3.12 Plugin System
- **Purpose:** Extensibility.
- **Ownership:** Plugin subsystem.
- **Boundaries:** The Plugin system wraps the Editor, injecting custom nodes or listening to Editor events without modifying the Editor's core codebase.

## 4. Acceptance Criteria

- The Editor can be unit-tested without instantiating the Sync, AI, or Attachments modules.
- Integrating a new module (e.g., Collaboration) can be done via the Editor's event hooks and Extension Points without rewriting Editor core logic.
