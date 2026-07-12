# 08 — Plugin Implementation Guidelines

> **Module:** Implementation Playbook
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

The Plugin Implementation Guidelines define how developers must construct the Plugin SDK to ensure external code can safely interact with the Notebook ecosystem.

---

## 2. Implementation Rules

### 2.1 Plugin Lifecycle
- The SDK implementation must carefully manage the state transitions of a plugin (Install, Activate, Deactivate, Uninstall).
- Deactivation must cleanly garbage-collect all event listeners and UI elements registered by the plugin.

### 2.2 Permissions & Sandboxing
- The Plugin Host must execute plugins in an isolated context (e.g., QuickJS, Web Workers, or an iframe sandbox).
- Direct access to `fs` (Node.js filesystem) or the SQLite database connection is strictly prohibited.
- The SDK must provide explicit wrapper APIs (e.g., `app.workspace.readNote()`) that inherently enforce the plugin's requested permissions.

### 2.3 Extension Points
- Developers implementing new extension points must document them comprehensively.
- Extension points should favor Event-driven architecture (e.g., `onNoteSaved`) rather than synchronous interception, avoiding plugin-induced UI lag.

### 2.4 Backward Compatibility
- Once the Plugin SDK reaches v1.0, its public API surface cannot introduce breaking changes until v2.0. Deprecated APIs must remain functional and log warnings.

---

## 3. Responsibilities

- **Core Engineering:** Implement the secure sandbox and the SDK API surface.

---

## 4. Business Rules

- **Host Resilience:** The implementation must catch all exceptions thrown within the plugin sandbox. A crashed plugin must never crash the main application process.

---

## 5. Acceptance Criteria

- A malicious test plugin attempting to run an infinite `while(true)` loop is successfully terminated by the host after a timeout without freezing the UI.

---

## 6. Cross References

- [03-modules/plugins/README.md](../03-modules/plugins/README.md)
