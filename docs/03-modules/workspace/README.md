# Workspace Module

> **Document Type:** Module README
> **Module:** workspace
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §3](../../00-overview/04-FunctionalRequirements.md) · [../../01-architecture/01-SystemOverview.md §6](../../01-architecture/01-SystemOverview.md) · [../../01-architecture/ADR-009-WorkspaceIsolation.md](../../01-architecture/ADR-009-WorkspaceIsolation.md) · [../../01-architecture/ADR-010-WorkspaceManifest.md](../../01-architecture/ADR-010-WorkspaceManifest.md) · [../../01-architecture/15-WorkspaceManifest.md](../../01-architecture/15-WorkspaceManifest.md) · [../../02-database/02-StorageLayout.md](../../02-database/02-StorageLayout.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Workspace module governs the complete lifecycle of a Workspace — the top-level container that holds all of a user's notes, folders, attachments, todos, tags, AI chats, and settings.

A Workspace is the fundamental unit of isolation in Notebook. Every user action operates within the context of exactly one active Workspace. The Workspace module defines how Workspaces are created, opened, closed, switched, renamed, deleted, backed up, and managed on the local filesystem.

This module is the root dependency for almost all other modules: nothing in the application operates without an open Workspace.

---

## Scope

**This module covers:**
- Creating a new Workspace (choosing name and local directory)
- Opening an existing Workspace from the filesystem
- Switching between multiple Workspaces in a single session
- Renaming a Workspace
- Deleting a Workspace with confirmation
- The recent Workspaces list displayed at launch
- Workspace migration (opening a Workspace that requires database migrations)
- Workspace health checks on open (manifest validation, schema version check)
- Workspace close (clean teardown, connection release)

**This module does NOT cover:**
- Backup and restore (see `backup/`)
- Google Drive synchronization (see `sync/`)
- Import and export (see `import-export/`)
- Per-Workspace settings (see `settings/`)
- Note, folder, and attachment operations within a Workspace (see respective modules)

---

## Responsibilities

This module is responsible for:

- Creating the Workspace directory structure on the local filesystem
- Writing and reading `manifest.json` as the Workspace identity and version record
- Initializing and migrating the `database.db` for each Workspace
- Managing the Prisma client connection lifecycle (one client per open Workspace)
- Maintaining the recent Workspaces list in application-level storage
- Detecting and handling incompatible Workspace versions (`schemaVersion` and `formatVersion` checks)
- Surfacing Workspace-level metadata to the UI (name, path, schema version, last opened)
- Performing pre-migration backups before applying database migrations
- Enforcing single-active-Workspace semantics within a session

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-WorkspaceLifecycle.md` | Planned | Create, open, close, switch, rename, delete workflows and state transitions |
| `02-WorkspaceManifest.md` | Planned | Manifest reading, validation, writing, and version compatibility rules |
| `03-WorkspaceMigration.md` | Planned | Schema migration flow, pre-migration backup requirement, failure handling |
| `04-RecentWorkspaces.md` | Planned | Recent Workspaces list management, launch screen behavior |
| `05-WorkspaceHealthCheck.md` | Planned | Startup integrity checks, manifest validation, database integrity verification |

---

## Key Business Rules (Summary)

- A Workspace is a local directory — it is never cloud-first.
- Every Workspace has exactly one `manifest.json` and one `database.db`.
- No two open Workspaces share the same database connection.
- The Workspace Manager is the only component that may create, open, or close a Prisma client.
- Deleting a Workspace permanently removes all its local files — this action is irreversible and requires explicit user confirmation.
- Opening a Workspace whose `schemaVersion` is higher than `CURRENT_SCHEMA_VERSION` is refused — the user must upgrade the application.
- A pre-migration backup is created automatically before any migration runs; the open is aborted if the backup fails.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-WS-01 | Create a new Workspace |
| FR-WS-02 | Open an existing Workspace |
| FR-WS-03 | Rename a Workspace |
| FR-WS-04 | Delete a Workspace |
| FR-WS-05 | Support multiple Workspaces, switchable without restart |
| FR-WS-06 | Each Workspace maintains independent data |
| FR-WS-07 | Persist and display recently opened Workspaces |
| FR-WS-08 | Store Workspace as a local directory with SQLite and attachments |

---

## Future Considerations

- **Workspace templates:** Allow creating a new Workspace pre-populated from a template (e.g., "Personal Journal", "Project Notes") with default folder structure.
- **Workspace locking:** Detect and prevent two application instances from opening the same Workspace simultaneously.
- **Workspace encryption:** SQLCipher-based at-rest encryption, keyed per Workspace. The manifest would store the salt; the user provides the passphrase on open.
