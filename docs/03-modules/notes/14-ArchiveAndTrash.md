> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 14 — Archive and Trash

---

## 1. Purpose

This document details the distinct organizational lifecycles of Archiving and Trashing a Note. It establishes the boundaries between hiding data to reduce clutter (Archive) versus soft-deleting data with the intent of eventual destruction (Trash).

## 2. Scope

**This document covers:**
- Archiving behavior.
- Trashing and Restoration behavior.
- Permanent Deletion and retention philosophy.

**This document does NOT cover:**
- Technical garbage collection implementations in SQLite.

## 3. Archive

- **Concept:** A user-driven action to hide a Note from default active views (like the main folder tree or recent notes list) to reduce clutter.
- **Business Rule:** Archive does NOT delete Notes.
- **Searchability:** Archived Notes remain fully searchable (subject to future search filter settings).
- **Identity:** Archiving merely toggles a metadata flag (`isArchived`). It does not change the Note's UUID or its parent Folder.
- **Workflow:** `Active` &rarr; `Archived` &rarr; `Active (Unarchived)`

### 3.1 Archive Philosophy
- Archive is strictly an organizational concept rather than a deletion mechanism.
- Archived Notes remain part of the canonical Notebook dataset.
- Archiving changes a Note's visibility rather than its ownership.
- Archived Notes remain available for recovery via normal unarchiving.
- Archived Notes may continue to participate in future indexing and backup depending on system configuration.

## 4. Trash and Restore

- **Concept:** A soft-deletion mechanism. The Note is moved to the system Trash, signaling the user's intent to eventually destroy it.
- **Business Rule:** Trash preserves recoverability. Trashed Notes are fully recoverable.
- **Visibility:** Trashed Notes are hidden from all standard views and search indexes (unless explicitly searching the Trash).
- **Workflow:** `Active / Archived` &rarr; `Trashed` &rarr; `Restored`
- **Restoration:** Restoring a Trashed Note removes the soft-delete flag. If the Note's original parent Folder was permanently deleted while the Note was in the Trash, the Note must be restored to a safe location (e.g., Workspace Root).

## 5. Permanent Delete

- **Concept:** The irreversible destruction of the Note record from the persistent database.
- **Business Rule:** Permanent deletion requires explicit user confirmation.
- **Action:** Permanently removes the canonical Note, cascading destruction to associated Version History and emitting a `NotePermanentDeleted` event to alert Search/AI subsystems to purge derived artifacts.
- **Workflow:** `Trashed` &rarr; `Permanent Delete`

## 6. Retention Philosophy and Recovery Interaction

- The Trash acts as a safety net. The system may implement retention policies on the Trash (e.g., "Empty Trash automatically after 30 days"), but this is an application configuration.
- The recovery hierarchy prioritizes the Trash over Version History.

## 7. Edge Cases

- **Sync Conflicts:** If a Note is Trashed on Device A, but heavily edited on Device B simultaneously, the Sync module resolves the conflict (often favoring the edit and un-trashing the note, or duplicating it). The Notes module simply accepts the final state dictated by Sync.

## 8. Acceptance Criteria

- Archiving a Note keeps it in its original Folder but hides it from active UI filters.
- Trashing a Note hides it from standard search results.
- Restoring a Note accurately clears the Trashed state and preserves the Note's original identity.
- Permanent deletion entirely removes the record from the database.

## 9. Cross References

- [01-NoteLifecycle.md](./01-NoteLifecycle.md)
- [10-Recovery.md](./10-Recovery.md)
