> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 05 — Link Events

---

## 1. Purpose

This document outlines the domain events published and consumed by the Wiki Links module, ensuring loose coupling with the UI and other system components.

## 2. Event Model

### 2.1 Published Events
These events notify the system of graph topology changes.
- **`WikiLinkCreated`**: Emitted when a new valid edge is formed.
- **`WikiLinkRemoved`**: Emitted when a user deletes a link from the payload.
- **`WikiLinkUpdated`**: Emitted if the link metadata changes (e.g., alias added).
- **`BacklinksUpdated`**: A higher-level event telling the UI to refresh the Backlink pane for a specific Note.
- **`BrokenLinkDetected`**: Emitted when validation fails.
- **`BrokenLinkResolved`**: Emitted when a broken link finds its missing target.

### 2.2 Consumed Events
These events inform the module that it needs to re-validate or re-parse.
- **`NoteSaved`**: The trigger to parse the payload for new/removed links.
- **`TargetNoteRenamed`**: Forces the graph to broadcast UI updates.
- **`TargetNoteRestored` / `NoteRestored`**: Triggers validation to resolve broken links.
- **`NoteTrashed`**: Triggers validation to flag links as broken.

## 3. Ordering Philosophy

- **Reactivity:** Link events are purely reactive. They fire *after* the Notes module has committed a change to the database.
- **Event Flow:** `NoteSaved` &rarr; `Parse Payload` &rarr; `Calculate Graph Delta` &rarr; `Publish WikiLinkCreated / Removed`.

## 4. Business Rules

- **Decoupling:** The Wiki Links module does not care who is listening to `BacklinksUpdated`. It simply announces that the graph changed.
- **Idempotency:** Re-parsing an identical Note payload should not emit duplicate `WikiLinkCreated` events.

## 5. Acceptance Criteria

- Deleting a Note immediately results in a `BrokenLinkDetected` event being published for every incoming link.
- Saving a Note without modifying its existing links does not trigger redundant `WikiLinkCreated` events.
