# 05 — Settings Events

> **Module:** Settings
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Settings Events document outlines how the Settings module communicates configuration changes to the rest of the application, ensuring a reactive and decoupled architecture.

---

## 2. Event Philosophy

- The Settings module does not push logic into consumer modules; it merely broadcasts that a value has changed.
- Modules listen only for the specific settings that affect them.

---

## 3. Published Events

The module broadcasts these conceptual events:

- `SettingChanged(key, newValue)`: Fired whenever a specific setting is successfully validated and persisted.
- `SettingLoaded()`: Fired on application startup when the in-memory cache is fully populated.
- `SettingReset()`: Fired when the user restores factory defaults.
- `SettingsImported()`: Fired when a batch configuration file is applied.
- `SettingsExported()`: Fired when the current configuration is dumped to a derived artifact.

---

## 4. Consumed Events

The Settings module is primarily an event producer, but may react to:
- `WorkspaceOpened`: To load workspace-specific overrides (if applicable).

---

## 5. Business Rules

- Events decouple configuration from execution.
- Modules react to `SettingChanged` to update their internal state dynamically.

---

## 6. Acceptance Criteria

- When `appearance.theme` changes, a `SettingChanged` event is fired. The UI module intercepts this event and swaps the CSS variables, without the Settings module needing to know anything about CSS.

---

## 7. Cross References

- [03-SettingsLifecycle.md](./03-SettingsLifecycle.md)
