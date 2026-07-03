# Settings Module

> **Document Type:** Module README
> **Module:** settings
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../02-database/04-Schema.md §3.14](../../02-database/04-Schema.md) · [../../01-architecture/01-SystemOverview.md](../../01-architecture/01-SystemOverview.md) · [../workspace/README.md](../workspace/README.md) · [../ai/README.md](../ai/README.md) · [../backup/README.md](../backup/README.md) · [../sync/README.md](../sync/README.md) · [../plugins/README.md](../plugins/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Settings module defines how users configure the behavior of Notebook at both the Workspace level and the application level. Settings govern AI model selection, autosave interval, version history retention, backup schedule, theme, and other behavioral preferences.

Settings are the bridge between user preferences and the configuration that governs other modules' behavior. The Settings module does not implement those behaviors — it stores and exposes the configuration that other modules consume.

---

## Scope

**This module covers:**
- Workspace settings: AI model selection (chat model, embedding model), autosave interval, version history limit, backup configuration, theme
- Application settings: global preferences not tied to a specific Workspace (e.g., launch behavior, default Workspace, UI language)
- Settings UI: organized settings panels with grouped categories
- Settings persistence: Workspace settings in `application_settings` table; application settings in application-level storage
- Settings validation: range checking, valid value enforcement
- Settings change propagation: notifying dependent modules when a setting changes (e.g., embedding model change triggers re-indexing)

**This module does NOT cover:**
- Plugin-specific configuration panels (plugins render their own settings sub-panels; the plugin settings integration point is documented in `plugins/`)
- Google Drive OAuth credential management (see `sync/`)
- Backup execution (see `backup/`)

---

## Responsibilities

This module is responsible for:

- Reading and writing `application_settings` table rows (Workspace-scoped singleton)
- Persisting application-level settings outside the Workspace database (e.g., recent Workspaces list, window size)
- Providing a settings API to other modules (read current setting values)
- Validating settings values before persistence
- Emitting settings change events when relevant settings are updated (e.g., `EmbeddingModelChangedEvent`, `ThemeChangedEvent`)
- Displaying categorized settings panels to the user

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-WorkspaceSettings.md` | Planned | AI model selection, autosave, version history, backup, theme — Workspace-scoped |
| `02-ApplicationSettings.md` | Planned | Global preferences: launch behavior, default Workspace, language |
| `03-SettingsChangeEvents.md` | Planned | Events emitted when settings change and their effects on other modules |

---

## Key Business Rules (Summary)

- Workspace settings are stored in the `application_settings` table (one row per Workspace). They travel with the Workspace on backup and sync.
- Application settings (e.g., window geometry, recent Workspaces list) are stored outside the Workspace database, in the operating system application data directory.
- Changing the embedding model triggers a full Workspace re-index. The user is warned and required to confirm before the change is applied.
- Settings changes take effect immediately without requiring an application restart, unless restart is explicitly documented as required.
- Settings values are validated before persistence. Invalid values are rejected with a user-visible error; the previous valid value is retained.

---

## Settings Categories (Summary)

| Category | Example Settings |
|---|---|
| **AI** | Chat model, embedding model, context window size |
| **Editor** | Autosave interval, spell check |
| **Version History** | Retention limit (number of versions per note) |
| **Backup** | Enable/disable automatic backup, backup frequency, retention days |
| **Appearance** | Theme (light, dark, system) |
| **Sync** | Google Drive sync status, sync management (see `sync/`) |
| **Plugins** | Plugin management panel (see `plugins/`) |
| **Maintenance** | Manual re-index, FTS5 rebuild, integrity check |

---

## Future Considerations

- **Per-note editor settings:** Override global autosave and spell check settings on a per-note basis.
- **Workspace settings profiles:** Named configuration presets that can be applied to a Workspace with one action (e.g., "Minimal", "Research", "Developer").
- **Settings export/import:** Exporting settings as a JSON file and importing them into another Workspace, for rapid setup of new Workspaces.
