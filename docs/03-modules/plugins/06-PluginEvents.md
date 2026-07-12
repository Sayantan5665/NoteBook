# 06 — Plugin Events

> **Module:** Plugins
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Plugin Events document outlines how the SDK communicates the state of third-party extensions to the rest of the application.

---

## 2. Event Philosophy

- **Plugin events communicate lifecycle changes.** They allow the UI to update the settings panel or prompt the user for permission reviews.
- **Events never transfer ownership.** They transmit metadata (such as plugin IDs or names), never active executing code.

---

## 3. Published Events

The SDK broadcasts these conceptual events:

- `PluginDiscovered(manifest)`: Found a new package on disk.
- `PluginValidated(id)`: Package is structurally sound.
- `PluginInstalled(id)`: Package is registered in the system.
- `PluginPermissionGranted(id, permissions)`: User approved capabilities.
- `PluginPermissionRevoked(id, permissions)`: User restricted capabilities.
- `PluginActivated(id)`: Plugin is now running and hooked into Extension Points.
- `PluginDeactivated(id)`: Plugin has been gracefully shut down.
- `PluginUpdated(id, newVersion)`: Plugin package was replaced.
- `PluginRemoved(id)`: Plugin was uninstalled.
- `PluginFailed(id, reason)`: Plugin threw an unhandled exception or violated security.

---

## 4. Consumed Events

The Plugin SDK acts primarily as a publisher regarding its own lifecycle. However, the *Plugin Instances* themselves may subscribe to Application Events (like `NoteCreated` or `WorkspaceOpened`) provided they have the appropriate permissions.

---

## 5. Business Rules

- **Plugin events communicate lifecycle changes.**
- **Plugin failures never corrupt Notebook data.**

---

## 6. Acceptance Criteria

- When a user clicks "Disable" on a plugin in the Settings UI, the UI issues a command, the SDK deactivates the plugin, and publishes `PluginDeactivated`. The UI listens for this event to update the toggle state, ensuring a reactive flow.

---

## 7. Cross References

- [02-PluginLifecycle.md](./02-PluginLifecycle.md)
