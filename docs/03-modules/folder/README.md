# Folder Module

> **Document Type:** Module README
> **Module:** folder
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../workspace/README.md](../workspace/README.md) · [../notes/README.md](../notes/README.md)

---

## 1. Purpose

The Folder module is responsible for organizing Notes within a Workspace. It provides a hierarchical structure for organizing content visually and logically, allowing users to group related Notes. 

---

## 2. Scope

**This document covers:**
- Folder module structure and overview.
- The fundamental responsibilities of Folders in the application.
- Public interfaces and event contracts.

**This document does NOT cover:**
- Note content management (see `notes/`).
- Attachments (see `attachments/`).
- Workspace management (see `workspace/`).

---

## 3. Ownership and Responsibilities

The Folder module **owns ONLY folder organization.** 
- It owns the creation, renaming, moving, and deletion of Folders.
- It owns the maintenance of the Folder hierarchy (parent-child relationships).
- It is responsible for calculating derived Folder paths.

The Folder module **does NOT own:**
- Notes
- Attachments
- Search
- AI
- Synchronization
- Tags
- Workspace lifecycle

Folders only organize Notes; they do not contain the Notes in a physical sense, nor do they assume ownership of the Note data lifecycle.

---

## 4. Public Interfaces

The Folder module exposes the following logical capabilities:
- `CreateFolder`: Creates a new Folder under a specified parent (or root).
- `RenameFolder`: Changes the display name of a Folder.
- `MoveFolder`: Changes the parent of a Folder.
- `DeleteFolder`: Soft-deletes a Folder.
- `RestoreFolder`: Restores a soft-deleted Folder.
- `PermanentDeleteFolder`: Hard-deletes a Folder.
- `GetFolderTree`: Retrieves the complete folder hierarchy for the active Workspace.
- `GetFolderBreadcrumbs`: Calculates the path from root to a specific Folder.

---

## 5. Consumed Interfaces

- **Workspace Manager:** To verify the active Workspace context.
- **Database Provider:** To persist Folder records and relationships.

---

## 6. Published Events

The Folder module emits Domain Events when mutations occur:
- `FolderCreated`
- `FolderRenamed`
- `FolderMoved`
- `FolderDeleted`
- `FolderRestored`
- `FolderPermanentDeleted`

*(For details, see [05-FolderEvents.md](./05-FolderEvents.md))*

---

## 7. Consumed Events

- `WorkspaceOpened`: Triggers the loading of the Folder tree.
- `WorkspaceClosed`: Flushes Folder states and clears memory.
- `WorkspaceRecovered`: Triggers a validation of the Folder hierarchy.

---

## 8. Folder Identity

The Folder module adheres to the following identity principles:
- **Folder UUID is immutable:** A Folder's UUID is assigned at creation and never changes.
- **Permanent Identity:** The Folder UUID is the permanent identity of the Folder. Synchronization and imports rely on the Folder UUID rather than the Folder Path.
- **Folder Name may change:** Renaming a Folder does NOT change its identity.
- **Parent Folder may change:** Moving a Folder does NOT change its identity.
- **Folder Path may change:** As a derived property, the Path updates dynamically based on rename or move operations, leaving the core identity unchanged.

*(Practical Example: Moving a folder named "Q3 Planning" from "Work/Projects" to "Archive/2026" changes its Path and Parent, but its UUID remains exactly the same, ensuring all Notes within it remain safely linked.)*

---

## 9. Optional Folder Metadata

Future iterations of the Folder module may introduce optional presentation attributes. Examples include:
- **Folder Color:** A visual tint applied to the Folder icon in the UI.
- **Folder Icon:** A custom icon (e.g., an emoji or system glyph) replacing the default folder icon.
- **Description:** A short text snippet describing the Folder's contents.

These are strictly optional presentation attributes. They are used for visual customization and are NOT part of the Folder's structural identity.

---

## 10. Business Rules

- **Workspace Bound:** Every Folder belongs to exactly one Workspace.
- **Parent Constraints:** Every Folder has at most one parent. The Root Folder has no parent.
- **Acyclic Hierarchy:** The Folder hierarchy must remain acyclic (no circular parent relationships).
- **Safe Deletion:** Folder deletion shall never silently delete user content (Notes must be handled explicitly).
- **Identity Preservation:** Folder moves shall preserve Folder identity.
- **Immutable Identity:** Folder UUIDs are immutable.
- **Non-Identifier Names:** Folder names are not identifiers (siblings may have the same name, depending on strictness rules).
- **Derived Paths:** Folder paths are derived dynamically, not stored as permanent identities.

---

## 11. Dependencies

- **Infrastructure:** SQLite (for persisting Folder metadata), EventBus.
- **Domain:** Workspace module (implicit dependency through Workspace UUID context).

---

## 12. Extension Points

- UI Context Menus: Plugins may add custom actions to Folder context menus.
- Folder Icons (Future): Extensibility for custom folder icons or colors.

---

## 13. Background Jobs

- None by default. Folder operations are synchronous and immediate. Recovery or repair of the hierarchy runs as a synchronous user-initiated job.

---

## 14. Settings

- `DefaultSortOrder`: Global or Workspace-level setting for how sibling Folders are sorted (e.g., Alphabetical, Manual).
- `RememberExpansionState`: UI setting to remember which folders were expanded/collapsed.

---

## 15. Acceptance Criteria

- A user can create, rename, and delete Folders.
- A user can move a Folder into another Folder, provided it does not create a circular reference.
- Deleting a Folder does not permanently delete the Notes within it unless explicitly instructed by the user via a coordinated workflow.
- Folder hierarchy is accurately reconstructed when the Workspace is opened.

---

## 16. Cross References

- [01-FolderLifecycle.md](./01-FolderLifecycle.md)
- [02-FolderHierarchy.md](./02-FolderHierarchy.md)
- [03-FolderOperations.md](./03-FolderOperations.md)
- [04-FolderValidation.md](./04-FolderValidation.md)
- [05-FolderEvents.md](./05-FolderEvents.md)
- [06-FolderRecovery.md](./06-FolderRecovery.md)
