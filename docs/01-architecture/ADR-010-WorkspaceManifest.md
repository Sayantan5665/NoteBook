# ADR-010 — Workspace Manifest as a Separate Metadata File

> **Document Type:** Architecture Decision Record
> **Status:** Accepted
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [15-WorkspaceManifest.md](./15-WorkspaceManifest.md) · [ADR-009-WorkspaceIsolation.md](./ADR-009-WorkspaceIsolation.md) · [12-SynchronizationArchitecture.md](./12-SynchronizationArchitecture.md) · [01-SystemOverview.md §6](./01-SystemOverview.md)

---

## Status

**Accepted**

---

## Context

Notebook is a Workspace-first application. Each Workspace is a self-contained directory containing a SQLite database and attachments. The application must be able to:

1. **Discover** available Workspaces at startup without opening any database.
2. **Identify** a Workspace by a stable, unique ID that persists across renames and machine migrations.
3. **Validate** a Workspace before opening it — to detect incompatible schema versions, corrupt databases, or Workspaces created by a newer application version.
4. **Drive database migrations** by knowing the current schema version before connecting Prisma.
5. **Coordinate synchronization** across multiple devices by tracking per-device sync state.
6. **Support backup and restore** with a clear, machine-readable description of the Workspace contents.
7. **Enable future capabilities** (encryption, multiple sync providers, read-only mode) without requiring database schema changes.

The question is: where should this Workspace-level metadata live?

---

## Decision

Each Workspace **shall** contain a `manifest.json` file at the root of its directory. The manifest is a plain JSON file that stores Workspace identity and operational metadata. It is the **first file read** when a Workspace is opened, and the **last file written** after a successful operation (migration, sync).

The SQLite `database.db` continues to store all user content. The manifest and the database are complementary and are never merged.

The full manifest specification is in [15-WorkspaceManifest.md](./15-WorkspaceManifest.md).

---

## Alternatives Considered

### Alternative A — Store all Workspace metadata inside SQLite

A dedicated `workspace_metadata` table in `database.db` stores the Workspace ID, name, schema version, and sync state.

**Why rejected:**

| Problem | Detail |
|---|---|
| **Cannot discover without opening** | To read Workspace metadata, the application must open and query the database. Opening 10+ databases on startup is slow and risky (a locked or corrupt database blocks discovery). |
| **Cannot validate before opening** | Schema version and application version compatibility must be known before the Prisma client connects — not after. |
| **No migration bootstrapping** | The Prisma client cannot connect until it knows the target schema. If the schema version is stored inside the database that must first be opened, there is a circular dependency: connect to read version, but cannot connect without knowing version. |
| **Sync requires opening the database** | To read the sync version or Workspace ID during a sync-only operation, the application would have to open the full database, initialize the repository layer, and query — a heavy operation for a metadata read. |
| **No corruption safety** | If `database.db` is corrupt, all Workspace metadata is inaccessible. The application cannot even display the Workspace name in an error message. |
| **No forward compatibility signal** | Without a manifest, there is no lightweight way to detect that a Workspace was created by a newer application version before attempting to open its database. |

### Alternative B — Store metadata in a global application registry (outside the Workspace directory)

A global `registry.db` or `registry.json` in `app.getPath('userData')` stores the list of Workspaces with their metadata.

**Why rejected as the primary store (though acceptable as a secondary cache):**

| Problem | Detail |
|---|---|
| **Not portable** | A Workspace moved to another machine, or restored from backup, has no metadata in the new machine's registry. The user must manually re-register it. |
| **Not self-describing** | A Workspace directory alone is not sufficient to understand the Workspace — you need external registry data. This violates the local-first self-containment principle. |
| **Sync complexity** | Syncing requires reading the Workspace's sync state. If the state is in a global registry, it cannot travel with the Workspace directory to Google Drive. |
| **Single point of failure** | A corrupt global registry affects all Workspaces simultaneously, not just one. |

> A global registry file **is** used as a secondary cache of registered Workspace paths (to know where to look for manifest files on startup). But the authoritative metadata for each Workspace lives in its own `manifest.json`.

### Alternative C — No manifest; infer everything from directory contents and database

Rely on directory scanning, database queries, and filename conventions.

**Why rejected:**

- Workspace discovery requires opening databases (slow, risky).
- Workspace identity (the UUID) has no stable, lightweight home.
- Sync conflict detection has no stable anchor without a per-device version number.
- Backup validation has no first-pass safety check before touching the database.

---

## Benefits

| Benefit | Detail |
|---|---|
| **Fast discovery** | `manifest.json` is a small JSON file. Reading 20 manifests on startup takes milliseconds. |
| **Safe discovery** | A corrupt database does not prevent the Workspace from appearing in the selector with an appropriate warning. |
| **Migration bootstrapping** | `schemaVersion` is read before Prisma connects, eliminating the circular dependency. |
| **Portable Workspaces** | A Workspace directory is self-describing. Copy the directory to any machine and open it — the manifest provides all required context. |
| **Sync anchor** | The manifest stores per-device sync versions and timestamps, making it the natural carrier of sync state across devices. |
| **Backup first-pass validation** | Backup validation starts with the manifest — a fast, safe check before touching the database. |
| **Forward compatibility** | `formatVersion` and `applicationVersion` allow the application to detect Workspaces from future versions before attempting to open them. |
| **Future capabilities** | Reserved fields (encryption, syncProviders, compression) can be added without touching the database schema. |
| **Human readable** | `manifest.json` is readable by any text editor. Users and support staff can inspect Workspace identity and status without opening a database tool. |

---

## Trade-offs

| Trade-off | Mitigation |
|---|---|
| Two files must be kept consistent (`manifest.json` and `database.db`) | The manifest is written at well-defined, controlled points (after migration, after sync). Its fields are derived from application state, not from database content. The application validates consistency on open. |
| `manifest.json` can become stale if a write is interrupted | Atomic write (write-to-temp then rename) prevents partial manifests. The `schemaVersion` field is written only after migrations complete, so a crash during migration leaves the old version — allowing safe retry. |
| Adds a file-format layer that must be maintained | The manifest format is stable and simple (plain JSON). `formatVersion` allows future layout changes without breaking existing code. |
| Discovery depends on `manifest.json` being present | Corrupted or missing manifests are handled by the recovery path (reconstruct from database, or remove from registry). The application never silently loses a Workspace. |

---

## Consequences

1. **Every new Workspace** created by the application **shall** have a `manifest.json` generated before `database.db` is created.
2. **Every Workspace open** **shall** read `manifest.json` before connecting the Prisma client.
3. **Every migration** **shall** update `manifest.json`'s `schemaVersion` field immediately after completion.
4. **Every successful sync** **shall** update `manifest.json`'s `lastSyncAt` and device `syncVersion` as the final write of the sync operation.
5. **Every backup** **shall** include `manifest.json` as the first entry and validate it as the first step of any restore operation.
6. **Every export** **shall** include `manifest.json`. Every import **shall** validate `manifest.json` before touching `database.db`.
7. The `databaseFilename` field in the manifest **shall** be the application's authoritative reference for which database file to open. Hard-coding `database.db` as a constant is acceptable in V1 but the field exists to enable future flexibility.

---

## Future Considerations

- **Encryption:** The `encryption` field in the manifest can carry the key derivation parameters (algorithm, salt, iterations). The application prompts for a passphrase, derives the key, and uses it to open the SQLCipher-encrypted database. The passphrase itself is never stored.
- **Multiple sync providers:** The `syncProviders` array replaces the flat device map for tracking sync state per provider, enabling Google Drive and WebDAV (or future providers) to maintain independent sync histories.
- **Global registry as a cache:** A global `~/.config/notebook/registry.json` listing known Workspace paths is a valid secondary cache. On startup, the application reads the registry to find where to look for manifests, then reads each manifest to populate the Workspace selector. The registry is rebuilt from filesystem discovery if lost.
- **Manifest signing:** A future `signature` field could contain a cryptographic signature of the manifest content, enabling tamper-detection for read-only or shared Workspaces.
