# 00 — Data Model Principles

> **Document Type:** Database Design Principles
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-Overview.md](./01-Overview.md) · [03-ERD.md](./03-ERD.md) · [04-Schema.md](./04-Schema.md) · [../01-architecture/ADR-009-WorkspaceIsolation.md](../01-architecture/ADR-009-WorkspaceIsolation.md) · [../01-architecture/ADR-010-WorkspaceManifest.md](../01-architecture/ADR-010-WorkspaceManifest.md) · [../01-architecture/14-ArchitectureDecisions.md](../01-architecture/14-ArchitectureDecisions.md)

---

## 1. Purpose

This document establishes the data model principles that govern every decision made in the Notebook database design. It answers the question *why* before any *how*.

Understanding the reasoning behind these principles is essential for anyone extending the schema, writing a migration, or debugging a data issue. Principles are not arbitrary rules — each one is derived from a core project constraint: offline-first, local-first, Workspace-first, privacy-first.

Before consulting the schema, read this document.

---

## 2. Principle Index

| # | Principle |
|---|---|
| P-01 | One SQLite Database Per Workspace |
| P-02 | SQLite Is the Source of Truth |
| P-03 | Filesystem Stores Binary Files |
| P-04 | Database Stores Metadata |
| P-05 | Stable UUID Identifiers |
| P-06 | Normalized Relational Model |
| P-07 | Explicit Relationships |
| P-08 | Soft Delete Strategy |
| P-09 | Audit and Version History Support |
| P-10 | Forward-Compatible Schema Evolution |
| P-11 | Workspace Isolation |
| P-12 | AI Index Is Workspace-Scoped |
| P-13 | Search Indexes Are Workspace-Scoped |

---

## P-01 — One SQLite Database Per Workspace

**Principle:** Every Workspace owns exactly one `database.db` SQLite file. There is no shared global database containing data from multiple Workspaces.

**Reasoning:**

A shared database is the most common source of accidental coupling in local-first applications. When multiple Workspaces share a single database file:

- Backing up one Workspace requires extracting a subset of rows — a fragile, error-prone operation.
- Restoring one Workspace risks corrupting the data of every other Workspace in the shared file.
- Deleting a Workspace requires careful, cascading row deletions across many tables.
- A single corrupted database immediately affects every Workspace simultaneously.
- Google Drive sync must transfer a partial database, which is not a meaningful unit of synchronization for SQLite.

By contrast, when each Workspace owns its own database file:

- A Workspace backup is a directory copy — atomic and simple.
- Restoring a Workspace means replacing a directory — no other Workspace is at risk.
- Deleting a Workspace is a filesystem delete — complete and instant.
- A corrupted database affects only the Workspace it belongs to.
- Sync transfers a self-contained file and directory structure.

This principle is the foundational decision from which all other isolation properties derive. See [ADR-009](../01-architecture/ADR-009-WorkspaceIsolation.md).

**Trade-off accepted:** Opening a Workspace requires connecting a new Prisma client instance. This is well-understood and managed by the Workspace Manager. Cross-Workspace queries at the database level are not possible — this is intentional and by design.

---

## P-02 — SQLite Is the Source of Truth

**Principle:** The local SQLite database is the authoritative data store for all structured user content. Google Drive is a synchronization replica, not an authoritative store. The filesystem is a storage medium for binary files. No other system holds authoritative user data.

**Reasoning:**

Notebook operates under an explicit constraint: there is no developer-owned backend. This is not merely a technical choice; it is a product promise. The user's data belongs to the user, lives on the user's machine, and is completely accessible without any external service.

Google Drive is an optional synchronization target. If Google Drive is unavailable, inaccessible, or deleted, the local SQLite database remains complete and unaffected. The sync system is designed around this: local data is never deleted in anticipation of remote data. The local database is always the starting point for conflict resolution, never the inferior copy.

This principle also constrains what can be stored where. Metadata, relationships, search indexes, and embeddings live in the database — where they benefit from ACID transactions, foreign keys, and queryability. Binary content lives on the filesystem — where it is efficiently stored verbatim.

**Trade-off accepted:** Synchronization requires a file-level sync strategy rather than row-level replication, because the SQLite file is the unit of data rather than individual records. This is acceptable given that Google Drive transfers files efficiently.

---

## P-03 — Filesystem Stores Binary Files

**Principle:** Raw binary content — attachment files such as PDFs, images, Word documents, and spreadsheets — is stored on the local filesystem in the `attachments/` directory of each Workspace. Binary files are never stored inside the SQLite database.

**Reasoning:**

Storing binary files in a relational database is an anti-pattern for this use case for several reasons:

- It inflates the database file size, increasing memory pressure during all database operations, including those unrelated to attachments.
- SQLite is not optimized for streaming large binary blobs; reading a 50 MB PDF through SQLite requires loading it fully into memory.
- It complicates sync: synchronizing `attachments/` as individual files allows incremental transfer using file-level hashing. A database containing embedded blobs must be transferred as a single monolithic file on every change, regardless of which attachments actually changed.
- Binary files benefit from filesystem-level deduplication, incremental backup, and OS-level caching that is not available inside a database blob.

The filesystem is the natural storage medium for binary content. The database holds the metadata record that describes each attachment — its name, size, MIME type, checksum, OCR status, and relationship to a note.

**Invariant:** The database is the authority for which attachment files exist and what they mean. The filesystem is the authority for the bytes of those files.

---

## P-04 — Database Stores Metadata

**Principle:** The database stores structured, queryable metadata about all user content — not the binary content itself. Every entity is described in the database, even if its primary data resides on the filesystem.

**Reasoning:**

Metadata-in-database, content-on-filesystem is the canonical pattern for file management applications. It gives the application the best of both worlds:

- The database can answer questions like "give me all unprocessed PDFs sorted by date" or "find notes linked to this attachment" — queries that are trivial in SQL and impossible with a pure filesystem scan.
- The filesystem stores the bytes without the overhead of being wrapped in a relational row.
- OCR and embedding pipelines read the metadata record to determine which files need processing, update status flags, and record results — all in structured SQL.

The `attachments` table holds the metadata record. The `attachments/` directory holds the file. Together they form a complete picture of the attachment. Neither is sufficient alone.

---

## P-05 — Stable UUID Identifiers

**Principle:** Every entity in the database is identified by a Version 4 UUID primary key that is assigned at creation and never changes for the lifetime of the entity.

**Reasoning:**

Auto-incrementing integer IDs are the default choice in many relational databases, but they create problems in a local-first, multi-device application:

- Two devices can independently create a new note and both assign `id = 1`. When the Workspaces are synced, the IDs collide.
- Integer IDs reveal creation order, which may be sensitive information.
- Integer IDs cannot be determined client-side without a round-trip to the database to obtain the next sequence value; UUIDs can be generated anywhere, any time, without coordination.

UUID v4 identifiers are globally unique by design. They can be generated on the client, in the main process, or in the domain layer without any database interaction. If cross-Workspace sync or copy-paste between Workspaces is ever implemented, UUID entities can be imported without ID collision.

**Format:** UUIDs are stored as `TEXT` in SQLite using standard hyphenated format (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). SQLite has no native UUID type; TEXT is the correct and conventional storage choice.

**Trade-off accepted:** UUIDs consume 36 bytes as text versus 4–8 bytes for integers. For the data volumes expected in a personal knowledge management application, this difference is negligible. Query performance on UUID primary keys is acceptable with indexes; SQLite B-tree indexes handle TEXT keys efficiently.

---

## P-06 — Normalized Relational Model

**Principle:** The schema follows a normalized relational model. Data is not duplicated across tables. Every fact is stored in exactly one place. Relationships are expressed through foreign keys, not through denormalized copies of data.

**Reasoning:**

Normalization is the foundation of data integrity in a relational database. Without normalization:

- Updating a tag name requires finding every row that contains a copy of that name and updating all of them — a recipe for partial updates and inconsistency.
- Deletion cascades become manual: deleting a note requires finding and deleting all denormalized copies of that note's data scattered across other tables.
- Queries that join normalized tables are often faster than queries that scan wide, denormalized rows, because the database engine processes smaller rows.

The Notebook data model is structured around entities (Note, Folder, Tag, Attachment, Todo, AIChat, ChatMessage, Embedding, WikiLink, VersionHistory, PluginConfiguration, ApplicationSettings) that have clear boundaries and single responsibilities. Relationships between them are expressed through foreign keys in junction tables or direct FK columns.

**Trade-off accepted:** Normalization requires more joins in queries. SQLite handles joins well; the expected data volumes in a personal knowledge management application are modest, and normalization's correctness benefits outweigh any minor query complexity.

---

## P-07 — Explicit Relationships

**Principle:** All relationships between entities are represented using explicit foreign key columns and enforced with `PRAGMA foreign_keys = ON`. Implicit relationships through naming conventions or application-layer conventions are not used.

**Reasoning:**

SQLite supports foreign keys but does not enforce them by default; the `PRAGMA foreign_keys = ON` statement must be issued on each connection. The application **shall** enable foreign keys on every database connection before any query is executed.

Explicit foreign keys serve several purposes:

- The schema is self-documenting: any developer reading the schema can understand relationships without consulting application code.
- The database engine enforces referential integrity: it is impossible to create a note in a folder that does not exist, or an attachment record that references a deleted note.
- Cascade rules (ON DELETE CASCADE, ON DELETE SET NULL) are expressed at the schema level, not spread across application code.
- Prisma reads foreign key relationships to generate type-safe join queries.

Every foreign key relationship **shall** declare an explicit `ON DELETE` rule. The choice of rule (CASCADE, SET NULL, RESTRICT) reflects the semantic meaning of the relationship and is documented in [04-Schema.md](./04-Schema.md).

---

## P-08 — Soft Delete Strategy

**Principle:** User-visible entities — Notes, Folders, Attachments, Tags, and Todos — use soft deletion. A `deleted_at` timestamp column records when an entity was soft-deleted. A `NULL` value indicates the entity is active. Soft-deleted entities are logically removed from the user's view but physically remain in the database.

**Reasoning:**

Soft deletion provides a "Trash" experience — the fundamental safety net that every personal knowledge management tool requires. Users accidentally delete notes. When they do, they expect to recover them.

Implementing Trash through soft deletion is simpler and safer than physically moving rows to a separate Trash table and then moving them back on restore. With a single `deleted_at` column:

- Queries for active content always include `WHERE deleted_at IS NULL`.
- Queries for Trash content always filter on `WHERE deleted_at IS NOT NULL`.
- Restoring an item is a single `UPDATE notes SET deleted_at = NULL WHERE id = ?`.
- Permanent deletion is a physical `DELETE` that removes the row after explicit user confirmation.

**Active flag vs. timestamp:** The `deleted_at` timestamp is preferred over a boolean `is_deleted` flag because it records *when* the deletion occurred, which is necessary for:
- Displaying "Deleted 3 days ago" in the Trash UI.
- Applying automatic permanent deletion policies (e.g., empty Trash items older than 30 days).
- Conflict resolution during sync: a note soft-deleted on device A and edited on device B creates a detectable conflict with a timestamp anchor.

**Application constraint:** All repository implementations **shall** apply the `deleted_at IS NULL` filter by default. Querying deleted items requires explicit opt-in to prevent accidentally surfacing deleted data in search results, link resolution, or AI context.

---

## P-09 — Audit and Version History Support

**Principle:** Note content changes are preserved in an append-only version history. The `version_history` table stores immutable snapshots of note content at each saved state. Version history rows are never updated; they are only appended and (eventually) permanently deleted when a version is beyond the retention limit.

**Reasoning:**

Version history serves multiple user needs: undoing accidental edits, comparing how a note evolved over time, and recovering content that was edited away. It is one of the defining features of a professional knowledge management tool.

The append-only model (insert-only, never update) is the correct pattern for an audit trail:

- Every snapshot is immutable; there is no way for a version history record to be "partially updated" or corrupted by an in-progress write.
- The history is a truthful record of how the note evolved; no entry can be retroactively altered.
- Recovery from corruption is simpler: even if recent notes are corrupt, old version history remains intact.

**Retention policy:** Version history is retained up to a configurable maximum (defined by `ApplicationSettings`). The default retention is a defined number of versions per note. Pruning is a background job that physically deletes the oldest versions beyond the limit. Pruning is never a soft-delete — version history rows that are pruned are gone permanently.

**Storage cost:** Version history can grow large for heavily edited notes. This is a known and accepted trade-off. The default retention limit is chosen conservatively. Users who store very large notes should understand that version history multiplies the storage requirement. Future optimization options (delta compression) are noted in [09-Versioning.md](./09-Versioning.md) as future considerations.

---

## P-10 — Forward-Compatible Schema Evolution

**Principle:** The schema is designed to evolve through additive migrations. New columns are added as nullable. New tables are added without modifying existing tables. Existing column types and constraints are changed only through a multi-step migration with a compatibility window.

**Reasoning:**

A PKM application accumulates years of user data. The schema will change — new features require new columns and tables. The evolution strategy must ensure that:

- Older Workspaces can be migrated to the current schema without data loss.
- A migration failure leaves the Workspace in a recoverable state (the migration can be re-run).
- The Workspace Manifest's `schemaVersion` field provides a reliable version anchor before any migration runs.

Additive-only changes are the safest class of migrations:

- Adding a nullable column to an existing table requires no data backfill; existing rows simply have `NULL` for the new column until updated.
- Adding a new table has zero impact on existing queries.
- No existing application code breaks when a nullable column is added; queries that don't reference the column are unaffected.

Destructive changes (removing a column, changing a column type) require a migration window:
1. Deprecate the column (add documentation, stop writing to it).
2. Migrate data to the new form.
3. Remove the column in a subsequent migration once the transition is complete.

This is more work but prevents data loss during any application version that straddles the migration boundary.

See [07-Migrations.md](./07-Migrations.md) for the full migration strategy.

---

## P-11 — Workspace Isolation

**Principle:** Every entity in the database implicitly belongs to the Workspace whose database contains it. There are no cross-Workspace foreign keys or cross-Workspace queries at the database level. The Workspace is the outermost scope for all data.

**Reasoning:**

This principle follows directly from P-01 (one database per Workspace). Because each Workspace has its own database file, it is structurally impossible to create a foreign key that spans two different Workspace databases. This is a feature, not a limitation.

Workspace isolation means:

- A note in Workspace A can never accidentally appear in Workspace B, regardless of any bug.
- Search results are always scoped to the active Workspace by construction — there is no "active Workspace WHERE clause" to forget.
- Deleting a Workspace is a filesystem delete — there are no cross-Workspace references to clean up.
- Backing up a Workspace is a directory archive — there are no external dependencies.

The application layer enforces the active Workspace context through dependency injection (see [01-SystemOverview.md §14](../01-architecture/01-SystemOverview.md)). The database layer enforces it structurally, through file-level isolation.

---

## P-12 — AI Index Is Workspace-Scoped

**Principle:** The sqlite-vec embedding vectors for a Workspace are stored in that Workspace's `database.db`. There is no shared embedding index across Workspaces. Re-indexing or invalidating embeddings for one Workspace has no effect on any other Workspace.

**Reasoning:**

Embedding vectors are the foundation of semantic search and RAG. They represent the user's private knowledge, expressed as high-dimensional numerical vectors derived from note content. Keeping them Workspace-scoped maintains the privacy and isolation guarantees:

- A user with a "Work" Workspace and a "Personal" Workspace will never have AI results from one appear in the other.
- Model change invalidation (re-generating all embeddings when the user switches embedding models) is scoped to the active Workspace — it does not trigger a full re-indexing of all Workspaces.
- The sqlite-vec extension is loaded per-database-connection, so each Workspace's vector index is independently managed.

Co-locating embeddings with their source data in the same SQLite file also enables atomic updates: adding a note and queueing its embedding can occur in the same transaction, preventing a state where a note exists without its corresponding embedding record.

---

## P-13 — Search Indexes Are Workspace-Scoped

**Principle:** The FTS5 full-text search index for a Workspace is stored as a virtual table in that Workspace's `database.db`. There is no shared FTS index across Workspaces.

**Reasoning:**

FTS5 virtual tables in SQLite are created per database. Because each Workspace has its own database, each Workspace inherently has its own FTS index. This is the correct behavior:

- Full-text search returns results only from the active Workspace — by construction, not by application-layer filtering.
- Rebuilding the FTS index for one Workspace (e.g., after corruption) does not affect any other Workspace.
- The FTS index is kept consistent with the notes table through transactional writes: a note content update writes to both the `notes` table and the `fts_notes` virtual table in the same transaction.
- Index size is proportional to the content of each Workspace, not to the total content of all Workspaces combined.

---

## 3. Principles Summary Table

| Principle | One-Line Summary |
|---|---|
| P-01 | One SQLite database per Workspace — no shared global database |
| P-02 | SQLite is the authoritative source of truth; Google Drive is a replica |
| P-03 | Binary files live on the filesystem, never inside the database |
| P-04 | The database stores queryable metadata about all content |
| P-05 | All entities are identified by UUID v4 primary keys, stable for life |
| P-06 | The schema is normalized; facts are never duplicated |
| P-07 | All relationships are expressed as explicit, enforced foreign keys |
| P-08 | User-visible entities use soft deletion via a `deleted_at` timestamp |
| P-09 | Note version history is append-only and immutable |
| P-10 | Schema evolves through additive, forward-compatible migrations |
| P-11 | All data is Workspace-scoped; no cross-Workspace database references exist |
| P-12 | sqlite-vec embedding indexes are Workspace-scoped and independent |
| P-13 | FTS5 search indexes are Workspace-scoped and independent |

---

## 4. Future Considerations

- **Delta compression for version history:** Future versions may store diffs rather than full snapshots to reduce storage cost for heavily edited notes.
- **Per-Workspace encryption:** SQLCipher integration would add transparent encryption at the SQLite file level. The per-database layout (P-01) is a prerequisite. Each Workspace would have an independent encryption key.
- **Schema constraints validation on open:** A future startup check could compare the live schema against the expected schema for `schemaVersion`, detecting manual schema tampering early.
