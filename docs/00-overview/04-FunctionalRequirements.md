# 04 — Functional Requirements

> **Document Type:** Functional Requirements Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-Vision.md](./01-Vision.md) · [02-Goals.md](./02-Goals.md) · [03-Scope.md](./03-Scope.md) · [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md) · [07-Glossary.md](./07-Glossary.md)

---

## 1. Purpose

This document specifies the functional requirements for Notebook — the observable behaviors, data operations, and user interactions that the system **shall** support. Requirements are organized by feature area corresponding to the scope defined in [03-Scope.md](./03-Scope.md).

Non-functional requirements (performance, security, reliability) are covered in [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md). Implementation details are deferred to module-level specifications in `docs/modules/`.

---

## 2. Requirement Identifier Convention

Each requirement is identified as `FR-<AREA>-<NUMBER>`.

| Area Code | Feature Area |
|---|---|
| `WS` | Workspace Management |
| `FL` | Folder Management |
| `NT` | Notes & Rich Text Editor |
| `AT` | Attachments |
| `OCR` | Optical Character Recognition |
| `FTS` | Full-Text Search |
| `SEM` | Semantic Search |
| `AI` | Local AI / RAG |
| `VH` | Version History |
| `TD` | Todo Management |
| `TAG` | Tags |
| `SYNC` | Google Drive Synchronization |
| `IMP` | Import |
| `EXP` | Export |
| `TR` | Trash |
| `PLG` | Plugin System |

---

## 3. Workspace Management

**FR-WS-01** The application **shall** allow users to create a new Workspace by specifying a name and a local directory path.

**FR-WS-02** The application **shall** allow users to open an existing Workspace from the local filesystem.

**FR-WS-03** The application **shall** allow users to rename a Workspace.

**FR-WS-04** The application **shall** allow users to delete a Workspace, with a mandatory confirmation step that warns of permanent data loss.

**FR-WS-05** The application **shall** support multiple Workspaces on the same machine, switchable without restarting the application.

**FR-WS-06** Each Workspace **shall** maintain its own independent set of: Folders, Notes, Attachments, AI Chats, Embeddings, Todos, Tags, Settings, and Version History.

**FR-WS-07** The application **shall** persist the list of recently opened Workspaces and present it on the launch screen.

**FR-WS-08** Each Workspace **shall** be stored as a local directory containing an embedded SQLite database and an attachments subdirectory.

**FR-WS-09** The application **shall** support exporting a Workspace to a portable archive format suitable for backup or migration to another machine.

**FR-WS-10** The application **shall** support importing a Workspace from a previously exported Workspace archive, restoring all content and structure.

**FR-WS-11** The application **shall** support creating a local backup snapshot of a Workspace on demand.

**FR-WS-12** The application **shall** support restoring a Workspace from a local backup snapshot.

**FR-WS-13** Each Workspace **shall** be synchronizable to Google Drive independently; enabling or disabling sync for one Workspace **shall not** affect any other Workspace.

### Acceptance Criteria — Workspace Management

- A new Workspace can be created, populated with content, closed, and successfully reopened with all content intact.
- Multiple Workspaces can be active and switchable in a single application session.
- Deleting a Workspace removes all associated local data from the filesystem.
- A Workspace exported and then imported on a new machine produces an identical Workspace with all notes, folders, attachments, tags, todos, and version history intact.
- A backup can be created and a Workspace can be fully restored from that backup.

---

## 4. Folder Management

**FR-FL-01** The application **shall** allow users to create folders within a Workspace.

**FR-FL-02** The application **shall** support nested (hierarchical) folder structures of arbitrary depth.

**FR-FL-03** The application **shall** allow users to rename folders.

**FR-FL-04** The application **shall** allow users to move folders, including their contents, to a different location in the hierarchy.

**FR-FL-05** The application **shall** allow users to delete folders. Deleted folders and their contents **shall** be moved to the Workspace Trash (see §15).

**FR-FL-06** The application **shall** display the folder hierarchy in a navigational sidebar.

### Acceptance Criteria — Folder Management

- Folders and their contents survive Workspace close and reopen.
- Moving a folder preserves all child notes, folders, and attachments.
- Deleting a folder sends all content to Trash, from which it is recoverable.

---

## 5. Notes and Rich Text Editor

**FR-NT-01** The application **shall** allow users to create, open, edit, save, and delete notes within a Workspace.

**FR-NT-02** The rich text editor **shall** support, at minimum: headings (H1–H6), paragraphs, bold, italic, underline, strikethrough, inline code, code blocks with syntax highlighting, ordered lists, unordered lists, task lists, tables, blockquotes, horizontal rules, and embedded images.

**FR-NT-03** The editor **shall** support wiki-style internal links in the format `[[Note Title]]` that navigate to the referenced note within the same Workspace.

**FR-NT-04** The application **shall** automatically maintain bidirectional backlinks: when Note A links to Note B, Note B **shall** display a backlink to Note A without user intervention.

**FR-NT-05** Backlinks **shall** be updated automatically when a note is renamed, moved, or deleted.

**FR-NT-06** Notes **shall** support user-defined titles distinct from file names or database identifiers.

**FR-NT-07** Notes **shall** be associated with a Workspace and optionally with a Folder.

**FR-NT-08** The application **shall** support moving a note to a different Folder within the same Workspace.

**FR-NT-09** The application **shall** display the note's word count, character count, and last-modified timestamp.

**FR-NT-10** The editor **shall** auto-save note content at a configurable interval or on each edit event.

**FR-NT-11** Backlinks **shall** be surfaced to the AI retrieval subsystem as additional context signals, improving the relevance of AI-generated responses by treating linked notes as semantically related content.

### Acceptance Criteria — Notes

- All supported formatting elements render correctly and persist after save.
- Wiki links navigate correctly and backlinks appear automatically.
- Renaming a linked note updates all referencing wiki links and backlinks.
- Notes persist across application restarts.

---

## 6. Attachments

**FR-AT-01** The application **shall** allow users to attach one or more files to a note.

**FR-AT-02** Supported attachment types **shall** include, at minimum: PDF, JPEG, PNG, GIF, WebP, plain text (`.txt`), Microsoft Word (`.docx`), and spreadsheets (`.xlsx`, `.csv`).

**FR-AT-03** Attached files **shall** be stored within the Workspace directory on the local filesystem.

**FR-AT-04** The application **shall** display a list of attachments associated with each note.

**FR-AT-05** The application **shall** allow users to open, download, rename, and delete individual attachments.

**FR-AT-06** The application **shall** display a preview of image attachments inline within the note or attachment panel.

**FR-AT-07** Deleting an attachment **shall** move it to the Workspace Trash (see §15).

**FR-AT-08** The application **shall** extract and index text content from plain text, Word, and spreadsheet attachments for search and AI retrieval.

### Acceptance Criteria — Attachments

- Files can be attached, previewed, and re-downloaded without corruption.
- Attached files are stored in the Workspace directory and remain accessible if the application is reinstalled.
- Deleting an attachment sends it to Trash and removes it from search results.

---

## 7. Optical Character Recognition (OCR)

**FR-OCR-01** The application **shall** automatically perform OCR on image attachments (JPEG, PNG, GIF, WebP) when they are added to a note.

**FR-OCR-02** The application **shall** automatically perform OCR on scanned or image-based PDF attachments when they are added to a note.

**FR-OCR-03** OCR-extracted text **shall** be stored and associated with the attachment in the local database.

**FR-OCR-04** OCR-extracted text **shall** be included in the full-text search index (see §8).

**FR-OCR-05** OCR-extracted text **shall** be included in the embedding and semantic search index (see §9).

**FR-OCR-06** OCR processing **shall** occur locally using an embedded OCR engine; no network request **shall** be made for OCR.

**FR-OCR-07** The application **should** indicate OCR processing status (pending, in progress, complete, failed) in the attachment UI.

**FR-OCR-08** The application **may** allow users to manually trigger re-processing of OCR for an attachment.

### Acceptance Criteria — OCR

- Text extracted from an image attachment is discoverable via full-text search.
- OCR processing completes without internet connectivity.
- OCR status is visible to the user.

---

## 8. Full-Text Search

**FR-FTS-01** The application **shall** provide a full-text search interface accessible from any point in the application.

**FR-FTS-02** Full-text search **shall** index, at minimum: note titles, note body content, and OCR-extracted attachment text.

**FR-FTS-03** Search results **shall** be ranked by relevance.

**FR-FTS-04** The application **should** support phrase matching by enclosing terms in quotes.

**FR-FTS-05** The application **should** support basic boolean operators (AND, OR, NOT) in search queries.

**FR-FTS-06** Search results **shall** display a highlighted snippet showing the matching context within the source content.

**FR-FTS-07** Search **shall** be scoped to the currently active Workspace.

**FR-FTS-08** Full-text search **shall** operate entirely offline with no network dependency.

### Acceptance Criteria — Full-Text Search

- A note is discoverable by searching for any word in its title or body.
- OCR-extracted text from an attachment is discoverable via full-text search.
- Search returns results within the target latency defined in [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md).

---

## 9. Semantic Search

**FR-SEM-01** The application **shall** generate vector embeddings for notes and attachment text content.

**FR-SEM-02** Embeddings **shall** be generated locally using the configured Ollama embedding model; no cloud embedding API **shall** be required.

**FR-SEM-03** The application **shall** store embeddings in the local database using an embedded vector store.

**FR-SEM-04** The application **shall** provide a semantic search interface that accepts natural language queries and returns conceptually related content, independent of exact keyword matches.

**FR-SEM-05** Semantic search results **shall** be ranked by vector similarity score.

**FR-SEM-06** The application **shall** automatically re-embed content when a note or attachment is updated.

**FR-SEM-07** Semantic search **shall** be scoped to the currently active Workspace.

**FR-SEM-08** Semantic search **shall** operate entirely offline.

### Acceptance Criteria — Semantic Search

- A note is discoverable via semantic search using a paraphrase of its content.
- Embedding generation completes without internet connectivity.
- Embeddings are updated after a note is edited.

---

## 10. Local AI — Retrieval-Augmented Generation (RAG)

**FR-AI-01** The application **shall** provide an AI chat interface within each Workspace.

**FR-AI-02** Upon receiving a user query, the AI subsystem **shall** retrieve the most semantically relevant notes and attachment content from the active Workspace using vector search.

**FR-AI-03** Retrieved content **shall** be used as context for the AI model's response (RAG pattern).

**FR-AI-04** The AI **shall not** use knowledge outside of the user's indexed Workspace content to answer queries.

**FR-AI-05** The AI **shall** cite the source notes or attachments it used when formulating a response.

**FR-AI-06** The application **shall** use Ollama as the default local AI inference provider.

**FR-AI-07** The application **shall** allow users to select the Ollama model to use for AI chat within Workspace settings.

**FR-AI-08** AI chat responses **should** be streamed to the UI incrementally as they are generated.

**FR-AI-09** AI chat history **shall** be persisted within the Workspace and available across sessions.

**FR-AI-10** The application **shall** allow users to clear AI chat history for a Workspace.

**FR-AI-11** All AI inference **shall** occur locally; no query, note content, or response **shall** be sent to a remote AI service unless the user has explicitly configured a remote provider via the plugin system.

### Acceptance Criteria — Local AI

- AI answers a question about note content and cites the source note.
- AI chat operates without internet connectivity when using Ollama.
- AI does not fabricate answers about topics not present in the Workspace.
- Chat history persists across application restarts.

---

## 11. Version History

**FR-VH-01** The application **shall** automatically record a version snapshot of a note each time it is saved.

**FR-VH-02** The application **shall** provide a version history panel displaying all recorded snapshots for a note, with timestamps.

**FR-VH-03** Users **shall** be able to preview the content of any prior version.

**FR-VH-04** Users **shall** be able to restore any prior version, replacing the current note content.

**FR-VH-05** Version history **shall** be stored locally within the Workspace database.

**FR-VH-06** The application **may** allow users to configure a maximum retention period or maximum number of versions retained per note.

### Acceptance Criteria — Version History

- After editing a note multiple times, all prior versions are listed in the history panel.
- Restoring a prior version replaces the note content and the restoration is itself recorded as a new version.
- Version history is available offline.

---

## 12. Todo Management

**FR-TD-01** The application **shall** allow users to create todo items within a Workspace.

**FR-TD-02** Each todo item **shall** have, at minimum: a title, a completion status, and a creation timestamp.

**FR-TD-03** Todo items **may** include: a due date, a priority level, and a description.

**FR-TD-04** Todo items **may** be associated with a specific note within the Workspace.

**FR-TD-05** The application **shall** allow users to mark todos as complete or incomplete.

**FR-TD-06** The application **shall** allow users to edit and delete todos.

**FR-TD-07** The application **shall** provide a Workspace-level view of all todos, filterable by completion status.

### Acceptance Criteria — Todo Management

- Todos persist across application restarts.
- Completing a todo updates its status immediately.
- Todos associated with a note are visible from the note view.

---

## 13. Tags

**FR-TAG-01** The application **shall** allow users to apply one or more tags to any note or attachment.

**FR-TAG-02** Tags **shall** be user-defined strings, scoped to the active Workspace.

**FR-TAG-03** The application **shall** provide a tag browser listing all tags in the Workspace.

**FR-TAG-04** Selecting a tag **shall** display all notes and attachments associated with that tag.

**FR-TAG-05** Tags **shall** be included in full-text search results.

**FR-TAG-06** The application **shall** allow users to rename and delete tags Workspace-wide.

### Acceptance Criteria — Tags

- Applying a tag to a note makes it appear in the tag browser.
- Renaming a tag renames it across all associated notes.
- Tag filtering returns the correct set of notes.

---

## 14. Google Drive Synchronization

**FR-SYNC-01** The application **shall** support optional synchronization of a Workspace to a user-owned Google Drive account.

**FR-SYNC-02** The application **shall** use the Google Drive OAuth 2.0 authorization flow to obtain user consent before accessing any Google Drive resources.

**FR-SYNC-03** The application **shall** store OAuth credentials securely in the local system credential store and **shall not** transmit them to any developer-owned service.

**FR-SYNC-04** Synchronization **shall** be user-initiated; the application **shall not** sync automatically in the background without explicit user action or prior user-configured schedule.

**FR-SYNC-05** The application **shall** handle sync conflicts and **shall** present conflict resolution options to the user when automatic resolution is not possible.

**FR-SYNC-06** The application **shall** display sync status (idle, syncing, last synced, error) in the Workspace UI.

**FR-SYNC-07** A sync failure **shall not** corrupt or lose locally stored data.

**FR-SYNC-08** Users **shall** be able to revoke Google Drive access and disable sync for a Workspace.

**FR-SYNC-09** All core features **shall** remain fully operational when sync is disabled or when the application is offline.

**FR-SYNC-10** Google Drive **shall** be used exclusively as an optional synchronization target. It **shall not** serve as the primary data store. The local SQLite database and filesystem are always authoritative. Synchronized copies in Google Drive are secondary replicas only.

### Acceptance Criteria — Google Drive Sync

- After authorization, syncing copies Workspace data to Google Drive and restores it on a second machine.
- Revoking authorization removes stored credentials and stops all sync activity.
- A sync error does not affect local data integrity.

---

## 15. Import

**FR-IMP-01** The application **shall** support importing Markdown files (`.md`) as new notes into a Workspace.

**FR-IMP-02** The application **shall** support importing plain text files (`.txt`) as new notes.

**FR-IMP-03** The import process **shall** preserve note titles derived from file names or front matter where present.

**FR-IMP-04** The application **should** support bulk import of a directory of Markdown or text files.

**FR-IMP-05** The plugin system (§17) **may** be used to add support for additional import formats (e.g., Notion, Evernote, Obsidian).

### Acceptance Criteria — Import

- Importing a Markdown file creates a note with the correct title and formatted content.
- Bulk import of a directory of Markdown files creates corresponding notes in the Workspace.

---

## 16. Export

**FR-EXP-01** The application **shall** support exporting individual notes as Markdown files (`.md`).

**FR-EXP-02** The application **shall** support exporting individual notes as plain text files (`.txt`).

**FR-EXP-03** The application **shall** support exporting an entire Workspace as a collection of Markdown files, preserving the folder hierarchy.

**FR-EXP-04** Exported Markdown **shall** preserve all text formatting, headings, lists, and tables representable in standard Markdown.

**FR-EXP-05** The plugin system (§17) **may** be used to add support for additional export formats (e.g., PDF, HTML, JSON).

### Acceptance Criteria — Export

- An exported Markdown file renders correctly in a standard Markdown viewer.
- Exporting a Workspace to Markdown and re-importing it results in faithful note reconstruction.

---

## 17. Trash

**FR-TR-01** The application **shall** maintain a per-Workspace Trash that collects soft-deleted notes, folders, and attachments.

**FR-TR-02** Items moved to Trash **shall** be removed from the main Workspace view but remain stored locally.

**FR-TR-03** Users **shall** be able to browse items in the Trash and restore individual items to their original location, or to the Workspace root if the original location no longer exists.

**FR-TR-04** Users **shall** be able to permanently delete individual items from the Trash.

**FR-TR-05** The application **should** support a bulk "empty Trash" operation with a confirmation step.

**FR-TR-06** Items in Trash **shall** be excluded from search results and AI retrieval.

### Acceptance Criteria — Trash

- Deleting a note moves it to Trash; it is no longer returned in search.
- Restoring an item from Trash returns it to the Workspace at its prior location.
- Permanently deleting an item removes it from the local database and filesystem.

---

## 18. Plugin System

**FR-PLG-01** The application **shall** provide a plugin system enabling first-party and third-party developers to extend application functionality.

**FR-PLG-02** The plugin system **shall** support registering extensions for, at minimum: AI inference providers, sync providers, OCR providers, content importers, content exporters, rich text editor extensions, and UI themes.

**FR-PLG-03** The application **shall** provide a plugin management interface where users can view, enable, disable, and remove installed plugins.

**FR-PLG-04** Plugins **shall** be installed from the local filesystem; remote plugin repositories **may** be supported in a future release.

**FR-PLG-05** The application **shall** load and unload plugins without requiring an application restart where technically feasible.

**FR-PLG-06** A plugin **shall** declare its required permissions, and the application **shall** display these to the user before installation.

**FR-PLG-07** The Plugin SDK and API contract **shall** be documented in `docs/sdk/`.

### Acceptance Criteria — Plugin System

- A plugin can be installed, enabled, and functional without modifying core application code.
- Disabling a plugin restores the application to its pre-plugin behavior.
- A misbehaving plugin does not crash the core application.
