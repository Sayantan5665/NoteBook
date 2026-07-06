> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# Wiki Links & Backlinks Module

---

## 1. Purpose

The Wiki Links & Backlinks module enables Notes to reference other Notes, creating a connected, bidirectional knowledge graph. It provides the domain logic for establishing, validating, and tracking relationships between discrete pieces of knowledge within a Workspace.

## 2. Scope

**This document covers:**
- Wiki Link concepts (forward links).
- Backlink concepts (derived reverse links).
- Link validation and integrity.
- Relationship management between Notes.

**This document does NOT cover:**
- Note content editing (owned by Editor).
- Note storage and identity (owned by Notes module).
- Search indexing.
- AI or Vector Embeddings.
- Graph visualization UI.
- Network-level synchronization.

## 3. Ownership and Responsibilities

- **Ownership:** This module owns the *relationship* data between Notes.
- **Responsibilities:**
  - Track when a Wiki Link is created, updated, or removed.
  - Automatically derive and expose Backlinks for any given Note.
  - Validate the integrity of links (e.g., detecting broken links when a target Note is Trashed).

## 4. Dependencies

- **Notes Module:** The core dependency. The Wiki Links module observes Notes to extract links and validate target identities.

## 5. Interfaces and Events

### 5.1 Consumed Interfaces
- `NotesModule.getNoteMetadata(uuid)`
- `NotesModule.getNoteContent(uuid)`

### 5.2 Published Events
- `WikiLinkCreated`
- `WikiLinkRemoved`
- `WikiLinkUpdated`
- `BacklinksUpdated`
- `BrokenLinkDetected`
- `BrokenLinkResolved`

### 5.3 Consumed Events
- `NoteSaved` (Triggers link extraction/update)
- `NoteTrashed` / `NotePermanentDeleted` (Triggers broken link detection)
- `NoteRestored` (Triggers link resolution)

## 6. Extension Points

- **Aliases (future):** Supporting custom display text for a link.
- **Transclusion (future):** Embedding the content of the target Note inline.
- **Block/Heading References (future):** Linking to specific structural elements inside a target Note.

## 7. Settings

- `UpdateLinksOnRename`: Conceptual preference (though inherently supported by UUID architecture, future user-facing toggles might dictate how aliases or textual representations are handled).

## 8. Business Rules

- **UUID Based:** Wiki Links reference immutable Note UUIDs, never just text titles.
- **Titles are Presentation:** The textual title of a Note is presentation only.
- **Renaming is Safe:** Renaming a Note NEVER breaks links to it.
- **Moving is Safe:** Moving a Note to a different Folder NEVER breaks links to it.
- **Derived Backlinks:** Backlinks are purely derived data. They are never manually edited or persisted independently of their forward links.
- **Broken Links Remain Visible:** If a target Note is deleted, the Wiki Link remains in the source Note's content but is flagged as broken.
- **No Note Ownership:** Wiki Links never own the underlying Notes.

## 9. Acceptance Criteria

- Renaming a Note successfully preserves all incoming Wiki Links and Backlinks.
- Trashing a Note correctly updates the Backlink registry and flags incoming links as broken without mutating the source Note payloads.

## 10. Cross References

- [01-WikiLinks.md](./01-WikiLinks.md)
- [02-Backlinks.md](./02-Backlinks.md)
- [03-LinkValidation.md](./03-LinkValidation.md)
- [04-LinkLifecycle.md](./04-LinkLifecycle.md)
- [05-LinkEvents.md](./05-LinkEvents.md)
- [06-ExtensionPoints.md](./06-ExtensionPoints.md)
