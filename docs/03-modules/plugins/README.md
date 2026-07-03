# Plugins Module

> **Document Type:** Module README
> **Module:** plugins
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §18](../../00-overview/04-FunctionalRequirements.md) · [../../01-architecture/10-PluginArchitecture.md](../../01-architecture/10-PluginArchitecture.md) · [../../02-database/04-Schema.md §3.13](../../02-database/04-Schema.md) · [../settings/README.md](../settings/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Plugins module defines the user-facing behavior of Notebook's plugin system — how plugins are installed, enabled, disabled, configured, and removed. It also defines the functional extension points that plugins may contribute to.

Plugins allow first-party and third-party developers to extend Notebook without modifying the core application. The plugin system is the mechanism through which alternative AI providers, sync providers, OCR engines, content importers, content exporters, and editor extensions are contributed.

This module does not define the Plugin SDK API — that belongs in `docs/sdk/`. This module defines what the plugin system does from the user's and application's perspective.

---

## Scope

**This module covers:**
- Plugin installation from the local filesystem
- Plugin manifest validation (declaration of capabilities and permissions)
- Displaying required permissions to the user before installation confirmation
- Enabling and disabling installed plugins without application restart (where feasible)
- Removing/uninstalling plugins
- The plugin management UI (installed plugins list, enable/disable, configuration)
- Plugin configuration storage (`plugin_configurations` table)
- Plugin extension points: what plugins can contribute and what contracts they must satisfy
- Plugin isolation: preventing a misbehaving plugin from crashing the core application
- Plugin update behavior

**This module does NOT cover:**
- Plugin SDK and developer API surface (documented in `docs/sdk/`)
- Remote plugin repositories (future consideration)
- Specific plugin implementations (each plugin is its own concern)

---

## Responsibilities

This module is responsible for:

- Discovering and loading plugin manifests at application startup
- Validating plugin manifests against the required schema
- Displaying permission prompts to the user on first installation
- Registering plugin-contributed providers and extensions with the relevant subsystems
- Persisting plugin configuration in `plugin_configurations` table
- Unloading plugin contributions when a plugin is disabled or removed
- Enforcing plugin sandbox constraints to prevent unauthorized access

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-PluginLifecycle.md` | Planned | Install, enable, disable, remove, update workflows |
| `02-PluginPermissions.md` | Planned | Permission model, permission declaration, user consent flow |
| `03-ExtensionPoints.md` | Planned | Complete inventory of plugin extension points (AI, sync, OCR, import, export, editor, theme) |
| `04-PluginConfiguration.md` | Planned | Plugin settings storage, configuration schema, settings UI integration |
| `05-PluginIsolation.md` | Planned | Sandbox model, error boundary, plugin crash handling |

---

## Key Business Rules (Summary)

- Plugins are installed from the local filesystem only. Remote plugin repositories are not supported in V1.
- A plugin's declared permissions are displayed to the user before installation. Installation cannot proceed without explicit user acknowledgment.
- Disabling a plugin removes its contributions from all extension points without restarting the application, where technically feasible. If restart is required, the user is informed.
- A plugin crash or exception must not crash or corrupt the core application.
- Plugin configuration is stored in `plugin_configurations` (Workspace-scoped). Plugins do not have access to global application state.
- Removing a plugin also removes its configuration from the `plugin_configurations` table.
- Plugins communicate only through published extension interfaces. They have no direct access to the database, filesystem, or IPC bridge.

---

## Extension Points (Summary)

| Extension Point | Description |
|---|---|
| `IAiProvider` | Alternative AI inference provider (e.g., OpenAI-compatible API) |
| `IEmbeddingProvider` | Alternative embedding model provider |
| `ISyncProvider` | Alternative sync target (iCloud, Dropbox, etc.) |
| `IOcrProvider` | Alternative OCR engine |
| `IContentImporter` | Additional import formats (Notion, Evernote, Obsidian) |
| `IContentExporter` | Additional export formats (PDF, HTML, JSON) |
| `ITiptapExtension` | Custom Tiptap editor nodes and marks |
| `ITheme` | Application UI themes |

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-PLG-01 | Plugin system enabling functional extension |
| FR-PLG-02 | Extension points for AI, sync, OCR, import, export, editor, themes |
| FR-PLG-03 | Plugin management UI: view, enable, disable, remove |
| FR-PLG-04 | Install from local filesystem |
| FR-PLG-05 | Load/unload without application restart where feasible |
| FR-PLG-06 | Declare and display permissions before installation |
| FR-PLG-07 | Plugin SDK documented in `docs/sdk/` |

---

## Future Considerations

- **Remote plugin repository:** A curated directory of reviewed plugins installable via the UI, similar to VS Code's extension marketplace. Requires security review infrastructure.
- **Plugin versioning and updates:** Checking for and applying plugin updates, with changelog display.
- **Plugin sandboxing (Node.js vm module or separate process):** Stronger isolation of plugin execution to prevent memory leaks and unauthorized API access.
- **Plugin signing:** Cryptographic signing of plugin packages to verify authenticity before installation.
