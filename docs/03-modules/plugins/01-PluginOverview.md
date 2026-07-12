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
- **Plugins consume public extension points.** They never bypass module ownership boundaries. Notebook modules expose extension points through the SDK rather than exposing internal implementations.
- **The Plugin SDK provides stable public contracts.** The SDK preserves architectural boundaries.
- **Notebook Core remains stable regardless of installed plugins.** The application is highly decoupled from the extensions it hosts.

---

## 3. Conceptual Identities

- **Plugin Package:** A distributable physical artifact (e.g., a `.zip` or folder) containing the manifest and executable assets.
- **Plugin Manifest:** The static metadata describing the plugin (Name, Version, Required SDK, Requested Permissions). It declares what the package is and needs.
- **Installed Plugin:** A validated installation of a Plugin Package within the system catalog.
- **Plugin Instance:** The active runtime representation of a loaded, executing plugin.
- **Extension Point:** A stable, public contract exposed by a core module (e.g., `IExportProvider`) that a Plugin Instance can fulfill.
- **Plugin Capability:** A specific feature or extension point that a Plugin registers with the system to provide functionality.

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
