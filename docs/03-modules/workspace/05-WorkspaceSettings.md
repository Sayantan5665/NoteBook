# 05 — Workspace Settings

> **Document Type:** Module Specification
> **Module:** workspace
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

This document describes how settings that belong to a specific Workspace are managed conceptually. While the `settings` module provides the UI and the persistence mechanisms, this document outlines which settings are intrinsically tied to the Workspace entity itself versus the global application.

---

## 2. Scope

**This document covers:**
- The conceptual boundary between Global and Workspace settings.
- Examples of Workspace-level settings.
- Settings inheritance and overrides.

**This document does NOT cover:**
- The UI implementation of the settings panel (see `settings/`).
- The database schema for settings (`application_settings` table).

---

## 3. Global vs Workspace Settings

Notebook requires a distinction between settings that affect the application as a whole, and settings that are specific to a user's isolated knowledge base (the Workspace).

- **Global Settings:** Stored in the OS app data folder (e.g., `~/.config/Notebook/`). Examples: UI Language, default Workspace on launch, hardware acceleration toggles.
- **Workspace Settings:** Stored inside the Workspace's `database.db`. Examples: Selected AI models, tags, custom themes, backup schedules.

Because Workspace settings live in the database, they travel with the Workspace during backups, syncs, and exports. 

---

## 4. Workspace-Level Settings Inventory

The following settings are owned by the Workspace and exposed to the user:

### 4.1 Identity
- **Workspace Name:** The display name (modifies `manifest.json`).
- **Workspace Icon / Color (Future):** Visual identifiers for the launch screen.

### 4.2 Behavior
- **Editor Preferences:** Autosave interval, default view modes (edit/preview).
- **Version History:** Retention limits (e.g., keep 100 versions per note).

### 4.3 Integrations
- **AI Settings:** Selected local Ollama model for chat, selected model for embeddings, context window limits.
- **Sync Settings:** Google Drive connection status, target folder ID.

### 4.4 Maintenance
- **Backup Schedule:** Automatic backup frequency and retention policy.

---

## 5. Inheritance and Overrides

By default, newly created Workspaces may inherit default values from Global settings (e.g., if the user sets a global preference for "Dark Theme"). 

However, once a Workspace is created, its settings are **independent**. 
- Changing the theme to "Light" inside Workspace A does not affect Workspace B.
- If a Global setting is updated later, it does NOT retroactively overwrite existing Workspace settings unless explicitly triggered by the user ("Apply to all Workspaces").

---

## 6. Business Rules

- **Portability:** All settings required for the Workspace to function correctly (especially AI model selections) must be stored in the Workspace database.
- **Validation:** Settings values must be validated by the respective modules before the Settings module persists them.

---

## 7. Acceptance Criteria

- [ ] Settings applied in one Workspace do not leak into or affect another Workspace.
- [ ] Exporting and importing a Workspace retains all its specific AI and editor preferences.
