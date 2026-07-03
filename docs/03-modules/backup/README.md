# Backup Module

> **Document Type:** Module README
> **Module:** backup
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §3 FR-WS-11](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/10-BackupStrategy.md](../../02-database/10-BackupStrategy.md) · [../../02-database/02-StorageLayout.md](../../02-database/02-StorageLayout.md) · [../workspace/README.md](../workspace/README.md) · [../sync/README.md](../sync/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Backup module defines the user-facing behavior of Notebook's local backup and restore system. It translates the technical backup strategy (documented in `docs/02-database/10-BackupStrategy.md`) into user-facing workflows, UI interactions, and observable behaviors.

Backups protect users from local data loss due to accidental deletion, database corruption, failed migrations, or accidental sync overwrites. A backup is a point-in-time ZIP archive of the entire Workspace stored in the Workspace's own `backups/` directory.

---

## Scope

**This module covers:**
- Manual backup creation ("Back Up Now")
- Scheduled automatic backup configuration and execution
- Backup archive listing and management UI
- Backup validation (manifest check, integrity check)
- Workspace restore from a backup archive
- Backup retention policy configuration
- Pre-migration backup (automatic; documented here as user-visible behavior)
- Pre-sync backup (automatic; described here as it is user-visible on restore)
- Pre-restore safety backup (automatic before any restore operation)

**This module does NOT cover:**
- Google Drive sync (see `sync/`)
- Workspace export for migration (see `import-export/`)
- Database integrity check mechanics (see `docs/02-database/10-BackupStrategy.md`)

---

## Responsibilities

This module is responsible for:

- Triggering backup creation in response to user actions and configured schedules
- Displaying the list of available backup archives with date, size, and type
- Guiding the user through the restore workflow with appropriate warnings and confirmations
- Communicating backup progress and completion status to the user
- Enforcing retention policies and listing exempt backups (pre-migration, pre-restore)
- Informing users that local backups are not protected against machine loss (clear limitation statement)

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-BackupCreation.md` | Planned | Manual backup workflow, scheduled backup configuration, backup naming |
| `02-BackupRestore.md` | Planned | Restore workflow, pre-restore backup, warnings, manifest/integrity validation |
| `03-BackupManagement.md` | Planned | Backup list UI, retention policy configuration, manual deletion |
| `04-AutomaticBackups.md` | Planned | Pre-migration, pre-sync, and pre-restore automatic backup behavior |

---

## Key Business Rules (Summary)

- The application never creates a backup archive of a database that fails `PRAGMA integrity_check`.
- A pre-restore safety backup is always created before any restore operation overwrites local data.
- Pre-migration and pre-restore backups are never automatically deleted by the retention policy.
- Backup archives in `backups/` are never synced to Google Drive.
- Manual backup is always available to the user, regardless of backup configuration settings.
- The user is explicitly informed during setup that local backups do not protect against machine loss.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-WS-11 | Create a local backup snapshot on demand |
| FR-WS-12 | Restore a Workspace from a local backup snapshot |

---

## Future Considerations

- **Incremental backups:** For large Workspaces, full backups are time-consuming. A future incremental backup would only archive changed files. See `docs/02-database/10-BackupStrategy.md §13`.
- **Backup to external storage:** Allowing users to configure an external directory or mounted drive as the backup destination.
- **Backup health dashboard:** A status view showing last backup time, backup count, total backup size, and next scheduled backup.
