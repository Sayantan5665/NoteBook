# Sync Module

> **Document Type:** Module README
> **Module:** sync
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §14](../../00-overview/04-FunctionalRequirements.md) · [../../01-architecture/12-SynchronizationArchitecture.md](../../01-architecture/12-SynchronizationArchitecture.md) · [../../01-architecture/11-SecurityArchitecture.md](../../01-architecture/11-SecurityArchitecture.md) · [../../02-database/02-StorageLayout.md](../../02-database/02-StorageLayout.md) · [../workspace/README.md](../workspace/README.md) · [../backup/README.md](../backup/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Sync module defines how Notebook synchronizes a Workspace to the user's Google Drive account — the only optional network-dependent feature in the core application.

Sync is a convenience feature, not a dependency. Every core feature works entirely without sync enabled. Sync allows users to access their Workspace from multiple machines or to have a cloud-accessible copy as a secondary safeguard against machine loss.

The local SQLite database and filesystem are always authoritative. Google Drive is a replica. The sync system's job is to keep the replica consistent with the local copy, and to handle the merge when both sides have changed.

---

## Scope

**This module covers:**
- Google Drive OAuth 2.0 authorization flow
- Secure storage and retrieval of OAuth credentials (system credential store)
- Initiating a sync operation (user-initiated and scheduled)
- Sync status display (idle, syncing, last synced timestamp, error)
- Uploading local changes to Google Drive
- Downloading remote changes from Google Drive
- Conflict detection and resolution options (keep local, keep remote, keep both)
- Pre-sync safety backup creation before any overwrite
- Disabling sync and revoking Google Drive access
- Incremental attachment sync based on file checksums

**This module does NOT cover:**
- Backup creation and restore (see `backup/`)
- Import/export of Workspace archives (see `import-export/`)
- Other cloud sync providers (these would be added via plugins)

---

## Responsibilities

This module is responsible for:

- Managing the Google Drive OAuth authorization lifecycle (authorize, refresh, revoke)
- Reading and writing `manifest.json.syncConfig` fields for sync state tracking
- Determining sync delta: which files have changed locally since last sync
- Transferring database and attachment files to Google Drive
- Transferring changes from Google Drive to local storage
- Detecting conflicts: where both local and remote versions have changed since last sync
- Presenting conflict resolution UI to the user
- Creating a pre-sync backup before overwriting local data with remote changes
- Updating `manifest.json` with the last sync timestamp after a successful sync

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-GoogleDriveAuth.md` | Planned | OAuth 2.0 flow, credential storage, token refresh, revocation |
| `02-SyncFlow.md` | Planned | Sync initiation, delta detection, upload, download, sync status |
| `03-ConflictResolution.md` | Planned | Conflict detection, resolution modes, user dialog |
| `04-SyncSafetyBackup.md` | Planned | Pre-sync backup creation and handling if backup fails |
| `05-IncrementalAttachmentSync.md` | Planned | Checksum-based incremental attachment sync |

---

## Key Business Rules (Summary)

- Sync is opt-in. The application never initiates a sync without user authorization.
- The local Workspace is always authoritative. Google Drive is always a replica, never the primary.
- OAuth credentials are stored in the local system credential store (OS keychain). They are never stored in `manifest.json` or `database.db`.
- Before overwriting any local file with a remote version, a pre-sync backup is created. If the backup fails, the sync is aborted.
- A sync failure never corrupts or deletes local data.
- `backups/` directory contents are never synced to Google Drive.
- Sync is always per-Workspace. Enabling or disabling sync for one Workspace does not affect any other Workspace.
- Attachment files are synced incrementally using SHA-256 checksums — files with matching checksums are not retransferred.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-SYNC-01 | Optional synchronization to user-owned Google Drive |
| FR-SYNC-02 | Google Drive OAuth 2.0 authorization |
| FR-SYNC-03 | OAuth credentials stored securely in system credential store |
| FR-SYNC-04 | Sync is user-initiated; no silent background sync |
| FR-SYNC-05 | Conflict detection and user-resolution options |
| FR-SYNC-06 | Sync status display in the Workspace UI |
| FR-SYNC-07 | Sync failure does not corrupt local data |
| FR-SYNC-08 | Revoke Google Drive access and disable sync |
| FR-SYNC-09 | All core features remain operational without sync |
| FR-SYNC-10 | Google Drive is a replica only; local SQLite is always authoritative |

---

## Future Considerations

- **Scheduled automatic sync:** Allow users to configure a sync schedule (e.g., every hour, daily at midnight) for hands-free sync. FR-SYNC-04 permits user-configured schedules; this is a future UX enhancement.
- **Alternative sync providers (plugin):** iCloud Drive, Dropbox, or OneDrive sync via plugin extension points. The sync subsystem is designed with a provider abstraction to support this.
- **Selective sync:** Allow users to exclude specific folders or large attachments from sync to manage Google Drive quota.
- **Sync conflict history:** A log of past conflicts and their resolutions, for review and audit.
