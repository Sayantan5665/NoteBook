# 07 — Workspace Recovery

> **Document Type:** Module Specification
> **Module:** workspace
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

This document defines how the Workspace module handles exceptional failure states, data corruption, and recovery scenarios. Notebook is a local-first application; therefore, robust recovery mechanisms are critical since there is no centralized cloud database team to restore user data.

---

## 2. Scope

**This document covers:**
- Recovery from a missing `manifest.json`.
- Recovery from a missing or corrupted `database.db`.
- Failed migration handling.
- Workspace validation and repair workflows.
- Handling missing attachment files.

**This document does NOT cover:**
- Routine Backup creation (see `backup/`).
- Sync conflict resolution (see `sync/`).

---

## 3. Recovery Principles

1. **Do No Harm:** If the system detects an inconsistent state, it must refuse to open the Workspace rather than risk further corruption.
2. **User Visibility:** The user must be informed of exactly what is wrong and what their options are. Silent failures are prohibited.
3. **Backup Supremacy:** The primary recovery mechanism for a corrupted database is to restore from the `backups/` directory.
4. **Graceful Degradation:** If an attachment file is missing but the database record exists, the Workspace opens, but the specific attachment displays an error UI.

---

## 4. Recovery Scenarios

### 4.1 Missing `manifest.json`
**Scenario:** A directory contains a `database.db` and an `attachments/` folder, but no manifest. This can happen if a user manually copies files or a write operation was interrupted.
**System Response:** The directory is not recognized as a Workspace on the Launch Screen.
**Recovery Workflow (Repair):**
1. User selects "Recover Workspace" and points to the directory.
2. System probes `database.db` to ensure it is a valid Notebook database.
3. System generates a new `manifest.json` with a new UUID and assigns a generic name (e.g., "Recovered Workspace").
4. System opens the Workspace normally.

### 4.2 Missing `database.db`
**Scenario:** The manifest exists, but the database file is gone.
**System Response:** When the user attempts to open the Workspace, the system displays a critical error: "Database file missing."
**Recovery Workflow (Restore):**
1. System checks the `backups/` folder.
2. If backups exist, the system prompts the user to select a backup to restore.
3. If no backups exist, the system informs the user that the Workspace is irreparably broken, offering to create a fresh, empty database so the attachments are not orphaned, or to delete the Workspace entirely.

### 4.3 Corrupted `database.db`
**Scenario:** SQLite throws a malformed database error during `PRAGMA integrity_check` on open.
**System Response:** The Workspace refuses to open.
**Recovery Workflow (Restore):**
1. Identical to 4.2 — prompt the user to restore from a known-good local backup.

### 4.4 Failed Migration
**Scenario:** The application updates, requiring a schema migration. The migration script fails halfway through.
**System Response:** The migration transaction rolls back (if possible). If the DB is left in an intermediate state, the application refuses to open it.
**Recovery Workflow (Automatic):**
1. By rule, a pre-migration backup is *always* created before applying schema changes.
2. Upon detecting a failed migration, the system prompts the user: "Database upgrade failed. Would you like to automatically restore to the pre-upgrade state?"
3. Upon confirmation, the system unzips the pre-migration backup over the corrupted files and restarts the Workspace.

### 4.5 Missing Attachment Files
**Scenario:** The database contains a record for an attachment, but the physical file is missing from the `attachments/` directory (e.g., deleted manually by the user outside the app).
**System Response:** The Workspace opens normally. This is a local inconsistency, not a fatal error.
**Recovery Workflow (Graceful Degradation):**
1. When the user navigates to the note containing the attachment, the UI renders a "Missing File" placeholder.
2. The UI offers an option to "Remove broken link" (which deletes the database record) or "Replace file" (which uploads a new file with the same UUID).

---

## 5. Recovery Priority

When performing full Workspace recovery or addressing widespread corruption, it is critical to recover data in the correct dependency order.

**Recommended recovery order:**
1. **Manifest** (Identity and schema definition)
2. **Database** (Core structured data and relationships)
3. **Attachments** (Binary user data referenced by the database)
4. **Indexes** (Derived search data)
5. **Caches** (Derived thumbnails, OCR text)

**Why caches should always be rebuilt rather than restored:**
Caches contain derivative data. Restoring caches from a backup introduces the risk of stale or mismatched data if the database or attachments have changed. Rebuilding caches from the restored authoritative data guarantees consistency and saves backup storage space.

**Why user data always has higher priority than derived data:**
Derived data (indexes, caches, embeddings) can always be regenerated computationally from the source material. User data (the database contents and attachment files) cannot be regenerated if lost. Therefore, recovery workflows must ensure user data is fully secured and validated before expending system resources on rebuilding derived state.

---

## 6. UI Components

| Component | Responsibility |
|---|---|
| `RecoveryWizard` | A distinct UI flow outside the main Workspace view that guides a user through restoring a backup or repairing a manifest. |
| `IntegrityWarningModal` | A blocking modal that prevents access to a corrupted Workspace. |

---

## 7. Acceptance Criteria

- [ ] A Workspace with a missing manifest can be successfully repaired and reopened.
- [ ] A corrupted database triggers the Recovery Wizard, allowing restoration from the `backups/` directory.
- [ ] A failed migration is safely caught, and the user is prompted to restore the automatic pre-migration backup.
- [ ] Missing attachment files do not prevent the Workspace from opening.
