> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 11 — Note Events

---

## 1. Purpose

This document defines the Event Model for the Notes module. It specifies how the Notes module communicates its state changes to the rest of the application ecosystem, enforcing a decoupled, event-driven architecture.

## 2. Scope

**This document covers:**
- Published Events (emitted by the Notes module).
- Consumed Events (listened to by the Notes module).
- Conceptual payloads and ordering expectations.

## 3. Event Philosophy

- **Business Actions, Not UI Actions:** Events describe domain occurrences (e.g., `NoteSaved`, `NoteTrashed`) rather than UI occurrences (e.g., `SaveButtonClicked`).
- **Decoupling:** The Notes module does not know *who* is listening. It broadcasts state, and modules like Search or AI react accordingly.
- **Event Ownership:** The Notes module exclusively owns the definition of Note-specific events.

## 4. Published Events

These events are emitted over the central EventBus whenever the Notes module successfully completes a persistent mutation.

### 4.1 Lifecycle Events
- **`NoteCreated`**
  - **Payload:** `{ noteId, workspaceId, folderId, timestamp }`
  - **Purpose:** Signals a new record exists.
- **`NoteMoved`**
  - **Payload:** `{ noteId, oldFolderId, newFolderId, timestamp }`
  - **Purpose:** Triggers UI updates in the folder tree.
- **`NoteTrashed` / `NoteRestored` / `NoteDeleted`**
  - **Payload:** `{ noteId, timestamp }`
  - **Purpose:** Signals to Search/AI to remove the Note from their indexes, or add it back.

### 4.2 State Events
- **`NoteSaved` (or `NoteUpdated`)**
  - **Payload:** `{ noteId, timestamp, isMetadataOnlyChange }`
  - **Purpose:** Signals that persistent state has changed. Search/AI modules use this to re-index the payload.
- **`NoteRenamed`**
  - **Payload:** `{ noteId, newTitle, timestamp }`
  - **Purpose:** Distinct from `NoteSaved` to allow lightweight UI updates in lists without triggering a full re-index.

### 4.3 Session and Subsystem Events
- **`NoteOpened` / `NoteClosed`**
  - **Payload:** `{ noteId, sessionId }`
  - **Purpose:** Tracks active runtime sessions.
- **`VersionCreated` / `VersionRestored`**
  - **Payload:** `{ noteId, versionId, timestamp }`
  - **Purpose:** Audit logging and UI refresh triggers.
- **`RecoveryStarted` / `RecoveryCompleted`**
  - **Payload:** `{ noteId, status }`
  - **Purpose:** Informs the UI to show loading/recovery spinners.
- **`AutosaveCompleted`**
  - **Payload:** `{ noteId, timestamp }`
  - **Purpose:** Powers the subtle "Saved just now" indicator in the UI.

## 5. Consumed Events

The Notes module listens to events from the broader system to maintain integrity.

- **`WorkspaceOpened`**
  - **Purpose:** Initializes the Note database connection for the specific workspace.
- **`FolderDeleted`**
  - **Purpose:** The Notes module catches this and initiates a cascade `NoteTrashed` operation for all Notes residing in that folder.
- **`FolderPermanentDeleted`**
  - **Purpose:** Cascades a hard `NoteDeleted` operation to maintain referential integrity.

## 6. Ordering Expectations

### 6.1 Conceptual Event Sequence
A single user action (like modifying text) triggers a cascade of conceptual business events:

`NoteModified` &rarr; `AutosaveStarted` &rarr; `AutosaveCompleted` &rarr; `VersionCreated` &rarr; `SearchIndexRequested` &rarr; `EmbeddingGenerationRequested`

**Clarifications:**
- This is a conceptual workflow illustrating cause and effect.
- It is NOT an implementation ordering guarantee (e.g., Search Indexing and Embedding Generation may happen in parallel).
- Event consumers remain completely independent of one another.

### 6.2 Transaction Ordering
- Events MUST be emitted *after* the database transaction successfully commits. Emitting an event prior to a commit risks consumers querying a state that does not yet exist.
- Event ordering must be guaranteed by the EventBus (e.g., `NoteCreated` must arrive before `NoteSaved` for the same UUID).

## 7. Acceptance Criteria

- Moving a Note emits `NoteMoved` and does NOT emit `NoteDeleted` + `NoteCreated`.
- Saving a Note emits `NoteSaved`, allowing a decoupled Search module listener to independently fetch the updated payload.
