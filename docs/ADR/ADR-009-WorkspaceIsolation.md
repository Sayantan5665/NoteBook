# ADR-009 — One SQLite Database Per Workspace (Workspace Isolation)

> **Document Type:** Architecture Decision Record
> **Status:** Accepted
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-SystemOverview.md §6](./01-SystemOverview.md) · [12-SynchronizationArchitecture.md](./12-SynchronizationArchitecture.md) · [08-RepositoryPattern.md](./08-RepositoryPattern.md) · [../00-overview/03-Scope.md §3.1](../00-overview/03-Scope.md)

---

## Decision

Each Notebook Workspace is stored as an independent directory containing its own `database.db` SQLite file. All data for a Workspace — notes, folders, attachments metadata, tags, todos, AI chat history, embeddings, FTS5 indexes, and version history — resides in that single database file. There is no shared global database. Multiple Workspaces on the same machine each have their own independent database.

The canonical storage layout is:

```
~/Notebooks/
    Work/
        manifest.json
        database.db
        attachments/
        cache/
        logs/
        backups/
    Personal/
        manifest.json
        database.db
        attachments/
        cache/
        logs/
        backups/
    Study/
        manifest.json
        database.db
        attachments/
        cache/
        logs/
        backups/
```

---

## Context

Notebook is a **Workspace-first** application. The Workspace is the top-level organizational and data isolation unit (see [../00-overview/03-Scope.md §3.1](../00-overview/03-Scope.md)). Every user data entity belongs to exactly one Workspace. Workspaces are designed to be:

- Created, renamed, deleted, exported, imported, backed up, restored, and synchronized independently.
- Fully self-contained — a Workspace can be moved to another machine by copying its directory.
- Isolated from each other — failure in one Workspace must not affect another.

A database strategy must support all of these properties.

---

## Alternatives Considered

### Alternative A — Single global database (all Workspaces in one file)

All Workspaces stored as rows in a single `~/.notebook/global.db`.

**Why rejected:**

- **Backup complexity:** Backing up one Workspace requires extracting a subset of a shared database. There is no simple "copy this file" operation.
- **Restore complexity:** Restoring one Workspace from backup risks partial overwrites in a shared database that contains other Workspaces' data.
- **Sync complexity:** Synchronizing one Workspace to Google Drive requires extracting and re-importing a subset of a shared database — a fragile, error-prone operation.
- **Corruption risk:** A single corrupted database affects all Workspaces simultaneously.
- **Encryption:** A single database cannot easily support different passphrases for different Workspaces.
- **Import/export complexity:** Exporting a Workspace requires serializing and extracting data from a shared schema. A directory copy is far simpler.
- **Deletion complexity:** Deleting a Workspace requires careful deletion of related rows across many tables. A directory deletion is atomic and complete.

### Alternative B — One database per Workspace, plus a global registry database

Each Workspace has its own `database.db`, and a separate global `registry.db` stores the list of Workspaces and application-level settings.

**Assessment:** This is a valid variant and a refined version of the chosen approach. The global registry database is acceptable — it is a small metadata-only file and does not contain user content. This variant may be implemented in the application configuration store (`app.getPath('userData')`) for tracking registered Workspaces, without changing the core decision that each Workspace's content is in its own database.

### Alternative C — One database per Workspace with an object store (e.g., PouchDB)

Each Workspace stored as a document database file, with built-in sync support.

**Why rejected:**

- PouchDB's sync model is designed for CouchDB replication, not Google Drive file synchronization.
- SQLite FTS5 and sqlite-vec are not available in document stores, requiring additional infrastructure.
- SQLite is more widely understood and better tooled than PouchDB for offline desktop applications.

---

## Why One Database Per Workspace

### Primary Reasons

| Reason | Detail |
|---|---|
| **Workspace isolation** | A crash, corruption, or schema migration issue in one Workspace's database has zero effect on all other Workspaces. |
| **Independent backup** | A Workspace backup is a directory copy (or archive). No partial extraction from a shared database is needed. |
| **Independent restore** | Restoring a Workspace replaces a directory. No other Workspace's data is at risk. |
| **Independent synchronization** | Sync operates on a self-contained directory. Enabling or disabling sync for one Workspace is a per-directory concern; no shared database coordination is needed. |
| **Independent AI embedding index** | Each Workspace's `database.db` contains its own sqlite-vec embedding vectors. Re-indexing one Workspace does not affect the others. |
| **Simpler export/import** | A Workspace export is the directory itself. Import places the directory in the Notebooks root and registers it in the application. No partial SQL extraction is needed. |
| **Better corruption isolation** | SQLite's WAL mode and integrity checks operate on a per-file basis. A corrupted `database.db` is isolated to one Workspace. |
| **Future encryption support** | Each database can be encrypted independently with SQLCipher, using a per-Workspace user-provided passphrase. This is not feasible with a shared database. |
| **Human-readable storage** | A user can navigate to `~/Notebooks/Work/` and understand what they are looking at. The layout is self-documenting. |

### Alignment with Core Principles

| Principle | How This Decision Supports It |
|---|---|
| **Offline-first** | No shared database server; each Workspace's SQLite file is fully operational on the local filesystem. |
| **Local-first** | The Workspace directory is the single source of truth. It requires no external service to read or write. |
| **Privacy-first** | Workspace data is isolated. No data from one Workspace can accidentally appear in another. |
| **Workspace-first** | The physical storage layout directly mirrors the logical Workspace model. |

---

## Trade-offs

| Trade-off | Mitigation |
|---|---|
| Opening a Workspace requires connecting a new Prisma client instance | The **Workspace Manager** manages PrismaClient lifecycle: create on open, disconnect on close. This is a well-understood pattern. |
| Cross-Workspace queries are not possible at the database level | Cross-Workspace search is out of scope. Each Workspace is intentionally independent. If global search across Workspaces is needed in the future, it is implemented at the application layer by querying each Workspace's search index separately and merging results. |
| Schema migrations must be applied to each Workspace's database individually | Migrations are run by the Workspace Manager on each Workspace open, using Prisma Migrate. All Workspaces converge to the current schema when opened. |
| A large number of registered Workspaces means a large number of database files | The application supports at least 10 registered Workspaces (NFR-SCALE-04). Each database file is small when the Workspace has few notes. This is not a practical concern for the target use case. |

---

## Future Considerations

- **Global registry database:** A small `~/.config/notebook/registry.db` for storing the list of registered Workspaces and application-level settings (as distinct from Workspace-level settings stored in `database.db`). This does not change the per-Workspace isolation model.
- **Per-Workspace encryption:** SQLCipher integration using a per-Workspace passphrase, as noted in NFR-SEC-06. The per-database layout is a prerequisite for this feature.
- **Cross-Workspace search:** If future versions support searching across Workspaces, the implementation queries each open Workspace's `ISearchRepository` independently and merges results at the application layer. No schema change is required.
- **Workspace database compaction:** Running `VACUUM` on `database.db` as a periodic background job to reclaim space after deletions.
