# 05 — SQLite

> **Document Type:** Technology Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [00-DataModelPrinciples.md](./00-DataModelPrinciples.md) · [01-Overview.md](./01-Overview.md) · [08-Indexes.md](./08-Indexes.md) · [10-BackupStrategy.md](./10-BackupStrategy.md) · [../01-architecture/14-ArchitectureDecisions.md](../01-architecture/14-ArchitectureDecisions.md) (ADR-003)

---

## 1. Purpose

This document explains why SQLite was chosen as Notebook's primary database, and documents the specific SQLite configuration, modes, and operational patterns that the application uses. It is the authoritative reference for SQLite-related decisions.

---

## 2. Why SQLite

The choice of SQLite is documented in full as ADR-003. The summary below captures the essential reasoning.

### 2.1 Alignment with Core Principles

| Principle | How SQLite Satisfies It |
|---|---|
| **Offline-first** | SQLite has no server process. It runs entirely in-process. There is no network connection required — ever. |
| **Local-first** | A SQLite database is a single file on the user's filesystem. The user can copy, move, backup, and open it with any SQLite tool. |
| **Privacy-first** | Data never leaves the machine through the database layer. SQLite has no network capability. |
| **Workspace-first** | One database file per Workspace is a natural, filesystem-native model. A Workspace backup is a directory copy. |

### 2.2 Technical Advantages

**Embedded, serverless:** SQLite runs in the same process as the application. There is no daemon to start, manage, or crash. The application starts up in full database-ready state without any network handshake, connection pool initialization, or service discovery.

**Portable file format:** The SQLite file format is stable, open, and well-documented. A `database.db` file written today is readable by SQLite tools years from now. Users are not locked in to Notebook's application to read their own data.

**Mature extensions:** SQLite FTS5 and sqlite-vec are both mature extensions co-designed for the SQLite runtime. They integrate seamlessly — there is no foreign process, no network RPC, no separate index server.

**Transaction support:** SQLite provides full ACID transactions. Every write operation in Notebook is wrapped in a transaction (handled by Prisma). There is no risk of partial writes corrupting the data model.

**WAL mode:** SQLite's Write-Ahead Logging mode provides crash safety, improved read concurrency, and enables atomic hot backups.

**Zero-config:** SQLite requires no installation, no configuration file, no OS service. The Electron main process connects to a file path and everything works.

### 2.3 Alternatives Rejected

| Alternative | Why Rejected |
|---|---|
| **PostgreSQL (local)** | Requires a running server process. Overkill for a single-user local app. Complicates packaging and startup. |
| **PouchDB / LevelDB** | Sync model designed for CouchDB replication, not filesystem-level sync. No built-in FTS or vector search. |
| **LMDB** | High performance but no FTS or vector search built in. Narrower ecosystem. |
| **Single global SQLite (all Workspaces)** | Rejected because it eliminates per-Workspace isolation, independent backup, and simple delete. See ADR-009. |

---

## 3. SQLite Configuration

### 3.1 WAL Mode

**What it is:** Write-Ahead Logging (WAL) is a SQLite journal mode that appends changes to a separate WAL file rather than modifying the database file in place.

**Why it is required:**

- **Crash safety:** If the application crashes mid-write, the WAL file contains the in-progress transaction. On next open, SQLite rolls back the incomplete transaction cleanly. No data corruption occurs.
- **Concurrent reads:** Readers do not block writers and writers do not block readers in WAL mode. Because the Electron main process runs background jobs (OCR, embedding, sync) while the user is actively using the application, WAL mode eliminates the read-write contention that journal mode would impose.
- **Hot backup support:** A backup taken while the database is open and in WAL mode can capture a consistent snapshot by including the WAL file (or by triggering a WAL checkpoint first).

**Configuration:** WAL mode is enabled by issuing `PRAGMA journal_mode = WAL` on every new database connection, immediately after opening. This is idempotent — calling it on a database already in WAL mode has no effect.

**WAL checkpoint:** SQLite automatically checkpoints the WAL file (merges WAL entries back into the main database file) when the WAL reaches 1,000 pages. The application may also trigger a manual checkpoint during scheduled maintenance. See §6 (Maintenance) below.

### 3.2 Foreign Keys

**Configuration:** Foreign key enforcement is disabled by default in SQLite for backward compatibility. The application **shall** enable it on every connection:

```
PRAGMA foreign_keys = ON;
```

This pragma must be set for each connection — it is not persisted in the database file. Prisma's connection setup includes this pragma.

**Why this matters:** Without `PRAGMA foreign_keys = ON`, SQLite accepts `INSERT` and `DELETE` operations that violate foreign key constraints silently. The application's referential integrity depends on this pragma being set correctly.

### 3.3 Synchronous Mode

**Configuration:** `PRAGMA synchronous = NORMAL`

SQLite's default `FULL` synchronous mode performs an `fsync()` on every committed transaction. This is the safest setting but the slowest for write-heavy workloads. WAL mode enables `NORMAL` synchronous mode, which provides adequate durability: data is never lost due to application crashes (only OS crashes or power failure, which are rare and accepted trade-offs for the performance gain).

`SYNCHRONOUS = NORMAL` combined with `WAL` mode is the recommended configuration for most SQLite applications that prioritize performance without sacrificing crash safety from application-level failures.

### 3.4 Page Size

**Configuration:** Default SQLite page size (4096 bytes) is used. No custom page size is configured.

The default 4 KB page size is appropriate for the expected data access patterns in Notebook: sequential note reads, index scans, and moderate row sizes. Increasing the page size is a future optimization if query profiling identifies page-level bottlenecks in large Workspaces.

### 3.5 Cache Size

**Configuration:** Default SQLite page cache. May be tuned per connection via `PRAGMA cache_size`.

For the expected data volumes in a personal knowledge management application, the default cache size is adequate. Cache size tuning is a future optimization.

---

## 4. Transactions

Every write to the database is wrapped in an explicit transaction. Prisma handles this automatically for its generated query methods. Raw SQL queries (for FTS5 and sqlite-vec operations) are wrapped in the same transaction as their corresponding Prisma write.

**Transaction invariant:** A note save involves multiple operations:
1. `UPDATE notes SET title = ?, body = ?, updated_at = ? WHERE id = ?`
2. `UPDATE fts_notes SET title = ?, body = ? WHERE note_id = ?`
3. `INSERT INTO version_history ...`
4. `DELETE FROM wiki_links WHERE source_note_id = ?` followed by `INSERT INTO wiki_links ...`

All four operations **shall** execute within a single transaction. If any step fails, all steps are rolled back. The database never contains a note update without its corresponding FTS update, version history entry, or wiki link update.

**Transaction scope:** Transactions are opened at the repository call site and closed (commit or rollback) before the repository method returns. Long-running transactions are avoided because they can block other readers and writers.

---

## 5. Concurrency

### 5.1 Single-Writer Design

SQLite in WAL mode supports multiple concurrent readers but only one concurrent writer. Notebook is a single-user, single-application desktop tool. Concurrency concerns are minimal compared to a multi-tenant web application.

**Known concurrent writers in Notebook:**
- The user actively editing a note (periodic auto-save)
- Background jobs (OCR status update, embedding insert, backup)

These operations do not compete frequently. When they do, SQLite serializes writes using its built-in locking mechanism — one write completes before the next begins. The lock wait timeout is configured to a short period (500ms default); if a write times out, it is retried by the Background Job Manager.

### 5.2 No Multi-Process Access

The `database.db` file is opened exclusively by the Electron main process's Prisma client. No other process — including any plugin — has direct database access. Plugins access data only through the `PluginHostApi`, which delegates to Application Layer use cases, which use the Prisma client. This single-writer architecture eliminates the most common class of SQLite concurrency bugs.

### 5.3 Busy Timeout

**Configuration:** `PRAGMA busy_timeout = 5000` (5 seconds)

When a write operation cannot immediately acquire the database write lock, SQLite waits up to the `busy_timeout` duration before returning a `SQLITE_BUSY` error. Five seconds is generous for a single-user application; most write contention resolves in milliseconds.

---

## 6. Performance

### 6.1 Index Design

Performance-critical queries are backed by appropriate indexes. See [08-Indexes.md](./08-Indexes.md) for the full index specification.

The most performance-sensitive queries are:
- **Note list with sort:** `SELECT ... FROM notes WHERE folder_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC` — covered by a composite index on `(folder_id, deleted_at, updated_at)`.
- **FTS5 search:** Full-text search is served by the FTS5 virtual table, which has its own internal B-tree index.
- **Vector search:** sqlite-vec nearest-neighbor queries use the vec index.

### 6.2 Query Optimization

**Prefer index-covered queries:** Write queries that can be satisfied entirely from an index without a table scan. Use `EXPLAIN QUERY PLAN` during development to verify index usage.

**Avoid `SELECT *`:** Prisma-generated queries select specific columns. Raw SQL queries **shall** also specify column lists rather than using `SELECT *`.

**Limit result sets:** All list queries include a `LIMIT` clause or use cursor-based pagination. Returning unbounded result sets is prohibited.

---

## 7. VACUUM

### 7.1 What VACUUM Does

`VACUUM` rebuilds the entire database file, reclaiming free pages from deleted rows and defragmenting the B-tree structure. In SQLite, `DELETE` operations do not shrink the file — the freed pages are returned to the free list but remain in the file until `VACUUM` runs.

### 7.2 When VACUUM Should Run

VACUUM is a potentially long-running operation (seconds to minutes for large databases). It **shall not** run automatically during normal application use. It **should** run:

- On user request (via Settings → Maintenance → "Compact Database")
- As part of a scheduled maintenance job (configurable; default: disabled)

### 7.3 VACUUM in WAL Mode

In WAL mode, `VACUUM` rebuilds the database into a new file and then atomically replaces the original. This is safe but briefly requires extra disk space (up to 2× the database size during the operation). The application **shall** check available disk space before running VACUUM.

### 7.4 Incremental VACUUM

SQLite's `PRAGMA incremental_vacuum` is available for gradual free-page reclamation without a full database rebuild. This is a lower-impact alternative for scheduled maintenance in large Workspaces.

---

## 8. ANALYZE

### 8.1 What ANALYZE Does

`ANALYZE` scans the database tables and indexes, collects statistics about data distribution, and stores them in the `sqlite_stat1` table. The SQLite query planner uses these statistics to choose optimal query execution plans.

### 8.2 When ANALYZE Should Run

`ANALYZE` should run:

- After large batch operations (e.g., bulk import of hundreds of notes)
- Periodically in the background (default: once per week per Workspace, when the application is idle)

`ANALYZE` is fast (typically sub-second for small-to-medium Workspaces) and can run without any locking impact on readers.

---

## 9. Maintenance Tasks

| Task | Trigger | Frequency | Impact |
|---|---|---|---|
| WAL Checkpoint | Automatic (1000-page threshold) | Automatic | Low — brief write lock |
| `ANALYZE` | Scheduled background job, or post-bulk-import | Weekly or on demand | Very low — read-only |
| `VACUUM` | User request or scheduled (disabled by default) | On demand | Medium — requires extra disk space temporarily |
| `PRAGMA integrity_check` | On Workspace open (optional), on restore, on backup validation | On demand / on restore | Low-medium depending on database size |

---

## 10. Integrity Checks

### 10.1 `PRAGMA integrity_check`

This pragma runs a full structural check of the SQLite database file: it verifies B-tree structure, row format consistency, page linkage, and index validity. It returns `ok` if no issues are found.

**When it runs:**
- During backup validation (before writing the backup archive)
- During restore validation (before accepting a backup or import)
- Optionally on Workspace open (configurable; disabled by default for performance)

### 10.2 `PRAGMA quick_check`

A faster, lighter integrity check that catches most structural errors (corrupted pages, mismatched row counts) without verifying every row. Runs on every Workspace open as a lightweight safety check.

---

## 11. Limitations and Trade-offs

| Limitation | Notebook's Mitigation |
|---|---|
| **Single writer at a time** | Single-user application; write contention is rare; busy timeout handles the occasional conflict |
| **WAL files complicate backup** | Backup procedure triggers a WAL checkpoint before archiving; or includes WAL file in the archive |
| **Large databases (>10 GB) have performance implications** | Binary files live on filesystem (P-03), keeping the database small; attachment content does not inflate the database |
| **No built-in network access** | This is a feature, not a limitation |
| **Cross-Workspace queries not possible at DB level** | Workspace isolation is an explicit design goal; cross-Workspace search is done at the application layer |

---

## 12. Acceptance Criteria

- WAL mode is enabled on every database connection before any read or write occurs.
- `PRAGMA foreign_keys = ON` is set on every database connection before any read or write occurs.
- `PRAGMA busy_timeout = 5000` is set on every database connection.
- All multi-step write operations (note save, attachment add, wiki link update) execute within a single transaction.
- `PRAGMA integrity_check` is run on every backup before the archive is finalized.
- `PRAGMA quick_check` runs on every Workspace open.
- VACUUM is never triggered automatically during active use; it requires explicit user request or scheduled maintenance configuration.
