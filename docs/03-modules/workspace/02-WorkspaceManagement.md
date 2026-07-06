# 02 — Workspace Management

> **Document Type:** Module Specification
> **Module:** workspace
> **Status:** Draft
> **Version:** 1.0
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [README.md](./README.md) · [01-WorkspaceLifecycle.md](./01-WorkspaceLifecycle.md) · [07-WorkspaceRecovery.md](./07-WorkspaceRecovery.md)

---

## 1. Purpose

This document details the specific operations available for managing Workspaces. It defines the business rules, validation criteria, user confirmations, and failure handling for each Workspace management action, including creation, opening, closing, renaming, and deletion.

---

## 2. Scope

**This document covers:**
- Create Workspace
- Open Workspace (from recent list or filesystem)
- Close Workspace / Switch Workspace
- Rename Workspace
- Delete Workspace
- Duplicate Workspace
- Move Workspace Location (conceptual)
- Launch screen behavior (Recent Workspaces)

**This document does NOT cover:**
- Workspace Import/Export (see `import-export/`)
- Workspace Backup/Restore (see `backup/`)
- Synchronization (see `sync/`)

---

## 3. Core Concepts

### 3.1 Recent Workspaces

"Recent Workspaces" is NOT owned by the Workspace module.
- It is Application-level state.
- It belongs to the Application module rather than an individual Workspace.
- A Workspace should have no knowledge of whether it is listed in Recent Workspaces.
- The Application is responsible for maintaining the Recent Workspaces list.
- The Workspace module only exposes information required by the Application.

### 3.2 Workspace Identity

A Workspace consists of three independent identifiers:
- **Workspace UUID:** This is the permanent identity and is immutable. Synchronization, backups, imports and exports use the Workspace UUID rather than the folder name.
- **Workspace Name:** May change over time.
- **Workspace Directory:** May change over time.

Renaming or moving a Workspace never changes its identity. For example, moving a Workspace from `C:\Notes\Personal` to `D:\Backups\Personal` or renaming it to "My Personal Notes" leaves the Workspace UUID unchanged.

---

## 4. Workflows

### 3.1 Create Workspace

**Precondition:** The user is on the launch screen or selects "New Workspace" from the application menu.

1. User selects "Create New Workspace".
2. System prompts the user for a Workspace Name and a local destination directory.
3. User provides inputs and confirms.
4. System validates the destination directory (must be empty or not exist).
5. System creates the directory structure (`attachments/`, `backups/`, etc.).
6. System generates a new UUID v4 and writes `manifest.json`.
7. System initializes the `database.db` with the current schema.
8. System adds the new Workspace to the application's Recent Workspaces list.
9. System transitions the Workspace to Active (Opens it).

**Postcondition:** The new Workspace is active and ready for use.
**Failure Handling:** If directory creation or DB initialization fails, the system attempts to clean up any created files and alerts the user (e.g., "Permission denied").

### 3.2 Open Workspace

**Precondition:** The user selects a Workspace from the recent list or browses to a `manifest.json` on disk.

1. System reads and validates `manifest.json` at the target path.
2. System checks `schemaVersion` against the application's supported version.
   - If version is unsupported (too new), abort with error.
   - If version requires migration, initiate Migration Workflow (creates backup, applies migration).
3. System verifies `database.db` exists. (If missing, see Recovery).
4. System establishes the database connection.
5. System adds/updates the Workspace in the Recent Workspaces list.
6. System renders the Workspace UI.

**Postcondition:** The Workspace is Active.

### 3.3 Close / Switch Workspace

**Precondition:** A Workspace is currently Active. User selects a different Workspace or exits the app.

1. System stops background queues (OCR, Embeddings) for the active Workspace.
2. System flushes any pending autosaves to the database.
3. System closes the database connection.
4. If switching, System initiates the Open Workspace workflow for the new target.

### 3.4 Rename Workspace

**Precondition:** A Workspace is Active or selected in the launch screen.

1. User selects "Rename Workspace".
2. System prompts for a new name.
3. User confirms.
4. System validates the name (not empty).
5. System updates the `name` field in `manifest.json`.
6. System updates the application's Recent Workspaces list.
7. System emits `WorkspaceRenamed` event to update the UI.

**Note:** Renaming does NOT alter the directory name on the filesystem, only the display name inside the manifest.

### 3.5 Delete Workspace

**Precondition:** User selects "Delete Workspace" from settings or the launch screen.

1. System displays a critical warning: "This will permanently delete all notes, attachments, and data in this Workspace from your computer. This cannot be undone."
2. System requires the user to type the Workspace name to confirm.
3. User confirms.
4. If the Workspace is Active, System Closes it (releases locks).
5. System removes the Workspace from the Recent Workspaces list.
6. System recursively deletes the Workspace directory from the filesystem.
7. System returns the user to the launch screen.

**Failure Handling:** If file locks prevent deletion, System alerts the user and deletes as much as possible, advising manual deletion of the remaining folder.

### 3.6 Duplicate Workspace

**Precondition:** Workspace is Disconnected (ideal) or Active.

1. User selects "Duplicate Workspace".
2. System prompts for a destination directory.
3. System copies the entire source directory to the destination.
4. System generates a new UUID v4.
5. System overwrites the `manifest.json` in the destination with the new UUID and appends "(Copy)" to the name.
6. System adds the new Workspace to the Recent list.

### 4.7 Move Workspace

**Precondition:** Workspace is Disconnected (ideal).

Moving a Workspace only changes its physical location.

It does NOT:
- Create a new Workspace
- Change the UUID
- Reset settings
- Affect synchronization identity
- Affect Version History

**Validation Rules:**
- **Before moving:** The destination directory must be valid, accessible, and not already contain a Workspace. The Workspace must not be actively open or locked.
- **After moving:** The system must verify the `manifest.json` and `database.db` are readable at the new location before updating the Application's Recent Workspaces list to point to the new path.

---

## 5. Business Rules & Validation

- **Directory Validation:** A Workspace must reside in a dedicated directory. The system shall refuse to initialize a Workspace in a root directory (e.g., `C:\`, `/`) or an already populated directory (unless it contains a valid `manifest.json`).
- **Manifest Supremacy:** If a directory contains a `database.db` but no `manifest.json`, it is an invalid Workspace. Recovery workflows must be invoked.
- **Name Constraints:** Workspace names must be between 1 and 100 characters.

---

## 6. UI Components

| Component | Responsibility |
|---|---|
| `LaunchScreen` | Displays recent Workspaces, provides Create and Browse options. |
| `WorkspaceCreator` | Modal or wizard for naming and selecting the path for a new Workspace. |
| `WorkspaceSettingsPanel` | UI within an active Workspace to trigger Rename or Delete operations. |

---

## 7. Error Handling & Edge Cases

| Edge Case | Expected Behavior |
|---|---|
| Recent Workspace directory deleted externally | The launch screen shows the item as "Missing". Clicking it prompts the user to locate it or remove it from the list. |
| App crashes during Workspace creation | The orphaned directory is left on disk. The user can manually delete it. It is not added to the Recent list. |
| OS denies permission to write to selected path | Display a clear error: "Cannot create Workspace here due to file permissions. Please choose a different folder." |

---

## 8. Acceptance Criteria

- [ ] Creating a Workspace successfully creates the manifest, database, and directories.
- [ ] Renaming a Workspace updates the manifest and the UI immediately.
- [ ] Deleting a Workspace requires typing the exact name and removes all files on disk.
- [ ] Attempting to open a Workspace with a missing database triggers a graceful error or recovery prompt.
