# 08 — Indexes

> **Document Type:** Index Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [04-Schema.md](./04-Schema.md) · [05-SQLite.md](./05-SQLite.md) · [06-sqlite-vec.md](./06-sqlite-vec.md) · [07-Migrations.md](./07-Migrations.md) · [../01-architecture/01-SystemOverview.md §17](../01-architecture/01-SystemOverview.md)

---

## 1. Purpose

This document defines the indexing strategy for the Notebook database. It specifies which indexes exist, why they exist, and what queries they support. It also defines the philosophy for avoiding over-indexing.

---

## 2. Indexing Philosophy

### 2.1 Index Only What Is Queried

An index is not free. Every index consumes disk space and must be maintained on every `INSERT`, `UPDATE`, and `DELETE`. For a personal knowledge management application, write operations are frequent (note autosave, embedding updates, tag changes). Unnecessary indexes slow down writes without benefiting any query.

**Rule:** Add an index only when there is a concrete, identified query that benefits from it. Do not add indexes preemptively.

### 2.2 Composite Indexes Over Multiple Single-Column Indexes

When a query filters or sorts on multiple columns, a single composite index is almost always more efficient than multiple single-column indexes. SQLite can use only one index per table per query; a composite index on `(folder_id, deleted_at, updated_at)` serves all of:
- `WHERE folder_id = ? AND deleted_at IS NULL`
- `WHERE folder_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC`

### 2.3 Partial Indexes for Common Filters

SQLite supports partial indexes — indexes that only include rows matching a `WHERE` clause. A partial index on `(deleted_at IS NULL)` is smaller than a full index and is used automatically by any query with `WHERE deleted_at IS NULL`. This is the correct pattern for soft-deleted tables.

### 2.4 Covering Indexes for Frequent Reads

A covering index includes all columns needed by a query, eliminating the need to read the main table row. When feasible, covering indexes are preferred for high-frequency read queries.

### 2.5 Indexes Do Not Replace Good Queries

Indexes compensate for table scans but cannot rescue a poorly written query. Always write the query correctly first, then evaluate whether an index is needed.

---

## 3. Primary Key Indexes

SQLite automatically creates a B-tree index on the primary key of every table. All tables in the Notebook schema use UUID TEXT primary keys. These indexes are:

| Table | PK Index | Purpose |
|---|---|---|
| `folders` | `folders_pk` (auto) | Point lookup by UUID |
| `notes` | `notes_pk` (auto) | Point lookup by UUID |
| `attachments` | `attachments_pk` (auto) | Point lookup by UUID |
| `tags` | `tags_pk` (auto) | Point lookup by UUID |
| `todos` | `todos_pk` (auto) | Point lookup by UUID |
| `wiki_links` | `wiki_links_pk` (auto) | Point lookup by UUID |
| `ai_chats` | `ai_chats_pk` (auto) | Point lookup by UUID |
| `chat_messages` | `chat_messages_pk` (auto) | Point lookup by UUID |
| `embeddings` | `embeddings_pk` (auto) | Point lookup by UUID |
| `version_history` | `version_history_pk` (auto) | Point lookup by UUID |
| `plugin_configurations` | `plugin_configurations_pk` (auto) | Point lookup by UUID |
| `application_settings` | `application_settings_pk` (auto) | Point lookup by UUID |
| `background_jobs` | `background_jobs_pk` (auto) | Point lookup by UUID |

Primary key lookups are the most common operation across all repositories.

---

## 4. Lookup Indexes

### 4.1 Notes — Folder Membership + Active Filter

**Index:** `idx_notes_folder_active` on `notes(folder_id, deleted_at, updated_at)`

**Supports:** Listing notes within a folder, sorted by last updated — the most common read query in the application.

```
SELECT id, title, updated_at
FROM notes
WHERE folder_id = ? AND deleted_at IS NULL
ORDER BY updated_at DESC
```

**Composite design:** The three-column composite covers the filter (`folder_id = ?`, `deleted_at IS NULL`) and the sort (`updated_at DESC`) in a single index scan, eliminating a separate sort step.

---

### 4.2 Notes — Root-Level (No Folder) + Active Filter

**Index:** `idx_notes_no_folder_active` — partial index on `notes(updated_at)` where `folder_id IS NULL AND deleted_at IS NULL`

**Supports:** Listing root-level notes (not in any folder), sorted by last updated.

```
SELECT id, title, updated_at
FROM notes
WHERE folder_id IS NULL AND deleted_at IS NULL
ORDER BY updated_at DESC
```

---

### 4.3 Notes — Trash View

**Index:** `idx_notes_deleted` — partial index on `notes(deleted_at)` where `deleted_at IS NOT NULL`

**Supports:** The Trash view, which lists all soft-deleted notes sorted by deletion time.

```
SELECT id, title, deleted_at
FROM notes
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at DESC
```

---

### 4.4 Attachments — By Note

**Index:** `idx_attachments_note_id` on `attachments(note_id, deleted_at)`

**Supports:** Loading all attachments for a given note.

```
SELECT id, original_filename, mime_type, ocr_status
FROM attachments
WHERE note_id = ? AND deleted_at IS NULL
```

---

### 4.5 Attachments — OCR Queue

**Index:** `idx_attachments_ocr_status` — partial index on `attachments(id)` where `ocr_status = 'pending'`

**Supports:** The OCR job queue scanner, which finds attachments awaiting OCR processing.

```
SELECT id, original_filename, mime_type
FROM attachments
WHERE ocr_status = 'pending' AND deleted_at IS NULL
LIMIT 50
```

---

### 4.6 Attachments — Embedding Queue

**Index:** `idx_attachments_embedding_status` — partial index on `attachments(id)` where `embedding_status = 'pending'`

**Supports:** The embedding job queue scanner for attachments.

---

### 4.7 Tags — Name Lookup

**Index:** `idx_tags_name` on `tags(name)` — UNIQUE

**Supports:** Tag lookup by name (for duplicate detection during tag creation and for `[[tag-name]]` resolution).

```
SELECT id FROM tags WHERE name = ?
```

This is the UNIQUE constraint index — it provides both uniqueness enforcement and fast lookup.

---

### 4.8 Todos — Active, Sorted

**Index:** `idx_todos_active` on `todos(deleted_at, completed, due_date)`

**Supports:** The Todo list view: active, incomplete todos sorted by due date.

```
SELECT id, title, due_date, priority
FROM todos
WHERE deleted_at IS NULL AND completed = 0
ORDER BY due_date ASC NULLS LAST
```

---

### 4.9 Todos — By Note

**Index:** `idx_todos_note_id` on `todos(note_id)` where `note_id IS NOT NULL AND deleted_at IS NULL`

**Supports:** Loading todos associated with a specific note.

```
SELECT id, title, completed
FROM todos
WHERE note_id = ? AND deleted_at IS NULL
```

---

## 5. Relationship Indexes

### 5.1 Note Tags — By Tag (for Tag → Notes queries)

**Index:** `idx_note_tags_tag_id` on `note_tags(tag_id)`

**Supports:** Finding all notes with a given tag (tag detail view, tag filtering).

```
SELECT n.id, n.title
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
WHERE nt.tag_id = ? AND n.deleted_at IS NULL
```

SQLite automatically indexes the composite PK `(note_id, tag_id)`, which serves the reverse direction (notes → tags). This index serves the tag → notes direction.

---

### 5.2 Attachment Tags — By Tag

**Index:** `idx_attachment_tags_tag_id` on `attachment_tags(tag_id)`

**Supports:** Finding all attachments with a given tag.

---

### 5.3 Wiki Links — By Source Note

The composite PK `(source_note_id, target_note_id, link_text)` includes `source_note_id` as the leftmost key. SQLite uses this index for:

```
SELECT target_note_id, link_text
FROM wiki_links
WHERE source_note_id = ?
```

No additional index is needed for outgoing links.

### 5.4 Wiki Links — By Target Note (Backlinks)

**Index:** `idx_wiki_links_target_note_id` on `wiki_links(target_note_id)` where `resolved = 1`

**Supports:** Backlink queries — finding all notes that link to a given note. Backlinks are displayed in the note sidebar and used by the AI Context Builder.

```
SELECT source_note_id
FROM wiki_links
WHERE target_note_id = ? AND resolved = 1
```

---

### 5.5 Chat Messages — By Chat

**Index:** `idx_chat_messages_chat_id` on `chat_messages(chat_id, created_at)`

**Supports:** Loading the messages of a chat session in chronological order.

```
SELECT id, role, content, citations, created_at
FROM chat_messages
WHERE chat_id = ?
ORDER BY created_at ASC
```

---

### 5.6 Version History — By Note, Latest First

**Index:** `idx_version_history_note_id` on `version_history(note_id, version_number DESC)`

**Supports:** Loading version history for a note, most recent first, and pruning the oldest versions.

```
SELECT id, version_number, title_snapshot, created_at, label
FROM version_history
WHERE note_id = ?
ORDER BY version_number DESC
LIMIT 50
```

---

### 5.7 Embeddings — By Source

**Index:** `idx_embeddings_source` on `embeddings(source_type, source_id)` — UNIQUE per `(source_type, source_id, model_id)`

**Supports:** Looking up the embedding metadata record for a given note or attachment.

```
SELECT id, is_stale, model_id, generated_at
FROM embeddings
WHERE source_type = 'note' AND source_id = ?
```

---

### 5.8 Embeddings — Stale Flag

**Index:** `idx_embeddings_stale` — partial index on `embeddings(source_type, source_id)` where `is_stale = 1`

**Supports:** The re-embedding job queue — finding all source entities with stale embeddings.

```
SELECT source_type, source_id
FROM embeddings
WHERE is_stale = 1
```

---

### 5.9 Background Jobs — By Status

**Index:** `idx_background_jobs_status` — partial index on `background_jobs(job_type, created_at)` where `status IN ('queued', 'running')`

**Supports:** The Background Job Manager at startup, which resumes incomplete jobs.

```
SELECT id, job_type, payload, retry_count
FROM background_jobs
WHERE status IN ('queued', 'running')
ORDER BY created_at ASC
```

---

## 6. Full-Text Search Indexes (FTS5)

FTS5 virtual tables manage their own internal inverted index. This is not a standard B-tree index — it is a dedicated full-text search data structure maintained by the FTS5 engine.

### 6.1 `fts_notes` Index

**Tables indexed:** `notes.title` and `notes.body` (plain-text extraction from Tiptap JSON)

**Query pattern:**
```
SELECT note_id, snippet(fts_notes, ...) AS excerpt, rank
FROM fts_notes
WHERE fts_notes MATCH ?
ORDER BY rank
LIMIT 20
```

**Maintenance:** Updated transactionally on every note `INSERT`, `UPDATE`, and `DELETE`.

**Rebuild:** If the FTS index becomes inconsistent (detected by query errors or explicit user request), it is rebuilt by `INSERT INTO fts_notes(fts_notes) VALUES('rebuild')` — a SQLite FTS5 special command.

### 6.2 `fts_attachments` Index

**Tables indexed:** OCR-extracted text for each attachment (`ocr_status = 'completed'`)

**Query pattern:**
```
SELECT attachment_id, snippet(fts_attachments, ...) AS excerpt, rank
FROM fts_attachments
WHERE fts_attachments MATCH ?
ORDER BY rank
LIMIT 20
```

**Maintenance:** Updated when an OCR job completes and inserts the extracted text.

---

## 7. sqlite-vec Index

The `vec_embeddings` virtual table maintains an internal approximate nearest-neighbor index managed by the sqlite-vec extension. See [06-sqlite-vec.md §5](./06-sqlite-vec.md) for the full vector index specification.

The vector index is queried via:
```
SELECT rowid, distance
FROM vec_embeddings
WHERE embedding MATCH ?
ORDER BY distance
LIMIT 10
```

---

## 8. Folder Hierarchy Index

### 8.1 Folders — By Parent

**Index:** `idx_folders_parent_id` on `folders(parent_id, display_order)` where `deleted_at IS NULL`

**Supports:** Loading the children of a folder (folder tree rendering), sorted by display order.

```
SELECT id, name, display_order
FROM folders
WHERE parent_id = ? AND deleted_at IS NULL
ORDER BY display_order ASC
```

---

## 9. Indexes Not Created and Why

The following indexes might seem useful but are deliberately excluded:

| Potential Index | Why Not Created |
|---|---|
| `notes(title)` for title substring search | FTS5 handles note title search. A B-tree index on `title` does not accelerate `LIKE '%keyword%'` substring searches. Not needed. |
| `notes(created_at)` | Notes are almost always sorted by `updated_at`, not `created_at`. The index would rarely be used. Add only if a specific "sort by creation date" feature is implemented. |
| `attachments(mime_type)` | Filtering notes by attachment MIME type is not a primary use case. Not needed in V1. |
| `tags(color)` | Tags are never queried by color. Not needed. |
| `chat_messages(role)` | Chat messages are always retrieved by `chat_id` — role filtering happens in application code after the rows are fetched. Not needed. |
| `version_history(created_at)` | Version history is always retrieved by `(note_id, version_number)`. A `created_at` index would not be used. |

---

## 10. Index Maintenance

### 10.1 Automatic Maintenance

SQLite maintains B-tree indexes automatically on every write operation. No explicit maintenance is required. FTS5 and sqlite-vec indexes are also maintained automatically on `INSERT`, `UPDATE`, and `DELETE` operations issued by the repository layer.

### 10.2 Statistics with ANALYZE

`ANALYZE` collects statistics about index selectivity and data distribution. The SQLite query planner uses these statistics to choose optimal execution plans. See [05-SQLite.md §8](./05-SQLite.md) for the ANALYZE schedule.

### 10.3 FTS5 Index Consistency Check

The FTS5 index should be consistent with the `notes` table at all times, because updates are transactional. If consistency is ever in doubt, `SELECT * FROM fts_notes WHERE fts_notes MATCH 'integrity-check'` returns an error if the index is corrupt. A full FTS5 rebuild is the remediation.

---

## 11. Acceptance Criteria

- The note list query for a folder (filtered by active, sorted by `updated_at`) executes without a table scan, verified by `EXPLAIN QUERY PLAN`.
- The backlink query (all notes linking to a given note) executes in under 10ms for a Workspace with 10,000 notes.
- The FTS5 note search returns results in under 200ms for a Workspace with 10,000 notes.
- The sqlite-vec nearest-neighbor query returns top-10 results in under 1 second for a Workspace with 10,000 embeddings.
- No index exists on any column that is not referenced in a documented query.
- `EXPLAIN QUERY PLAN` is run for every new query added to a repository implementation, and results are reviewed before shipping.
