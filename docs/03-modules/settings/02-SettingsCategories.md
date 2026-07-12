# 02 — Settings Categories

> **Module:** Settings
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Settings Categories document defines the taxonomy used to organize configuration keys into a logical, discoverable structure for both the backend schema and the user interface.

---

## 2. Category Philosophy

- **Categories organize settings.** They provide a namespace to prevent key collisions (e.g., `editor.font_size` vs `ui.font_size`).
- **Categories do not own functionality.** They are purely structural mapping constructs.
- **Settings Scopes:** Settings may exist at different scopes, such as application-wide settings and workspace-specific settings. Validation determines the applicability of a setting based on its defined scope. 

---

## 3. Core Categories

### 3.1 General
Application-wide defaults such as language/locale and startup behavior.

### 3.2 Appearance
Theme (Light/Dark/System), accent colors, UI scaling, and window behavior.

### 3.3 Editor
Typography, line height, markdown parsing strictness, spellcheck toggles, and vim-mode toggles.

### 3.4 AI
Model selection, endpoint configuration, context limits, and AI assistant behavior constraints.

### 3.5 Search
Fuzzy vs. strict matching defaults, indexing priorities, and OCR inclusion toggles.

### 3.6 Synchronization
Sync strategies (manual vs. automatic), conflict resolution defaults, and active provider selection.

### 3.7 Backup
Automatic backup schedules, retention policies, and storage paths.

### 3.8 Notifications
Toggle for in-app toasts, desktop notifications, and event severity filters.

### 3.9 Privacy
Telemetry toggles and local-only strict mode enforcement.

### 3.10 Advanced
Developer tools, database maintenance triggers, and raw config JSON access.

---

## 4. Future Extensions

As plugins are introduced, the Settings module will support dynamically registered categories, allowing third-party extensions to inject their configuration schemas into the standard UI.

---

## 5. Business Rules

- **Categories organize settings.**
- **Categories do not own functionality.**

---

## 6. Acceptance Criteria

- A setting key must be fully qualified by its category (e.g., `appearance.theme`) to prevent namespace collisions.

---

## 7. Cross References

- [01-SettingsOverview.md](./01-SettingsOverview.md)
