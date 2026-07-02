# 03 — Scope

> **Document Type:** Product Scope
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-Vision.md](./01-Vision.md) · [02-Goals.md](./02-Goals.md) · [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) · [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md) · [07-Glossary.md](./07-Glossary.md)

---

## 1. Purpose

This document defines the precise boundaries of the Notebook product — what the system **shall** deliver, what it explicitly **shall not** deliver, and the conditions under which optional features apply. It is the authoritative reference for scope decisions during design, implementation, and review.

---

## 2. System Boundary

Notebook is a **desktop application**. The system boundary encompasses:

| Component | Description |
|---|---|
| Electron host process | Runs on the user's local machine; manages application lifecycle and IPC |
| Angular UI | The user interface rendered inside the Electron shell |
| SQLite database(s) | Managed by Prisma; stores all structured user data locally |
| Local filesystem | Stores attachments, Workspace directories, and exported files |
| Ollama process | Runs locally on the user's machine; provides AI inference (when configured) |
| Google Drive API | Optional, user-initiated network connection for Workspace sync |

The system boundary **excludes**:

- Any developer-owned server, backend, or cloud infrastructure
- Any centralized database, cloud database, or remote storage
- Any authentication or identity service
- Any third-party AI API not explicitly configured by the user
- Any proprietary cloud infrastructure required for core operation

---

## 3. In Scope — Core Features

The following capabilities are in scope for the initial release. Each is described at the capability level. Detailed functional requirements are in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md).

### 3.1 Workspace Management

Notebook is **Workspace-first**. The Workspace is the top-level logical container for all user data. Every Workspace is completely independent.

The application **shall** support creating, opening, renaming, and deleting multiple independent Workspaces. Each Workspace **shall** be a self-contained unit comprising: Folders, Notes, Attachments, AI Chats, Embeddings, Todos, Tags, Settings, and Version History. Workspaces **shall** be persisted as local directories containing an embedded SQLite database.

In addition to basic CRUD operations, each Workspace **shall** support the following lifecycle operations independently:

- **Export:** Export the entire Workspace to a portable format for backup or migration.
- **Import:** Restore or create a Workspace from a previously exported archive.
- **Backup:** Create a local snapshot of the Workspace for disaster recovery.
- **Restore:** Restore a Workspace from a local backup snapshot.
- **Synchronization:** Optionally synchronize the Workspace to a user-owned Google Drive account, independently of other Workspaces.

### 3.2 Folder Management

The application **shall** support hierarchical folder structures within a Workspace. Folders **shall** support create, rename, move, and delete operations.

### 3.3 Rich Text Notes

The application **shall** provide a rich text editor supporting headings, lists, tables, code blocks, inline formatting, and embedded images. The editor **shall** support wiki-style internal links (`[[Note Title]]`). The application **shall** automatically compute and maintain bidirectional backlinks for all wiki links.

### 3.4 Attachments

The application **shall** support attaching files to notes. Supported types **shall** include, at minimum: PDF, images (JPEG, PNG, GIF, WebP), plain text, Microsoft Word documents, and spreadsheets. Attached files **shall** be stored within the local Workspace directory.

### 3.5 Optical Character Recognition (OCR)

The application **shall** extract text from image and scanned PDF attachments using an embedded OCR engine (Tesseract OCR). Extracted text **shall** be indexed and made available for full-text search and AI retrieval.

### 3.6 Full-Text Search (FTS)

The application **shall** provide full-text search across all notes and OCR-extracted attachment content within a Workspace. Search **shall** support relevance ranking and **should** support phrase matching and basic boolean operators.

### 3.7 Semantic Search

The application **shall** generate and store vector embeddings for notes and attachment content. The application **shall** support vector similarity search over embedded content within a Workspace. Embeddings **shall** be computed locally using the configured Ollama embedding model.

### 3.8 Local AI — Retrieval-Augmented Generation (RAG)

The application **shall** provide an AI chat interface within each Workspace. The AI **shall** answer queries using RAG, grounded exclusively in the user's own notes and attachments. The AI **shall not** access external knowledge bases, internet resources, or any API not explicitly configured by the user. Ollama **shall** be the default inference provider.

### 3.9 Version History

The application **shall** maintain an automatic version history for every note, recording each saved state. Users **shall** be able to view, compare, and restore any prior version.

### 3.10 Todo Management

The application **shall** support creating, editing, completing, and deleting todo items within a Workspace. Todos **shall** be Workspace-scoped and **may** be associated with a specific note.

### 3.11 Tags

The application **shall** support tagging notes and attachments with user-defined tags. Tags **shall** be Workspace-scoped. The application **shall** support filtering and searching content by tag.

### 3.12 Google Drive Synchronization

Google Drive is an **optional synchronization provider only**. It is not the primary data store. The primary data store is the local SQLite database and local filesystem.

The application **shall** support optional, bidirectional synchronization of a Workspace to a user-owned Google Drive account. Synchronization **shall** be user-initiated and require explicit user authorization. Synchronization **shall not** be required for any core feature to function. Synchronized copies stored in Google Drive are secondary; the local copy is always authoritative.

### 3.13 Import

The application **shall** support importing content from, at minimum: Markdown files and plain text files. Additional import formats (e.g., Notion export, Evernote ENEX) **may** be supported via the plugin system.

### 3.14 Export

The application **shall** support exporting notes and Workspaces in, at minimum: Markdown and plain text formats. Additional export formats (e.g., PDF, HTML) **may** be supported via the plugin system.

### 3.15 Trash

The application **shall** provide a per-Workspace Trash that collects soft-deleted notes, folders, and attachments. Items in Trash **shall** be recoverable until permanently deleted. The application **should** support bulk-empty of Trash.

### 3.16 Plugin System

The application **shall** provide a plugin system enabling first-party and third-party plugins to extend functionality. The plugin system **shall** support extending, at minimum: AI providers, sync providers, OCR providers, importers, exporters, editor extensions, and themes. Plugin security boundaries are specified in `docs/sdk/`.

---

## 4. In Scope — Cross-Cutting Concerns

- **Offline operation:** All features in §3 except Google Drive Sync (§3.12) **shall** be fully operational without internet connectivity.
- **Multi-workspace:** The application **shall** support multiple independent Workspaces on the same machine.
- **Data portability:** All user data **shall** be stored in open, accessible formats (SQLite files, local filesystem).
- **Keyboard navigation:** Primary workflows **should** be fully operable via keyboard.
- **Theme support:** The application **should** respect system light/dark mode preferences.

---

## 5. Explicitly Out of Scope

The following capabilities are **not** in scope and **shall not** be implied by any in-scope requirement:

| Out-of-Scope Item | Rationale |
|---|---|
| Real-time collaborative editing | Requires a centralized backend; violates local-first principle |
| Graph / canvas visualization of notes | Not required per product direction |
| Note templates | Not required per product direction |
| General-purpose AI chat | AI shall be grounded in user content only |
| Developer-owned backend or API server | Violates local-first and privacy-first principles |
| Centralized authentication or identity management | No backend exists to authenticate against |
| Cloud database | All data is local |
| Mobile application | Desktop platforms only in initial release |
| Web application | Notebook is a native desktop application |
| Peer-to-peer synchronization | Not in scope for initial release (see §6) |
| Automatic background telemetry | Prohibited by privacy-first principle |

---

## 6. Assumptions

1. The application targets Windows, macOS, and Linux desktop platforms via Electron.
2. Users are responsible for installing and running Ollama locally if they wish to use AI and semantic search features.
3. Google Drive sync scope is limited to Workspace data; it does not sync application-level settings across Workspaces unless explicitly designed.
4. Plugin authors are responsible for the security and data-handling behavior of their plugins.

---

## 7. Constraints

| Constraint | Description |
|---|---|
| No centralized infrastructure | The system **shall not** depend on any network resource controlled by the Notebook developers for any core operation |
| Local AI by default | Out-of-the-box AI inference **shall** use Ollama; cloud AI support **may** be added via plugin |
| Single built-in sync provider | Google Drive is the only built-in sync provider; others **may** be added via plugin |
| Open data formats | All primary data **shall** be stored in open formats accessible without proprietary tools |

---

## 8. Design Constraints

The following design constraints are non-negotiable and apply to all architecture and implementation decisions. They are the operationalized form of the core philosophy in [01-Vision.md §4](./01-Vision.md).

| Constraint | Description |
|---|---|
| **Offline-first** | All core features **shall** operate without internet connectivity |
| **Local-first** | The local SQLite database and filesystem are the primary and authoritative data stores |
| **Privacy-first** | No user data **shall** be transmitted externally without explicit, per-action user consent; no telemetry by default |
| **No centralized backend** | Notebook **shall not** require any developer-operated server, centralized database, or proprietary cloud infrastructure |
| **Optional synchronization** | Google Drive **shall** be used only for optional, user-initiated synchronization; it is never the primary store |
| **Modular architecture** | All major subsystems **shall** be implemented behind stable interfaces to enable substitution and extension |
| **Plugin-ready** | The plugin system **shall** be a first-class architectural concern, not a bolted-on afterthought |
| **Free/open-source technologies** | Free and open-source technologies **shall** be used where practical; no mandatory commercial dependency **shall** be introduced for core features |

---

## 9. Future Considerations

- Peer-to-peer Workspace synchronization (e.g., via CRDTs or local network sync).
- Additional built-in sync providers (Dropbox, OneDrive, WebDAV).
- Mobile companion application with read-only or scoped editing capability.
- Browser extension for web clipping into a Workspace.
