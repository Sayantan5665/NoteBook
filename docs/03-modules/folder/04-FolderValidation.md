# 04 — Folder Validation

> **Document Type:** Module Specification
> **Module:** folder
> **Status:** Draft
> **Version:** 1.0
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [02-FolderHierarchy.md](./02-FolderHierarchy.md) · [03-FolderOperations.md](./03-FolderOperations.md)

---

## 1. Purpose

This document outlines the strict validation rules enforced by the Folder module to ensure data integrity, prevent structural corruption (like circular references), and maintain a predictable user experience.

---

## 2. Scope

**This document covers:**
- Structural validation (cycles, self-referencing).
- Naming rules and constraints.
- Operation-specific validation constraints.
- Validation philosophy.

**This document does NOT cover:**
- Note-level validation.

---

## 3. Validation Philosophy

The Folder module operates on a philosophy of **Preventative Integrity**. The system must mathematically guarantee that it is impossible to corrupt the folder hierarchy via the UI or API. It is better to reject a Move operation than to create an unresolvable graph cycle that breaks the application.

---

## 4. Structural Validation

### 4.1 No Circular Parent Relationships
A Folder cannot be moved into any of its own descendants.
- **Rule:** Before executing a Move operation, the system must traverse upwards from the target `NewParentId` to the Root. If the moving `FolderId` is encountered during this traversal, the move is rejected.

### 4.2 No Parent Equals Self
A Folder cannot be its own parent.
- **Rule:** `FolderId` must never equal `ParentId`.

### 4.3 Workspace Ownership Validation
A Folder cannot have a parent that belongs to a different Workspace.
- **Rule:** When creating or moving a Folder, both the target Folder and the Parent Folder must have matching `WorkspaceId` fields.

---

## 5. Naming Validation

### 5.1 Invalid Characters
Folder names must be clean and safe for display.
- **Rule:** Names cannot contain control characters (e.g., `\n`, `\t`).
- **Rule:** While the database allows most Unicode, the UI should strip leading/trailing whitespace.

### 5.2 Duplicate Name Rules
- **Default Strictness:** Siblings (Folders sharing the exact same `parentId` and `workspaceId`) should generally avoid having identical names to prevent user confusion. 
- **Rule:** The system *may* enforce unique names per parent. If enforced, creating or renaming a Folder to a sibling's name will append a suffix (e.g., `Archive (1)`), or return a validation error.
- **Paths:** Because Paths are derived from names, unique sibling names guarantee unique Paths.

### 5.3 Reserved Names
Certain names may be reserved by the system to avoid conflicts with virtual views or future features.
- **Rule:** Names such as `.notebook`, `Trash`, or `System` may be restricted based on application configuration.

### 5.4 Maximum Path Length (Future)
To prevent UI overflow or export issues to filesystems with path length limits (e.g., Windows MAX_PATH 260 chars).
- **Rule:** The cumulative length of a Folder's derived path may be capped in future iterations.

---

## 6. Operation-Specific Validation

### 6.1 Moving Folders
- Must pass the Acyclic check (4.1).
- Must pass Workspace validation (4.3).
- Must verify the target Parent is Active (not Soft-Deleted).

### 6.2 Deleting Folders
- No specific validation required for Soft-Delete, other than ensuring the Folder exists and is Active. 
- Hard-Delete validates that the Folder is already Soft-Deleted.

---

## 7. Acceptance Criteria

- Attempting to set a Folder's parent to itself returns an explicit error.
- Attempting to move a Folder into its own child returns an explicit error and the move is canceled.
- Creating a Folder with an empty name is rejected by the API.
