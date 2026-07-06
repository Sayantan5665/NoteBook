> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module, Folder Module
> **Document Owner:** Core Architecture Team

# Notes Module

---

## 1. Purpose

The Notes module is the heart of the Notebook application. A Note is the primary knowledge object managed by the user. This module defines the foundational structure of a Note, ensuring it acts as a reliable, immutable anchor for user content, while remaining independent of presentation or search layers.

## 2. Scope

**This document covers:**
- The definition and responsibilities of the Notes module.
- Business rules governing Note behavior.
- Event contracts (Published and Consumed).

**This document does NOT cover:**
- Editor behavior (see `03-modules/editor/`).
- Attachments, Tags, Search, or AI (handled in respective modules).
- Synchronization or Version History.

## 3. Ownership and Responsibilities

The Notes module **owns exclusively the Note domain.**
- It owns the lifecycle, identity, metadata, state, and conceptual content model of Notes.
- It acts as the source of truth for whether a Note exists, what folder it resides in, and its current content payload.

Other modules consume Notes but do NOT own them. For example, the Search module indexes the Note, and the Editor module renders it, but the Notes module is the authoritative owner of the data.

## 4. Dependencies

- **Infrastructure:** SQLite, EventBus.
- **Domain:** Workspace Module (for global context), Folder Module (for hierarchical organization).

## 5. Consumed Interfaces

- **Database Provider:** To persist Note records.
- **Workspace Context:** To ensure the Note is bound to the currently active Workspace.
- **Folder Validation:** To verify that a target Folder exists and is valid before assigning a Note to it.

## 6. Published Events

The Notes module broadcasts its state changes to the system:
- `NoteCreated`: Emitted when a new Note is instantiated.
- `NoteUpdated`: Emitted when content or metadata changes.
- `NoteMoved`: Emitted when a Note's `folderId` changes.
- `NoteDeleted`: Emitted when a Note is moved to the Trash (Soft Delete).
- `NoteRestored`: Emitted when a Note is recovered from the Trash.
- `NotePermanentDeleted`: Emitted when a Note is destroyed (Hard Delete).

## 7. Consumed Events

- `WorkspaceOpened`: Triggers initialization of the Note repository for the active Workspace.
- `FolderDeleted`: Intercepted to cascade soft-deletes to all Notes contained in the deleted Folder.
- `FolderPermanentDeleted`: Intercepted to cascade hard-deletes to all Notes in the destroyed Folder.

## 8. Extension Points

- None natively within the Core module. (Plugins interact with Notes via the Plugin SDK which wraps this module's repository).

## 9. Background Jobs

- None within the core definition. Notes are saved and queried synchronously. (Derivations like Search indexing happen in other modules).

## 10. Settings

- `DefaultNoteFolder`: An optional Workspace setting defining where new Notes are created if no Folder is specified.

## 11. Persistence Philosophy

The Notes module adheres to a strict conceptual flow of data persistence to maintain absolute integrity:

`Runtime Memory` &rarr; `Editing Session` &rarr; `Persistence Layer` &rarr; `Canonical Note` &rarr; `Version History` &rarr; `Derived Artifacts`

- **Runtime State:** Temporary, volatile memory. Runtime state (like an unsaved editing session) MUST NEVER become the authoritative source of truth.
- **Canonical Note:** The single, definitive source of truth residing in the persistent database.
- **Derived Artifacts:** Secondary outputs generated from the Canonical Note. 
  - Examples: Search Index, AI Embeddings, Export Files, Cached Views, OCR Results.
  - **Principle:** Derived artifacts can *always* be regenerated from the source. The Canonical Note remains authoritative at all times.

## 12. Canonical Note

The Note is the **single source of truth** (the Canonical Note).

While other modules may create derived artifacts based on the Note's content, these artifacts are explicitly secondary and transient.
Examples of derived artifacts:
- Search Index
- Embeddings
- Export Files
- Cache
- Thumbnails
- AI Context
- OCR Results

**Principle:** Derived artifacts can always be regenerated from the source. The Canonical Note remains authoritative at all times.

## 13. Note Capabilities

The Note entity exposes several capabilities to the broader system:
- Can be **searched** (Full Text Search)
- Can be **indexed** (for tags, metadata)
- Can generate **AI embeddings** (for semantic retrieval)
- Can be **exported** (to PDF, Markdown)
- Can be **synchronized** (across devices)
- Can be **backed up**
- Can participate in **Wiki Links**
- Can contain **attachments**

**Clarification:** These are capabilities *available* to other modules. They are NOT responsibilities owned by the Notes module itself. The Notes module remains exclusively responsible only for the core Note domain payload and lifecycle.

## 14. Business Rules

- **Workspace Bound:** Every Note belongs to exactly one Workspace.
- **Folder Bound:** Every Note belongs to exactly one Folder.
- **Immutable UUID:** Note UUID is immutable.
- **Independent Identity:** Folder changes never change Note identity. Title changes never change Note identity.
- **Content Separation:** Rich content and metadata are separate concepts. Metadata does not define identity.
- **Explicit Deletion:** Permanent deletion requires explicit user confirmation.
- **Import Normalization:** Imported Notes become native Notes after successful import.
- Decoupling: Notes never depend on Search, AI, or Synchronization.

## 15. Acceptance Criteria

- A Note can be created, updated, and queried independently of the Editor.
- A Note maintains its identity across multiple renames and folder moves.
- Deleting a Note broadcasts the correct event for other modules (like Search) to clean up.

## 16. Cross References

- [01-NoteLifecycle.md](./01-NoteLifecycle.md)
- [02-NoteContent.md](./02-NoteContent.md)
- [03-NoteMetadata.md](./03-NoteMetadata.md)
- [04-NoteIdentity.md](./04-NoteIdentity.md)
- [05-NoteStates.md](./05-NoteStates.md)
- [06-NoteRelationships.md](./06-NoteRelationships.md)
- [07-EditingSession.md](./07-EditingSession.md)
- [08-Autosave.md](./08-Autosave.md)
- [09-VersionHistory.md](./09-VersionHistory.md)
- [10-Recovery.md](./10-Recovery.md)
- [11-NoteEvents.md](./11-NoteEvents.md)
- [12-Templates.md](./12-Templates.md)
- [13-FavoritesAndPinning.md](./13-FavoritesAndPinning.md)
- [14-ArchiveAndTrash.md](./14-ArchiveAndTrash.md)
- [15-ImportExportBehaviour.md](./15-ImportExportBehaviour.md)
- [16-ExtensionPoints.md](./16-ExtensionPoints.md)
