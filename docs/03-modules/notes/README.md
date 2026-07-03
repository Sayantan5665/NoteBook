# Notes Module

> **Document Type:** Module README
> **Module:** notes
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §5](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §3.2](../../02-database/04-Schema.md) · [../../02-database/11-EntityLifecycle.md §3](../../02-database/11-EntityLifecycle.md) · [../../02-database/09-Versioning.md §3](../../02-database/09-Versioning.md) · [../editor/README.md](../editor/README.md) · [../wikilinks/README.md](../wikilinks/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Notes module defines the complete lifecycle of a note — from creation through editing, versioning, moving, soft-deletion, restoration, and permanent deletion. Notes are the primary content entity in Notebook. Every other module either supports notes or depends on the content within them.

A note consists of a title and a rich text body. The body is stored as a Tiptap JSON document — the authoritative representation of note content. Notes are Workspace-scoped and optionally organized within folders. They accumulate a version history with every save.

---

## Scope

**This module covers:**
- Creating notes (empty or from a template)
- Opening and loading note content
- Saving notes (autosave and manual save)
- Version history: snapshot creation, listing, previewing, restoring, and pruning
- Moving notes between folders or to the root level
- Renaming notes (changing title)
- Soft-deleting notes (moving to Trash)
- Restoring notes from Trash
- Permanently deleting notes from Trash
- Note metadata: word count, character count, creation timestamp, last-modified timestamp, embedding status

**This module does NOT cover:**
- Rich text editing mechanics (see `editor/`)
- Wiki link syntax and resolution (see `wikilinks/`)
- Backlink maintenance (see `backlinks/`)
- Attachment management (see `attachments/`)
- Search indexing mechanics (see `search/`)
- Embedding generation mechanics (see `ai/`)

---

## Responsibilities

This module is responsible for:

- Creating `notes` table rows with initial state
- Persisting note body (Tiptap JSON) and title on save
- Updating `notes.updated_at` and `notes.word_count` on every save
- Inserting `version_history` rows on every save (append-only)
- Updating the FTS5 index (`fts_notes`) transactionally with every note write
- Marking `notes.embedding_status = 'pending'` and emitting `NoteUpdatedEvent` on content save
- Enforcing version history retention and running the background pruning job
- Managing note soft-delete cascade (including dependent wiki link, embedding, and FTS behaviors)
- Providing note metadata to the UI (word count, version count, timestamps)

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-NoteLifecycle.md` | Planned | Create, open, save, move, rename, delete, restore workflows |
| `02-VersionHistory.md` | Planned | Snapshot creation, listing, preview, restore, pruning, labeled version exemption |
| `03-NoteTrash.md` | Planned | Soft delete, Trash panel, restore, permanent deletion and cascade |
| `04-NoteMetadata.md` | Planned | Word count, timestamps, embedding status, note statistics panel |

---

## Key Business Rules (Summary)

- Every note save creates a version history snapshot in the same transaction as the content write.
- The FTS5 index is updated in the same transaction as every note create, update, and delete.
- Note `body` stores Tiptap JSON — generated HTML is never persisted.
- Notes soft-deleted via folder cascade inherit the folder's `deleted_at` timestamp; only those notes are restored when the folder is restored.
- Permanently deleted notes trigger cascade deletion of their version history, note_tags, wiki_links (source), and soft deletion of their attachments.
- Labeled version history rows (`label IS NOT NULL`) are never deleted by the automatic pruning job.
- Note titles are not unique within a Workspace — duplicate titles are permitted.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-NT-01 | Create, open, edit, save, delete notes |
| FR-NT-06 | User-defined note titles |
| FR-NT-07 | Notes belong to a Workspace, optionally to a Folder |
| FR-NT-08 | Move a note to a different Folder |
| FR-NT-09 | Display word count, character count, last-modified |
| FR-NT-10 | Autosave at configurable interval |
| FR-VH-01 | Record a version snapshot on every save |
| FR-VH-02 | Version history panel with timestamps |
| FR-VH-03 | Preview any prior version |
| FR-VH-04 | Restore any prior version |
| FR-VH-05 | Version history stored locally |
| FR-VH-06 | Configurable retention limit |
| FR-TR-01 through FR-TR-06 | Trash behavior for notes |

---

## Future Considerations

- **Note templates:** Allow creating new notes from predefined templates stored within the Workspace.
- **Note relations (typed links):** Beyond wiki links, allow users to define typed relationships between notes (e.g., "this note is a prerequisite for", "this note contradicts").
- **Note locking:** Allow marking a note as read-only to prevent accidental edits.
- **Note pinning:** Allow pinning frequently accessed notes to the top of the note list.
- **Collaborative editing (future plugin):** Multi-user editing would require significant architectural additions (CRDT or OT); deferred to a future plugin capability.
