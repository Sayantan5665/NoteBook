# Backup & Restore Module

> **Module:** Backup & Restore
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Backup & Restore module protects Notebook data by creating, managing, and restoring complete Workspace snapshots. It guarantees that users can recover their data safely in the event of local corruption, accidental deletion, or device failure.

---

## 2. Scope

**In Scope:**
- Orchestrating the creation of backup artifacts from a Workspace.
- Validating backups for integrity before and after creation.
- Orchestrating the restoration of a Workspace from a backup artifact.
- Defining extension points for compression, encryption, and off-site backup storage.

**Out of Scope:**
- Synchronization of live data (handled by the Synchronization module).
- Direct mutation of canonical domain entities (Notes, Attachments, etc.).
- Cloud-specific authentication or network transmission protocols.

---

## 3. Ownership

The Backup & Restore module **does NOT own** any Notebook entities.

- The Domain layer (Workspace, Notes, Folders) owns the canonical source of truth.
- Backup files are purely **derived artifacts**. They represent a historical snapshot of the canonical data.
- Restored data only becomes canonical Notebook data after it passes successful validation and replaces the active Workspace via the Workspace Manager.

---

## 4. Responsibilities

- Coordinate backup and recovery operations.
- Ensure all backup artifacts are strictly validated before they are finalized.
- Ensure all restored artifacts are strictly validated before they replace a Workspace.
- Publish lifecycle events (Started, Completed, Failed).
- Delegate physical storage and transmission to extension providers.

---

## 5. Dependencies

- **Workspace Manager:** To identify active Workspaces and coordinate the swapping of a Workspace during a restore.
- **Event Bus:** To broadcast status to the UI and other modules.
- **Domain Services:** To perform initial integrity checks on the active database.

---

## 6. Interfaces

### 6.1 Consumed Interfaces
- `IWorkspaceSession`: Access to current Workspace state.
- `IStorageProvider`: (Conceptual) for writing to the filesystem.

### 6.2 Extension Points
- `IBackupProvider`: For custom routing of backups (e.g., Cloud, Enterprise, Local).
- `ICompressionProvider`: For reducing backup artifact size.
- `IEncryptionProvider`: For securing backups at rest.

---

## 7. Events

### 7.1 Published Events
- `BackupStarted`, `BackupCompleted`, `BackupCancelled`, `BackupFailed`
- `RestoreStarted`, `RestoreCompleted`, `RestoreCancelled`, `RestoreFailed`
- `ValidationSucceeded`, `ValidationFailed`

### 7.2 Consumed Events
- `WorkspaceOpened`: May trigger an automatic backup check.
- `WorkspaceClosed`: May trigger a snapshot upon exit.
- `SynchronizationCompleted`: May trigger a backup of the latest synchronized state.

---

## 8. Business Rules

- **Backup is optional.** The system functions perfectly without it.
- **Restore requires successful validation.** A corrupt backup artifact must never overwrite a functional Workspace.
- **Backup artifacts never become Notebook entities.** They are isolated snapshots.
- **Restore never changes Notebook ownership.** It replaces the underlying data, but the Domain layer still governs the entities.
- **Failures never corrupt Notebook data.**

---

## 9. Acceptance Criteria

- A Workspace can be backed up to a discrete artifact file without locking the user out of the UI.
- A corrupted backup artifact is rejected during the Restore Validation phase, leaving the current Workspace intact.
- A successful restore accurately recreates the exact state of the Notes, Attachments, and Folders from the time of the backup.

---

## 10. Cross References

- [01-BackupOverview.md](./01-BackupOverview.md)
- [02-BackupLifecycle.md](./02-BackupLifecycle.md)
- [04-RestoreLifecycle.md](./04-RestoreLifecycle.md)
- [08-BackupGovernance.md](./08-BackupGovernance.md)
