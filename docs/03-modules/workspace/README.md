# Workspace Module

> **Document Type:** Module README
> **Module:** workspace
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Workspace module governs the complete lifecycle of a Workspace — the top-level logical container that holds all of a user's notes, folders, attachments, todos, tags, AI chats, and settings. 

A Workspace is the fundamental unit of isolation in Notebook. Every user action operates within the context of exactly one active Workspace. The Workspace module defines how Workspaces are created, opened, closed, switched, renamed, deleted, backed up, and managed on the local filesystem.

This module is the root dependency for almost all other modules: nothing in the application operates without an open Workspace.

---

## 2. Scope

**This document covers:**
- Creating a new Workspace (choosing name and local directory)
- Opening an existing Workspace from the filesystem
- Switching between multiple Workspaces in a single session
- Renaming a Workspace
- Deleting a Workspace with confirmation
- The recent Workspaces list displayed at launch
- Workspace migration (opening a Workspace that requires database migrations)
- Workspace health checks on open (manifest validation, schema version check)
- Workspace close (clean teardown, connection release)

**This document does NOT cover:**
- Backup and restore (see `backup/`)
- Google Drive synchronization (see `sync/`)
- Import and export (see `import-export/`)
- Note, folder, and attachment operations within a Workspace (see respective modules)

---

## 3. Ownership and Responsibilities

This module is responsible for:
- Creating the Workspace directory structure on the local filesystem
- Writing and reading `manifest.json` as the Workspace identity and version record
- Initializing and migrating the `database.db` for each Workspace
- Managing the Prisma client connection lifecycle (one client per open Workspace)
- Detecting and handling incompatible Workspace versions (`schemaVersion` and `formatVersion` checks)

*Note: The Workspace module does NOT own or maintain the Recent Workspaces list. Recent Workspaces is Application-level state and is maintained by the Application module. A Workspace has no knowledge of whether it is listed in Recent Workspaces. The Workspace module only exposes information required by the Application.*
- Surfacing Workspace-level metadata to the UI (name, path, schema version, last opened)
- Enforcing single-active-Workspace semantics within a session

The Workspace module **strictly owns** only the Workspace lifecycle. It does NOT own Notes, Folders, Attachments, Search, AI, Synchronization, or Plugins. Those modules consume the active Workspace.

---

## 4. Public Interfaces

The Workspace module exposes the following logical capabilities to the application layer:
- `CreateWorkspace`: Initializes a new Workspace directory, manifest, and database.
- `OpenWorkspace`: Validates, optionally migrates, and connects to a Workspace.
- `CloseWorkspace`: Safely flushes state and closes database connections.
- `DeleteWorkspace`: Permanently removes the Workspace directory from disk.
- `RenameWorkspace`: Updates the Workspace name in the manifest.
- `GetActiveWorkspace`: Returns the context of the currently open Workspace.
- `GetRecentWorkspaces`: Returns the history of previously opened Workspaces.

---

## 5. Consumed Interfaces

The Workspace module consumes:
- Filesystem APIs (for directory creation, manifest reading/writing, database initialization)
- SQLite Database Provider (for schema migration and connection management)

---

## 6. Published Events

| Event | Description |
|---|---|
| `WorkspaceCreated` | Emitted when a new Workspace directory and manifest are successfully created. |
| `WorkspaceOpened` | Emitted when a Workspace is successfully loaded and connected. |
| `WorkspaceClosed` | Emitted when the active Workspace is cleanly closed. |
| `WorkspaceRenamed` | Emitted when the Workspace name is updated in the manifest. |
| `WorkspaceDeleted` | Emitted when a Workspace is permanently deleted from the filesystem. |
| `WorkspaceMigrationCompleted` | Emitted when a database migration completes successfully during open. |

---

## 7. Consumed Events

The Workspace module does not typically consume domain events from other modules, as it sits at the root of the dependency graph. 

---

## 8. Dependencies

- **Infrastructure:** SQLite (via Prisma), Local Filesystem
- **System:** OS-level path constraints and directory access permissions

---

## 9. Extension Points

- None. The Workspace lifecycle is a core system capability and is not extensible via plugins.

---

## 10. Background Jobs

While Workspace management operations themselves are synchronous, the active Workspace acts as the orchestrator for module background services.

The following background services are expected to **start** after a Workspace becomes active:
- Search indexing
- Embedding generation
- OCR queue
- Autosave
- Synchronization monitoring
- Plugin initialization

The following background services must **stop** gracefully during Workspace shutdown before the database connection is closed:
- Search indexing
- Embedding generation
- OCR queue
- Autosave
- Synchronization monitoring
- Plugin execution

---

## 11. Settings

Workspace settings are managed via the Settings module. The Workspace module itself stores only its core identity (name, ID, versions) in `manifest.json`.

---

## 12. Acceptance Criteria

- A new Workspace can be created, populated with content, closed, and successfully reopened with all content intact.
- Multiple Workspaces can be active and switchable in a single application session.
- Deleting a Workspace removes all associated local data from the filesystem.
- Opening a Workspace whose `schemaVersion` is higher than `CURRENT_SCHEMA_VERSION` is refused.
- A pre-migration backup is created automatically before any migration runs.

---

## 13. Cross References

- **Architecture:** [15-WorkspaceManifest.md](../../01-architecture/15-WorkspaceManifest.md), [ADR-009-WorkspaceIsolation.md](../../01-architecture/ADR-009-WorkspaceIsolation.md)
- **Database:** [02-StorageLayout.md](../../02-database/02-StorageLayout.md)
