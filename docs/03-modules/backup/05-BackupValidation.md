# 05 — Backup Validation

> **Module:** Backup & Restore
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Backup Validation subsystem is the gatekeeper that guarantees the integrity of both outbound backups (creation) and inbound backups (restoration). It prevents the propagation of data corruption.

---

## 2. Validation Philosophy

- **Validation protects Notebook integrity.** It is the primary defense against data loss.
- **Invalid backups are never restored.** No exceptions.
- **Corrupt workspaces are never backed up.** If the active database is corrupt, creating a backup implies a false sense of security.

### 2.1 Backup Metadata Philosophy
Backup metadata assists validation. Examples include creation timestamp, application version, backup format version, and workspace identifier. Metadata never replaces Notebook content; it purely exists to ensure that a derived artifact is safely compatible with the target environment.

---

## 3. Validation Phases

### 3.1 Backup Validation (Outbound)
Before a backup is finalized, the system validates the source data:
- **Integrity Validation:** Executes `PRAGMA integrity_check` on the SQLite database.
- **Manifest Validation:** Ensures all required metadata (Workspace ID, version) is present.

### 3.2 Restore Validation (Inbound)
Before an extracted artifact replaces the active Workspace:
- **Integrity Validation:** Executes `PRAGMA integrity_check` on the extracted SQLite database in the temporary directory.
- **Compatibility Validation:** Checks the `schemaVersion` in the backup manifest against the current application version.

### 3.3 Failure Validation
When an error is caught during either phase:
- The process is aborted immediately.
- The error is classified (e.g., `SchemaMismatch`, `DatabaseCorruption`, `MissingAttachments`).

### 3.4 Recovery Validation
If a restore operation fails mid-swap, the recovery process kicks in to revert to the pre-restore state. This reverted state must also pass a quick validation check before the UI is unlocked, ensuring the recovery was successful.

---

## 4. Business Rules

- **Validation protects Notebook integrity.** Notebook integrity must always be preserved.
- **Backup failures never damage the active Workspace.**
- **Restore failures never partially overwrite Notebook data.**
- **Restore is completed only after successful validation.** If validation fails, the existing Workspace remains completely unchanged.
- **Invalid backups are never restored.**

---

## 5. Acceptance Criteria

- Attempting to back up a Workspace with a corrupted SQLite database results in a `ValidationFailed` event and halts the backup process.
- Attempting to restore a backup artifact from an unsupported, future version of the Notebook application results in a schema compatibility failure.

---

## 6. Cross References

- [02-BackupLifecycle.md](./02-BackupLifecycle.md)
- [04-RestoreLifecycle.md](./04-RestoreLifecycle.md)
