# 06 — Folder Recovery

> **Document Type:** Module Specification
> **Module:** folder
> **Status:** Draft
> **Version:** 1.0
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [02-FolderHierarchy.md](./02-FolderHierarchy.md) · [../workspace/07-WorkspaceRecovery.md](../workspace/07-WorkspaceRecovery.md)

---

## 1. Purpose

This document describes how the Folder module detects, handles, and repairs corrupted or inconsistent folder hierarchies. It ensures that user organization is gracefully recovered in the event of database errors, sync conflicts, or failed imports.

---

## 2. Scope

**This document covers:**
- Recovery principles for hierarchical data.
- Detection of corrupted relationships.
- Repair strategies for missing parents, orphaned folders, and cycles.
- Interaction with the Workspace Recovery system.

**This document does NOT cover:**
- Database backup restoration procedures (see `workspace/07-WorkspaceRecovery.md`).

---

## 3. Recovery Principles

1. **Preserve User Content:** Folder recovery must never result in the deletion of user Folders or the Notes contained within them.
2. **Graceful Relocation:** If a Folder's parent cannot be resolved, the Folder should be safely relocated to the Root rather than hidden.
3. **Automated Repair:** Where mathematically possible, the system should automatically repair the hierarchy without prompting the user.

---

## 4. Recovery Scenarios

### 4.1 Missing or Deleted Parent
**Scenario:** A Folder has a `parentId` pointing to a UUID that no longer exists in the database (or belongs to a Permanently Deleted Folder), while the child Folder itself is Active. This can happen during complex sync conflicts or partial database restorations.
**Detection:** The system detects an invalid foreign key or missing parent record during Tree traversal.
**Repair Strategy:** The system automatically sets the `parentId` of the orphaned Folder to `null`, anchoring it safely to the Workspace Root. 

### 4.2 Broken Hierarchy / Corrupted Relationships
**Scenario:** The database contains an acyclic violation (a circular reference, e.g., A -> B -> C -> A) introduced by a bug or a malicious import file.
**Detection:** The recursive Tree traversal (CTE) detects a cycle or exceeds the maximum safe depth limit.
**Repair Strategy:** 
1. The system isolates the cycle.
2. It arbitrarily breaks the cycle at the oldest modified Folder by setting its `parentId` to `null` (moving it to the Root).
3. A system log is generated.

### 4.3 Orphaned Folders
**Scenario:** A Folder belongs to a `workspaceId` that does not match the active Workspace, yet it was found in the current database.
**Detection:** Detected during the `WorkspaceRecovered` validation sweep.
**Repair Strategy:** The Folder is ignored during normal Workspace operation to prevent data spillage. A database cleanup job will eventually purge or re-assign records that have mismatched Workspace identities.

### 4.4 Import Failures
**Scenario:** A user imports a `.notebook` archive that contains a malformed Folder tree.
**Detection:** Validated during the Import module's staging phase.
**Repair Strategy:** The Import module invokes the Folder module's validation logic. If cycles or missing parents are found in the import payload, the Folder module attempts to flatten the invalid branches to the Root before committing to the database.

---

## 5. Workspace Recovery Interaction

The Folder module does not initiate full database restores. Instead, it relies on the `WorkspaceRecovered` event emitted by the Workspace module. 

Upon receiving `WorkspaceRecovered`:
1. The Folder module runs a **Hierarchy Rebuilding and Validation** routine.
2. It queries for all Folders with missing parent UUIDs and anchors them to the Root.
3. It validates that no circular paths exist.
4. If repairs were made, it emits standard `FolderMoved` events for the UI to update if currently rendered.

---

## 6. Acceptance Criteria

- The application successfully loads and displays a Workspace even if a Folder's parent UUID is missing from the database.
- Folders with missing parents automatically appear at the Root level.
- The tree traversal algorithm does not infinite-loop when a circular reference is artificially introduced into the database.
