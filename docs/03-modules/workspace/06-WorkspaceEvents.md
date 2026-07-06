# 06 — Workspace Events

> **Document Type:** Module Specification
> **Module:** workspace
> **Status:** Draft
> **Version:** 1.0
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [README.md](./README.md) · [../../01-architecture/09-EventBus.md](../../01-architecture/09-EventBus.md)

---

## 1. Purpose

This document details the domain events published by the Workspace module. Since the Workspace sits at the root of the application hierarchy, other modules rely heavily on these lifecycle events to initialize their own states, start background queues, or release resources.

---

## 2. Scope

**This document covers:**
- Published Workspace events.
- The conceptual payload of each event.
- The trigger condition for each event.

**This document does NOT cover:**
- Implementation details of the EventBus.
- Events published by other modules (e.g., NoteCreated).

---

## 3. Published Events

The Workspace module emits the following events. Other modules (like Sync, Backup, Settings, and AI) subscribe to these events.

These events are categorized into Domain Events and System Events.

### 3.1 Domain Events

Domain events represent business-level changes to the state or lifecycle of a Workspace.

#### `WorkspaceCreated`
- **Trigger:** A new Workspace directory, manifest, and database are successfully initialized.
- **Payload:** `workspaceId`, `path`, `name`.
- **Primary Consumers:** Launch Screen UI (to update recent list).

#### `WorkspaceOpened`
- **Trigger:** A Workspace is successfully validated, migrated (if needed), and the Prisma connection is established. It is now the Active Workspace.
- **Payload:** `workspaceId`, `path`, `name`, `schemaVersion`.
- **Primary Consumers:** 
  - **AI Module:** To initialize the Ollama connection and check pending embedding queues.
  - **Settings Module:** To load Workspace-specific preferences into memory.
  - **Sync Module:** To check if a background sync is scheduled or if there are unresolved conflicts.
  - **Notifications Module:** To display any pending alerts for this Workspace.

#### `WorkspaceClosed`
- **Trigger:** The Active Workspace is cleanly disconnected (due to app exit or switching).
- **Payload:** `workspaceId`.
- **Primary Consumers:**
  - **All Modules:** Must immediately halt background processing, cancel pending writes, and release memory caches associated with this Workspace.

#### `WorkspaceRenamed`
- **Trigger:** The user updates the Workspace name, and the manifest is successfully rewritten.
- **Payload:** `workspaceId`, `newName`.
- **Primary Consumers:** UI Shell (to update the window title and sidebar).

#### `WorkspaceDeleted`
- **Trigger:** A Workspace is permanently removed from the filesystem.
- **Payload:** `workspaceId`.
- **Primary Consumers:** Launch Screen UI (to remove from the recent list).

#### `WorkspaceRecovered`
- **Trigger:** A recovery workflow (e.g., database rebuild from backup) completes successfully.
- **Payload:** `workspaceId`, `recoveryType`.
- **Primary Consumers:** Notifications Module.

### 3.2 System Events

System events represent operational, background, or infrastructural processes occurring within the Workspace context.

#### `WorkspaceMigrationStarted`
- **Trigger:** The SQLite database migration process begins.
- **Payload:** `workspaceId`, `oldVersion`.
- **Primary Consumers:** UI Shell (to show progress).

#### `WorkspaceMigrationCompleted`
- **Trigger:** The SQLite database is successfully migrated to a new schema version during the Open workflow.
- **Payload:** `workspaceId`, `oldVersion`, `newVersion`.
- **Primary Consumers:** Notifications Module (to inform the user of the upgrade).

#### `WorkspaceValidationStarted`
- **Trigger:** Integrity checks begin on the Workspace files.
- **Payload:** `workspaceId`.
- **Primary Consumers:** UI Shell.

#### `WorkspaceValidationCompleted`
- **Trigger:** Integrity checks complete.
- **Payload:** `workspaceId`, `results`.
- **Primary Consumers:** UI Shell.

#### `WorkspaceRepairStarted`
- **Trigger:** Automated repair processes begin on corrupted data.
- **Payload:** `workspaceId`.
- **Primary Consumers:** UI Shell.

#### `WorkspaceRepairCompleted`
- **Trigger:** Automated repair processes finish.
- **Payload:** `workspaceId`, `success`.
- **Primary Consumers:** Notifications Module.

#### `BackupStarted`
- **Trigger:** A Workspace backup process begins.
- **Payload:** `workspaceId`.
- **Primary Consumers:** Backup Manager.

#### `BackupCompleted`
- **Trigger:** A Workspace backup process completes.
- **Payload:** `workspaceId`, `backupPath`.
- **Primary Consumers:** Notifications Module.

---

## 4. Consumed Events

The Workspace module is fundamentally a provider, not a consumer. It does not listen to `NoteCreated` or `AttachmentAdded` events. 

However, it may consume system-level events such as:
- **`AppShutdownRequested`**: To trigger the `CloseWorkspace` workflow gracefully.

---

## 5. Business Rules

- **Synchronous vs Asynchronous:** `WorkspaceClosed` must block application exit until all consumers acknowledge they have released their file locks and flushed their buffers.
- **Immutability:** Event payloads are read-only and reflect the state of the system at the exact moment the event occurred.

---

## 6. Acceptance Criteria

- [ ] When a Workspace is Opened, dependent modules (like AI and Sync) receive the `WorkspaceOpened` event and initialize correctly.
- [ ] When a Workspace is Closed, all background queues for that Workspace halt processing.
