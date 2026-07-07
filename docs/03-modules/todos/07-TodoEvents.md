> **Document Type:** Module Specification
> **Status:** Frozen
> **Version:** 1.0
> **Depends On:** Todos Module
> **Document Owner:** Core Architecture Team

# 07 — Todo Events

---

## 1. Purpose

This document defines the domain events published and consumed by the Todos module. These events facilitate decoupled coordination between action management and the rest of the Notebook ecosystem, enabling other modules (like Search or AI) to observe task activity without creating direct, tightly coupled dependencies.

## 2. Event Philosophy

- **State Communication:** Events exclusively communicate state changes that have already occurred within the Todos domain.
- **No Ownership Transfer:** Publishing or consuming an event NEVER transfers ownership of data.
- **Loose Coupling:** The Todos module publishes events without knowing who consumes them. It consumes upstream events purely to maintain its own internal consistency (e.g., handling dangling references).

## 3. Published Events

The Todos module publishes the following conceptual events when a Todo's lifecycle or state changes. These events NEVER instruct other modules to modify their canonical data.

- `TodoCreated`: Emitted when a new Todo is successfully captured.
- `TodoUpdated`: Emitted when a Todo's core content (description) or organizational metadata (priority, due date, list) is modified.
- `TodoCompleted`: Emitted when a Todo's status transitions to completed.
- `TodoReopened`: Emitted when a completed Todo is reverted to an active state.
- `TodoArchived`: Emitted when a Todo is moved to the archive state.
- `TodoDeleted`: Emitted when a Todo is permanently removed.
- `TodoRelationshipAdded`: Emitted when a Todo establishes a new reference to an external entity (e.g., a Note).
- `TodoRelationshipRemoved`: Emitted when a Todo severs a reference to an external entity.

## 4. Consumed Events

The Todos module consumes events from upstream canonical modules purely to maintain the integrity of its relationships. It never assumes ownership of the entities described in these events.

- `NoteDeleted`: Consumed to gracefully nullify or flag any Todo references pointing to the deleted Note.
- `FolderDeleted`: Consumed to gracefully nullify or flag any Todo references pointing to the deleted Folder.
- `TagDeleted`: Consumed to gracefully nullify or flag any Todo references pointing to the deleted Tag.
- `WorkspaceArchived`: Consumed to temporarily suspend active alerts or syncs for Todos within that workspace.

## 5. Event Consistency & Ordering

- **Event Ordering:** Events for a specific Todo UUID must be processed sequentially to prevent race conditions (e.g., processing a `TodoUpdated` event after a `TodoDeleted` event).
- **Idempotency:** Event consumers must be designed idempotently, ensuring that processing the same `TodoCompleted` event twice does not corrupt external state.
- **Failure Isolation:** If an external module fails to process a `TodoCreated` event, it MUST NOT cause the original Todo creation to roll back or fail. Event dispatch is asynchronous to domain logic.

## 6. Business Rules

- **Observation Only:** Consumed events are used to observe upstream changes. They NEVER grant the Todos module ownership of the observed entities.
- **No Canonical Modification via Events:** Published Todo events NEVER cause other modules (like Notes) to modify user-authored content.
- **Events Communicate State Changes:** An event represents a historical fact (e.g., "Todo X was completed"). It is not a command.

## 7. Acceptance Criteria

- When a Todo is marked complete, a `TodoCompleted` event is published to the event bus. Subscribing modules (like Search) update their index, but no Note or canonical entity is modified.
- If the Notes module publishes a `NoteDeleted` event, the Todos module intercepts it and flags any affected Todo references as "Dangling," without deleting the Todo itself or attempting to restore the Note.
- A failure in a downstream module attempting to process `TodoUpdated` does not prevent the user from successfully editing the Todo.

## 8. Cross References

- [02-TodoLifecycle.md](./02-TodoLifecycle.md)
- [04-TodoRelationships.md](./04-TodoRelationships.md)
