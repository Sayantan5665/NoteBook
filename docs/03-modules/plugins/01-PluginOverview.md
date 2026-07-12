# 01 — Plugin Overview

> **Module:** Plugins
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Plugin Overview defines the conceptual foundation of how third-party code integrates with the Notebook application while preserving strict boundaries, ownership, and stability.

---

## 2. Plugin Philosophy

- **Plugins extend Notebook capabilities.** They add features such as new themes, new sync providers, or custom editors, but they do not redefine what a Notebook is.
- **Plugins never become owners of Notebook entities.** Notebook Core always remains the canonical owner. A plugin can request a Note be created, but the Domain creates it.
- **Plugins consume public extension points.** They never bypass module ownership boundaries.
- **Notebook Core remains stable regardless of installed plugins.** The application is highly decoupled from the extensions it hosts.

---

## 3. Conceptual Identities

- **Plugin:** The abstract concept of an installed extension.
- **Plugin Manifest:** The static metadata describing the plugin (Name, Version, Required SDK, Requested Permissions).
- **Plugin Package:** The physical artifact (e.g., a `.zip` or folder) containing the manifest and executable assets.
- **Plugin Instance:** The runtime representation of a loaded, active plugin.
- **Extension Point:** A stable, public contract exposed by a core module (e.g., `IExportProvider`) that a Plugin Instance can fulfill.
- **Plugin Capability:** A specific feature or extension point that a Plugin registers with the system.

---

## 4. Business Rules

- **Plugins are optional.**
- **Notebook Core remains fully functional without plugins.**
- **Plugins never own Notebook entities.**

---

## 5. Acceptance Criteria

- A Plugin Instance only interacts with canonical data via predefined SDK methods (e.g., `notebook.workspace.getActiveNote()`).
- The application gracefully handles the absence of any Plugin Packages.

---

## 6. Cross References

- [02-PluginLifecycle.md](./02-PluginLifecycle.md)
- [03-ExtensionPoints.md](./03-ExtensionPoints.md)
- [07-PluginGovernance.md](./07-PluginGovernance.md)
