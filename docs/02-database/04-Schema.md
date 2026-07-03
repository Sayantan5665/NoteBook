# 04 — Schema

> **Document Type:** Database Schema Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [00-DataModelPrinciples.md](./00-DataModelPrinciples.md) · [03-ERD.md](./03-ERD.md) · [07-Migrations.md](./07-Migrations.md) · [08-Indexes.md](./08-Indexes.md) · [../01-architecture/14-ArchitectureDecisions.md](../01-architecture/14-ArchitectureDecisions.md)

---

## 1. Purpose

This document describes every table in the Notebook database schema. For each table it documents:

- Responsibility and purpose
- Relationship to other tables
- Primary key strategy
- Foreign keys and cascade rules
- Unique constraints
- Soft-delete behavior
- Design rationale

This document does not contain SQL DDL statements or Prisma model definitions. See [07-Migrations.md](./07-Migrations.md) for migration strategy.

---

## 2. Schema Design Principles (Applied)

All design decisions in this section derive from [00-DataModelPrinciples.md](./00-DataModelPrinciples.md). The principles are referenced as P-NN throughout this document.

Quick reference:

| Principle | Summary |
|---|---|
| P-05 | UUID v4 TEXT primary keys |
| P-06 | Normalized — no denormalization |
| P-07 | Explicit foreign keys with cascade rules |
| P-08 | Soft delete via `deleted_at` timestamp |
| P-09 | Version history is append-only |
| P-10 | Additive schema evolution |

---

## 3. Table Reference

### 3.1 `folders`

**Responsibility:** Stores the hierarchy of Folders within a Workspace. Folders organize Notes into a tree structure.

**Relationships:**
- Self-referential: `parent_id` references `folders.id` (parent folder)
- One-to-many with `notes`: a Folder contains many Notes

**Primary Key:** `id` — UUID v4 TEXT

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `parent_id` | `folders(id)` | SET NULL — deleting a parent folder makes its children root-level, not orphaned |

**Unique Constraints:** None. Duplicate folder names within the same parent are allowed — the user may have `Notes/Work` and `Archive/Work`.

**Soft Delete:** `deleted_at DATETIME` — NULL if active. When a Folder is soft-deleted, all Notes within it are individually soft-deleted in the same operation. The Folder is not deleted from the database until the user empties Trash.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `name` | TEXT | NOT NULL | Display name of the folder |
| `parent_id` | TEXT | NULL | UUID of parent folder; NULL = root level |
| `display_order` | INTEGER | NOT NULL | Sort position within parent; default 0 |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of creation |
| `updated_at` | DATETIME | NOT NULL | UTC timestamp of last update |
| `deleted_at` | DATETIME | NULL | UTC timestamp of soft delete; NULL = active |

---

### 3.2 `notes`

**Responsibility:** The central table. Stores the primary user content — note metadata and rich text body. This is the most-read and most-written table in the schema.

**Relationships:**
- Many-to-one with `folders`: a Note may belong to one Folder
- One-to-many with `attachments`: a Note may have many Attachments
- One-to-many with `note_tags`: junction for Tag associations
- One-to-many with `todos`: Todos may reference a Note
- One-to-many with `wiki_links` (as source): WikiLinks originating from this Note
- One-to-many with `wiki_links` (as target): WikiLinks pointing to this Note
- One-to-many with `version_history`: snapshots of this Note's content
- Zero-or-one with `embeddings`: vector embedding record

**Primary Key:** `id` — UUID v4 TEXT

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `folder_id` | `folders(id)` | SET NULL — deleting a folder does not delete its notes; they become folder-less (root-level) |

**Unique Constraints:** None on title. Duplicate note titles are intentionally allowed — the user may have multiple notes with the same name in different folders.

**Soft Delete:** `deleted_at DATETIME` — NULL if active. The Trash UI shows all Notes where `deleted_at IS NOT NULL`.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `title` | TEXT | NOT NULL | Note title; defaults to empty string |
| `body` | TEXT | NOT NULL | Rich text body (Tiptap JSON or HTML); defaults to empty document |
| `folder_id` | TEXT | NULL | UUID of containing folder; NULL = root level |
| `word_count` | INTEGER | NOT NULL | Approximate word count, maintained on save |
| `embedding_status` | TEXT | NOT NULL | `pending` \| `processing` \| `completed` \| `failed` \| `not_applicable` |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of creation |
| `updated_at` | DATETIME | NOT NULL | UTC timestamp of last content save |
| `deleted_at` | DATETIME | NULL | UTC timestamp of soft delete; NULL = active |

**Design Note — body storage format:** The `body` column stores the Tiptap document as a JSON string. Storing structured JSON (rather than raw HTML) enables version diffing, richer search parsing, and future export transformations without requiring an HTML parser at the repository layer.

---

### 3.3 `attachments`

**Responsibility:** Metadata records for binary files attached to Notes. The actual file bytes live in `attachments/<id>.<ext>` on the filesystem. This table is the directory of all attachments; the filesystem is the storage medium.

**Relationships:**
- Many-to-one with `notes`: an Attachment belongs to one Note
- One-to-many with `attachment_tags`: junction for Tag associations
- Zero-or-one with `embeddings`: vector embedding record

**Primary Key:** `id` — UUID v4 TEXT. This UUID is also used as the filename in the `attachments/` directory, ensuring a stable, collision-free file naming scheme.

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `note_id` | `notes(id)` | CASCADE — permanently deleting a Note permanently deletes its Attachment records. The corresponding files in `attachments/` are deleted by the application layer after the database record is removed. |

**Unique Constraints:**
- None on filename — multiple attachments may have the same original filename across different notes.

**Soft Delete:** `deleted_at DATETIME` — NULL if active. A soft-deleted attachment's file remains in `attachments/` until permanent deletion.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key; also the base filename in `attachments/` |
| `note_id` | TEXT | NOT NULL | UUID of the parent Note |
| `original_filename` | TEXT | NOT NULL | The filename as provided by the user |
| `mime_type` | TEXT | NOT NULL | MIME type of the file |
| `file_size_bytes` | INTEGER | NOT NULL | File size at time of attachment |
| `checksum` | TEXT | NOT NULL | SHA-256 hex hash of the file content |
| `ocr_status` | TEXT | NOT NULL | `pending` \| `processing` \| `completed` \| `failed` \| `not_applicable` |
| `embedding_status` | TEXT | NOT NULL | `pending` \| `processing` \| `completed` \| `failed` \| `not_applicable` |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of attachment |
| `deleted_at` | DATETIME | NULL | UTC timestamp of soft delete; NULL = active |

---

### 3.4 `tags`

**Responsibility:** Defines the set of tags available within a Workspace. Tags are created globally (Workspace-scoped) and then associated with Notes and Attachments through junction tables.

**Relationships:**
- One-to-many with `note_tags`: junction for Note associations
- One-to-many with `attachment_tags`: junction for Attachment associations

**Primary Key:** `id` — UUID v4 TEXT

**Foreign Keys:** None. `tags` is a root table.

**Unique Constraints:**
- `name` — UNIQUE within the Workspace. Two tags cannot have the same name. Tag names are case-insensitive by application convention (lowercased before storage).

**Soft Delete:** None. Tags are physically deleted when removed. Deleting a tag removes its `note_tags` and `attachment_tags` records through CASCADE. Tags do not have user-visible "trash" behavior.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `name` | TEXT | NOT NULL | Unique tag name within the Workspace |
| `color` | TEXT | NULL | Optional hex color code for UI display |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of tag creation |

---

### 3.5 `note_tags` (Junction Table)

**Responsibility:** The many-to-many association between Notes and Tags.

**Relationships:**
- Many-to-one with `notes`
- Many-to-one with `tags`

**Primary Key:** Composite — `(note_id, tag_id)`. This guarantees that a tag is applied to a note at most once.

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `note_id` | `notes(id)` | CASCADE — removing a note removes its tag associations |
| `tag_id` | `tags(id)` | CASCADE — removing a tag removes all associations with that tag |

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `note_id` | TEXT | NOT NULL | UUID of the Note |
| `tag_id` | TEXT | NOT NULL | UUID of the Tag |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of association |

---

### 3.6 `attachment_tags` (Junction Table)

**Responsibility:** The many-to-many association between Attachments and Tags.

**Relationships:**
- Many-to-one with `attachments`
- Many-to-one with `tags`

**Primary Key:** Composite — `(attachment_id, tag_id)`.

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `attachment_id` | `attachments(id)` | CASCADE |
| `tag_id` | `tags(id)` | CASCADE |

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `attachment_id` | TEXT | NOT NULL | UUID of the Attachment |
| `tag_id` | TEXT | NOT NULL | UUID of the Tag |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of association |

---

### 3.7 `todos`

**Responsibility:** Task records within a Workspace. Todos are first-class entities, not merely checklist items inside Note content. They may be associated with a Note to provide context.

**Relationships:**
- Many-to-one with `notes` (optional): a Todo may reference a Note

**Primary Key:** `id` — UUID v4 TEXT

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `note_id` | `notes(id)` | SET NULL — deleting a Note leaves orphaned Todos as unlinked Todos, preserving the task record |

**Unique Constraints:** None.

**Soft Delete:** `deleted_at DATETIME`.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `note_id` | TEXT | NULL | UUID of associated Note; NULL = standalone todo |
| `title` | TEXT | NOT NULL | Task description |
| `completed` | INTEGER | NOT NULL | 0 = incomplete, 1 = complete |
| `due_date` | DATETIME | NULL | Optional due date |
| `priority` | INTEGER | NULL | Priority: 1 = high, 2 = medium, 3 = low; NULL = no priority |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of creation |
| `updated_at` | DATETIME | NOT NULL | UTC timestamp of last update |
| `deleted_at` | DATETIME | NULL | UTC timestamp of soft delete; NULL = active |

---

### 3.8 `wiki_links`

**Responsibility:** Resolved internal link records between Notes. When a Note is saved with `[[Target Title]]` syntax, the application resolves the target, creates a WikiLink record, and uses it to maintain backlinks.

**Relationships:**
- Many-to-one with `notes` as source
- Many-to-one with `notes` as target (nullable — link may not yet be resolved)

**Primary Key:** `id` — UUID v4 TEXT

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `source_note_id` | `notes(id)` | CASCADE — removing source note removes its outgoing links |
| `target_note_id` | `notes(id)` | SET NULL — removing target note marks link as unresolved |

**Unique Constraints:** `(source_note_id, target_note_id, link_text)` — prevents duplicate links for the same source-target pair with the same text.

**Soft Delete:** None. WikiLink records are physically deleted and recreated on each note save (the current links replace the previous set).

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `source_note_id` | TEXT | NOT NULL | UUID of the Note containing the link |
| `target_note_id` | TEXT | NULL | UUID of the linked Note; NULL = unresolved |
| `link_text` | TEXT | NOT NULL | The original `[[text]]` content |
| `resolved` | INTEGER | NOT NULL | 1 = resolved to a note UUID, 0 = unresolved |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of link record creation |

---

### 3.9 `ai_chats`

**Responsibility:** AI conversation session records within a Workspace.

**Relationships:**
- One-to-many with `chat_messages`

**Primary Key:** `id` — UUID v4 TEXT

**Soft Delete:** `deleted_at DATETIME`.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `title` | TEXT | NOT NULL | Conversation title |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of session creation |
| `last_active_at` | DATETIME | NOT NULL | UTC timestamp of last message |
| `deleted_at` | DATETIME | NULL | UTC timestamp of soft delete; NULL = active |

---

### 3.10 `chat_messages`

**Responsibility:** Individual messages within an AI conversation. Each message is either a user message or an AI response. AI responses carry citation data.

**Relationships:**
- Many-to-one with `ai_chats`

**Primary Key:** `id` — UUID v4 TEXT

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `chat_id` | `ai_chats(id)` | CASCADE — deleting a chat deletes all its messages |

**Soft Delete:** None. Messages are deleted through their parent Chat's cascade.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `chat_id` | TEXT | NOT NULL | UUID of parent AIChat |
| `role` | TEXT | NOT NULL | `user` or `assistant` |
| `content` | TEXT | NOT NULL | Message text content |
| `citations` | TEXT | NULL | JSON array of citation objects (`[{noteId, noteTitle, excerpt}]`) |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of message |

---

### 3.11 `embeddings`

**Responsibility:** Metadata for embedding vectors generated from Notes and Attachments. The vector data itself is stored in a sqlite-vec virtual table (`vec_embeddings`). This table stores the metadata that connects a vector to its source entity.

**Relationships:**
- Many-to-one with `notes` (when `source_type = 'note'`)
- Many-to-one with `attachments` (when `source_type = 'attachment'`)

**Primary Key:** `id` — UUID v4 TEXT

**Unique Constraints:**
- `(source_type, source_id, model_id)` — one embedding record per source entity per model.

**Foreign Keys:** None on `source_id` (because it is polymorphic — it references either `notes` or `attachments`). Referential integrity is enforced at the application layer by the embedding repository.

**Soft Delete:** None. Embedding records are updated in-place (marking stale) or deleted when the source entity is deleted.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key; also the row key in the sqlite-vec virtual table |
| `source_type` | TEXT | NOT NULL | `note` or `attachment` |
| `source_id` | TEXT | NOT NULL | UUID of the source Note or Attachment |
| `model_id` | TEXT | NOT NULL | Identifier of the embedding model used |
| `dimensions` | INTEGER | NOT NULL | Vector dimension count |
| `is_stale` | INTEGER | NOT NULL | 0 = current, 1 = stale (re-embedding needed) |
| `generated_at` | DATETIME | NOT NULL | UTC timestamp of vector generation |

---

### 3.12 `version_history`

**Responsibility:** Append-only snapshots of Note content at each save. Rows are never updated. The snapshot represents the state of the Note at `created_at`.

**Relationships:**
- Many-to-one with `notes`

**Primary Key:** `id` — UUID v4 TEXT

**Foreign Keys:**

| Column | References | ON DELETE |
|---|---|---|
| `note_id` | `notes(id)` | CASCADE — permanently deleting a Note deletes all its version history |

**Soft Delete:** None. Version history rows are physically deleted by the pruning background job when they exceed the retention limit. They are never soft-deleted.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `note_id` | TEXT | NOT NULL | UUID of the parent Note |
| `version_number` | INTEGER | NOT NULL | Monotonically increasing per Note; version 1 = oldest |
| `title_snapshot` | TEXT | NOT NULL | Note title at time of snapshot |
| `body_snapshot` | TEXT | NOT NULL | Note body at time of snapshot |
| `label` | TEXT | NULL | Optional user-assigned version label |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of snapshot |

**Unique Constraints:** `(note_id, version_number)` — version numbers are unique per Note.

---

### 3.13 `plugin_configurations`

**Responsibility:** Workspace-scoped configuration and state for each installed Plugin.

**Relationships:** None — standalone table.

**Primary Key:** `id` — UUID v4 TEXT

**Unique Constraints:** `(plugin_id)` — one configuration record per plugin per Workspace.

**Soft Delete:** None. Plugin configurations are physically deleted when a plugin is uninstalled.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `plugin_id` | TEXT | NOT NULL | The plugin's declared unique identifier |
| `plugin_version` | TEXT | NOT NULL | Installed plugin version |
| `enabled` | INTEGER | NOT NULL | 1 = enabled, 0 = disabled |
| `configuration` | TEXT | NULL | JSON blob — plugin-defined configuration schema |
| `installed_at` | DATETIME | NOT NULL | UTC timestamp of installation |
| `updated_at` | DATETIME | NOT NULL | UTC timestamp of last configuration update |

---

### 3.14 `application_settings`

**Responsibility:** Workspace-level user preferences. This table contains exactly one row per Workspace (singleton pattern).

**Relationships:** None — standalone table.

**Primary Key:** `id` — UUID v4 TEXT (singleton; a fixed value may be used for the single row, or the first row is always used).

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `ai_provider` | TEXT | NOT NULL | Active AI provider identifier (default: `ollama`) |
| `embedding_model` | TEXT | NOT NULL | Active embedding model name |
| `theme` | TEXT | NOT NULL | Active UI theme (default: `system`) |
| `version_history_limit` | INTEGER | NOT NULL | Max versions retained per Note (default: 50) |
| `backup_enabled` | INTEGER | NOT NULL | 1 = automatic backup enabled |
| `backup_frequency_hours` | INTEGER | NULL | Hours between automatic backups |
| `backup_retention_days` | INTEGER | NULL | Days to retain backup archives |
| `updated_at` | DATETIME | NOT NULL | UTC timestamp of last settings update |

---

### 3.15 `background_jobs`

**Responsibility:** Persists the state of background jobs (OCR, embedding, sync, backup) across application restarts. Ensures that interrupted jobs are resumed on next launch.

**Relationships:** None — standalone table.

**Primary Key:** `id` — UUID v4 TEXT

**Soft Delete:** None. Completed and failed jobs are retained for a configurable period for diagnostic purposes, then physically deleted.

**Columns:**

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | TEXT | NOT NULL | UUID v4 primary key |
| `job_type` | TEXT | NOT NULL | `ocr` \| `embedding` \| `thumbnail` \| `backup` \| `sync` \| `import` \| `export` |
| `status` | TEXT | NOT NULL | `queued` \| `running` \| `completed` \| `failed` \| `cancelled` |
| `payload` | TEXT | NOT NULL | JSON blob — job-specific input data (e.g., attachment ID for OCR) |
| `result` | TEXT | NULL | JSON blob — job output or error detail |
| `retry_count` | INTEGER | NOT NULL | Number of retries attempted; default 0 |
| `created_at` | DATETIME | NOT NULL | UTC timestamp of job creation |
| `updated_at` | DATETIME | NOT NULL | UTC timestamp of last status update |
| `completed_at` | DATETIME | NULL | UTC timestamp of completion or failure |

---

## 4. Full-Text Search Tables

### 4.1 `fts_notes` (FTS5 Virtual Table)

**Responsibility:** The FTS5 full-text search index over note titles and body text. This is a SQLite FTS5 virtual table, not a regular table. It is managed separately from Prisma migrations.

**Indexed Columns:**
- `title` — Note title text
- `body` — Note body text (extracted from rich text format)
- `note_id` — Source Note UUID (for result resolution)

**Synchronization:** The `fts_notes` index is kept in sync with the `notes` table through explicit `INSERT`, `UPDATE`, and `DELETE` operations issued by the Note repository within the same database transaction as the note write.

### 4.2 `fts_attachments` (FTS5 Virtual Table)

**Responsibility:** The FTS5 full-text search index over OCR-extracted text from attachments.

**Indexed Columns:**
- `ocr_text` — full OCR-extracted text of the attachment
- `attachment_id` — Source Attachment UUID

**Synchronization:** Updated by the OCR job after processing an attachment, in the same transaction as the `ocr_status` column update on the `attachments` record.

---

## 5. Cascade Rules Summary

| Parent Table | Child Table | ON DELETE Rule | Rationale |
|---|---|---|---|
| `folders` | `folders` (children) | SET NULL | Folder deletion makes children root-level, not orphaned |
| `folders` | `notes` | SET NULL | Folder deletion moves notes to root level |
| `notes` | `attachments` | CASCADE | Note permanent deletion removes attachment records |
| `notes` | `note_tags` | CASCADE | Note permanent deletion removes tag associations |
| `notes` | `todos` (note_id) | SET NULL | Note deletion leaves todos as standalone tasks |
| `notes` | `wiki_links` (source) | CASCADE | Note deletion removes its outgoing links |
| `notes` | `wiki_links` (target) | SET NULL | Note deletion marks incoming links as unresolved |
| `notes` | `version_history` | CASCADE | Note permanent deletion removes all snapshots |
| `tags` | `note_tags` | CASCADE | Tag deletion removes all associations |
| `tags` | `attachment_tags` | CASCADE | Tag deletion removes all associations |
| `attachments` | `attachment_tags` | CASCADE | Attachment deletion removes tag associations |
| `ai_chats` | `chat_messages` | CASCADE | Chat deletion removes all messages |

---

## 6. Soft Delete vs. Hard Delete Summary

| Table | Soft Delete | Physical Delete Trigger |
|---|---|---|
| `folders` | Yes — `deleted_at` | User empties Trash / permanent delete |
| `notes` | Yes — `deleted_at` | User empties Trash / permanent delete |
| `attachments` | Yes — `deleted_at` | User permanently deletes attachment |
| `todos` | Yes — `deleted_at` | User permanently deletes todo |
| `ai_chats` | Yes — `deleted_at` | User permanently deletes chat |
| `tags` | No | Immediate physical delete |
| `note_tags` | No | Cascade from Note or Tag delete |
| `attachment_tags` | No | Cascade from Attachment or Tag delete |
| `wiki_links` | No | Recreated on each note save |
| `version_history` | No | Pruning job (retention limit) or Note permanent delete |
| `embeddings` | No | Stale flag; physical delete on source entity delete |
| `plugin_configurations` | No | Plugin uninstall |
| `background_jobs` | No | Age-based cleanup job |

---

## 7. Future Considerations

- **Note relations table:** If typed inter-note relations (beyond wiki links) are added, a `note_relations` table with `relation_type` would extend the current wiki link model.
- **Attachment versions:** If attachments become versioned (user can update a file while keeping the history), a `attachment_versions` table mirrors the `version_history` pattern.
- **Shared tags across Workspaces:** Out of scope in V1. Each Workspace has its own `tags` table. If cross-Workspace tag sharing is added in the future, it requires an application-layer merge operation, not a schema foreign key.
