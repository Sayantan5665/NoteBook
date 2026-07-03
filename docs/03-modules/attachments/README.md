# Attachments Module

> **Document Type:** Module README
> **Module:** attachments
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §6](../../00-overview/04-FunctionalRequirements.md) · [../../00-overview/04-FunctionalRequirements.md §7](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §3.3](../../02-database/04-Schema.md) · [../../02-database/11-EntityLifecycle.md §5](../../02-database/11-EntityLifecycle.md) · [../../02-database/03-ERD.md](../../02-database/03-ERD.md) · [../notes/README.md](../notes/README.md) · [../search/README.md](../search/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Attachments module defines how binary files are attached to notes, stored, processed, previewed, and deleted within a Workspace.

Attachments are first-class entities in Notebook, not embedded blobs inside notes. A file attached to a note is stored as a named file within the Workspace `attachments/` directory. Its metadata — filename, size, MIME type, OCR status, embedding status — is stored in the `attachments` table. The note references the attachment; the attachment is independent.

Beyond simple storage, this module covers OCR processing: when an image or scanned PDF is attached, the application automatically extracts text using Tesseract.js. This OCR text is then indexed for full-text search and semantic embedding.

---

## Scope

**This module covers:**
- Attaching files to a note (drag-and-drop, file picker)
- Supported file types and validation
- Storing files in `attachments/<uuid>.<ext>` on the filesystem
- Creating attachment metadata records in the database
- Displaying the attachment list for a note
- Opening and previewing attachments (inline images, PDF preview)
- Downloading the original file
- Renaming attachments (display name only — filesystem UUID name is immutable)
- OCR processing: automatic trigger, status tracking, and result storage
- Text extraction from non-image document types (DOCX, PDF text layer, Markdown, plain text)
- Soft-deleting attachments (moving to Trash)
- Restoring attachments from Trash
- Permanently deleting attachments (removing file and cache artifacts from the filesystem)

**This module does NOT cover:**
- FTS5 indexing mechanics (see `search/`)
- Embedding generation mechanics (see `ai/`)
- Tag assignment to attachments (see `tags/`)
- Attachment inclusion in sync (see `sync/`)
- Attachment inclusion in backup (see `backup/`)

---

## Responsibilities

This module is responsible for:

- Validating attachment file type and size against configured limits
- Copying the uploaded file into `attachments/<uuid>.<ext>` atomically
- Creating the `attachments` table row with correct initial status fields
- Emitting `AttachmentAddedEvent` to trigger OCR and embedding pipelines
- Tracking `ocr_status` through its lifecycle (pending → processing → completed/failed)
- Storing OCR-extracted text in `cache/ocr/<uuid>.txt`
- Updating `fts_attachments` when OCR completes (in the same transaction as `ocr_status` update)
- Generating attachment thumbnails for image types and storing in `cache/thumbnails/`
- Cleaning up filesystem artifacts (attachment file, OCR cache, thumbnails) on permanent deletion

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-AttachmentLifecycle.md` | Planned | Add, display, rename, soft-delete, restore, permanent delete workflows |
| `02-OCRProcessing.md` | Planned | OCR trigger, status machine, Tesseract integration, result storage |
| `03-TextExtraction.md` | Planned | Text extraction from DOCX, PDF, Markdown, plain text for FTS and embedding |
| `04-AttachmentPreview.md` | Planned | Image preview, PDF viewer, file type handling, download behavior |
| `05-SupportedFileTypes.md` | Planned | Allowed MIME types, file size limits, and type-specific processing rules |

---

## Key Business Rules (Summary)

- Attachment binary files are never stored inside the database — only in `attachments/` on the filesystem.
- The attachment UUID is the filesystem filename — it never changes, even if the user renames the display name.
- OCR is automatically triggered on attachment add for supported types; it cannot be suppressed by the user but may be manually re-triggered.
- A soft-deleted attachment's file is retained on the filesystem until permanent deletion.
- Permanent deletion of an attachment removes: the database row, `attachments/<uuid>.*`, `cache/ocr/<uuid>.txt`, `cache/thumbnails/<uuid>-*`, and `vec_embeddings` row.
- Attachment processing is always performed locally — no cloud OCR or cloud parsing service is used.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-AT-01 | Attach one or more files to a note |
| FR-AT-02 | Supported types: PDF, JPEG, PNG, GIF, WebP, .txt, .docx, .xlsx, .csv |
| FR-AT-03 | Files stored within the Workspace directory |
| FR-AT-04 | Display list of attachments for a note |
| FR-AT-05 | Open, download, rename, delete attachments |
| FR-AT-06 | Inline image preview |
| FR-AT-07 | Deleting an attachment moves it to Trash |
| FR-AT-08 | Extract and index text from plain text, Word, spreadsheet attachments |
| FR-OCR-01 through FR-OCR-08 | Full OCR lifecycle |

---

## Future Considerations

- **Attachment versioning:** Allow updating an attached file while retaining the previous version, mirroring note version history.
- **Attachment deduplication:** Detect when the same file (by checksum) is attached multiple times and share the physical file while maintaining separate metadata records.
- **Video and audio attachments:** Support for video/audio preview and, optionally, speech-to-text transcription via a plugin.
- **Attachment cross-note referencing:** Display all notes that reference a given attachment (reverse lookup), similar to backlinks for notes.
