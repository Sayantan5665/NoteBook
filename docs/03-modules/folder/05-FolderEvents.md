# 05 — Folder Events

> **Document Type:** Module Specification
> **Module:** folder
> **Status:** Draft
> **Version:** 1.0
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [README.md](./README.md) · [../../01-architecture/09-EventBus.md](../../01-architecture/09-EventBus.md)

---

## 1. Purpose

This document details the events published and consumed by the Folder module. It defines the communication contracts allowing the Folder module to interact with the rest of the Notebook application without tight coupling.

---

## 2. Scope

**This document covers:**
- Published Domain Events and their conceptual payloads.
- Consumed System/Domain Events and the resulting actions.

**This document does NOT cover:**
- Implementation details of the EventBus payload serialization.

---

## 3. Published Events

The Folder module publishes these Domain Events when its internal state changes. Other modules (like UI, Notes, or Search) subscribe to these to update their own state.

### `FolderCreated`
- **Trigger:** A new Folder is successfully saved to the database.
- **Conceptual Payload:**
  - `workspaceId`
  - `folderId`
  - `name`
  - `parentId` (optional)
- **Primary Consumers:** UI Tree View (to insert the new node).

### `FolderRenamed`
- **Trigger:** A Folder's display name is updated.
- **Conceptual Payload:**
  - `workspaceId`
  - `folderId`
  - `newName`
  - `oldName`
- **Primary Consumers:** UI Tree View, Breadcrumb navigators.

### `FolderMoved`
- **Trigger:** A Folder's `parentId` is changed.
- **Conceptual Payload:**
  - `workspaceId`
  - `folderId`
  - `newParentId`
  - `oldParentId`
- **Primary Consumers:** UI Tree View (to detach and reattach the node).

### `FolderDeleted`
- **Trigger:** A Folder is Soft-Deleted.
- **Conceptual Payload:**
  - `workspaceId`
  - `folderId`
- **Primary Consumers:** 
  - **UI Tree View:** To remove the Folder from the active hierarchy.
  - **Notes Module:** To cascade the Soft-Delete to all Notes contained within the Folder.

### `FolderRestored`
- **Trigger:** A Soft-Deleted Folder is recovered.
- **Conceptual Payload:**
  - `workspaceId`
  - `folderId`
  - `newParentId` (may differ from original if original parent is deleted)
- **Primary Consumers:** UI Tree View, Notes Module (optional, if cascading restore is supported).

### `FolderPermanentDeleted`
- **Trigger:** A Soft-Deleted Folder is Hard-Deleted from the database.
- **Conceptual Payload:**
  - `workspaceId`
  - `folderId`
- **Primary Consumers:** Notes Module (to cascade Hard-Delete to orphaned notes, if applicable), Sync Module.

---

## 4. Consumed Events

The Folder module listens for the following events to trigger internal workflows.

### `WorkspaceOpened`
- **Source:** Workspace Module.
- **Trigger:** A user switches to or opens a Workspace.
- **Folder Action:** The Folder module flushes any previous Workspace state from memory, queries the database for the active Workspace UUID, and reconstructs the Folder Tree for the UI.

### `WorkspaceClosed`
- **Source:** Workspace Module.
- **Trigger:** A Workspace is being disconnected.
- **Folder Action:** Clears all cached Folder trees and Breadcrumb states from memory to ensure data isolation.

### `WorkspaceRecovered`
- **Source:** Workspace Module.
- **Trigger:** The Workspace database underwent an automated repair or restore.
- **Folder Action:** Initiates a background structural validation check on the Folder hierarchy to detect any orphaned Folders or broken parent references caused by the recovery.

---

## 5. Acceptance Criteria

- Renaming a Folder correctly dispatches `FolderRenamed` with the correct payload.
- Deleting a Folder dispatches `FolderDeleted`, and the UI accurately removes it without requiring a full page refresh.
- The Folder module correctly rebuilds its state upon receiving `WorkspaceOpened`.
