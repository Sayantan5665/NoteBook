# 03 — Folder Operations

> **Document Type:** Module Specification
> **Module:** folder
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

This document defines the discrete operations that mutate a Folder's state or hierarchy. It details the business logic, edge cases, and side effects associated with each user action.

---

## 2. Scope

**This document covers:**
- Standard Operations: Create, Rename, Move, Delete, Restore, Permanent Delete.
- Future Operations: Duplicate, Merge.
- Effects of these operations on Notes and child Folders.

**This document does NOT cover:**
- UI implementation details.
- Database query syntax.

---

## 3. Core Operations

### 3.1 Create Folder

**Description:** Creates a new Folder within the Workspace.
**Inputs:** `WorkspaceId`, `Name`, `ParentId` (optional).
**Business Rules:**
- The `Name` must pass character validation.
- If `ParentId` is provided, the target parent must exist and be Active in the same Workspace.
**Error Handling:** Fails if Workspace does not exist or Parent does not exist.
**Side Effects:** Emits `FolderCreated`.

### 3.2 Rename Folder

**Description:** Changes the display name of an existing Folder.
**Inputs:** `FolderId`, `NewName`.
**Business Rules:**
- The Folder must exist and be Active.
- The `NewName` must pass character validation.
**Error Handling:** Fails if Folder is Soft-Deleted.
**Side Effects:** Emits `FolderRenamed`. The derived Path for this Folder and all its children changes immediately.

### 3.3 Move Folder

**Description:** Reassigns a Folder to a new parent, or moves it to the Root.
**Inputs:** `FolderId`, `NewParentId` (optional).
**Business Rules:**
- Must pass structural validation (cannot move a Folder into itself or its own descendants).
- Both the moving Folder and the new Parent must be Active.
- Preserves Folder identity (UUID).
**Effects on Child Folders:** Child folders move along with their parent seamlessly because they point to the moving Folder's UUID, which does not change.
**Effects on Notes:** Notes inside the moving Folder (and its descendants) move seamlessly, as their `folderId` references do not change.
**Side Effects:** Emits `FolderMoved`.

### 3.4 Drag and Drop (Move Mechanism)

**Description:** Drag-and-drop is explicitly a user interaction mechanism for moving Folders within the UI.
**Business Rules:** 
- The underlying operation and business rules remain strictly identical to standard Move Folder operations.
- All validation rules must apply before the drop is accepted by the backend.
**Examples of Enforced Validation:**
- Prevent circular relationships (cannot drop a Folder into its own child).
- Prevent moving a Folder into itself.
- Prevent invalid parent assignments (e.g., dropping into a read-only or deleted area).

### 3.5 Delete Folder (Soft Delete)

**Description:** Moves a Folder to the Trash.
**Inputs:** `FolderId`.
**Business Rules:**
- The Folder must be Active.
- **NEVER Silently Delete Notes:** Deleting a Folder shall NEVER silently delete user content (Notes). 
- **Confirmation Requirement:** Explicit user confirmation is strictly required when attempting to delete a Folder that contains Notes.

**User Workflows during Deletion:**
When a user attempts to delete a non-empty Folder, the UI must intercept the action and offer the following resolutions:
1. **Cancel Deletion:** Abort the operation entirely.
2. **Move Notes to another Folder:** Reassign all Notes to a different Folder, then delete the empty Folder.
3. **Move Folder and Notes to Trash:** Cascading soft-delete that flags both the Folder and all its contained Notes as deleted. (These can later be restored from Trash).

**Effects on Child Folders:** All descendant Folders must also be Soft-Deleted recursively to maintain consistency.
**Effects on Notes:** If the user selects the cascading delete workflow, the Notes module must be notified to Soft-Delete all Notes contained within this Folder and its descendant Folders.
**Side Effects:** Emits `FolderDeleted`.

### 3.6 Restore Folder

**Description:** Recovers a Soft-Deleted Folder from the Trash.
**Inputs:** `FolderId`.
**Business Rules:**
- The Folder must be in the Deleted state.
- **Edge Case - Deleted Parent:** If the restored Folder's original parent is still Soft-Deleted or Permanently Deleted, the restored Folder is moved to the Root (i.e., `parentId` set to null).
**Effects on Child Folders:** Restoring a parent does NOT automatically restore its children (this prevents accidental mass restoration of things explicitly deleted previously). Alternatively, a prompt may offer to restore children.
**Side Effects:** Emits `FolderRestored`.

### 3.7 Permanent Delete Folder

**Description:** Hard-deletes a Folder from the database.
**Inputs:** `FolderId`.
**Business Rules:**
- The Folder must already be Soft-Deleted.
- **Confirmation Requirement:** Requires explicit user confirmation ("This action cannot be undone").
**Effects on Notes/Children:** All child Folders and contained Notes must be permanently deleted in a cascading transaction.
**Side Effects:** Emits `FolderPermanentDeleted`.

---

## 4. Future Operations

### 4.1 Duplicate Folder (Future)
**Description:** Deep-copies a Folder, its descendant Folders, and optionally its Notes.
**Business Rules:** New UUIDs must be generated for all copied entities to prevent conflicts. 

### 4.2 Merge Folder (Future)
**Description:** Combines two Folders.
**Business Rules:** All Notes from Folder A update their `folderId` to Folder B. Folder A is then Soft-Deleted. 

---

## 5. Performance Considerations

- **Moving:** Moving a Folder is an $O(1)$ operation in an Adjacency List model, as it requires updating exactly one row (the `parentId` of the moving Folder).
- **Deleting:** Soft-Deleting a Folder requires an $O(N)$ recursive query to locate and flag all descendant Folders and Notes. For very large trees, this should be executed in a single transaction to maintain atomicity.

---

## 6. Acceptance Criteria

- A Folder can be successfully created at the Root or nested.
- Moving a Folder updates its parent without breaking its children.
- Deleting a Folder successfully soft-deletes its contents.
- Restoring a Folder with a missing parent safely anchors it to the Root.
