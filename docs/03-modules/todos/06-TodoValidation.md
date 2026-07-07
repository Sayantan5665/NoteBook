> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Todos Module
> **Document Owner:** Core Architecture Team

# 06 — Todo Validation

---

## 1. Purpose

This document defines the validation boundaries for the Todos module. It establishes the rules that ensure the structural integrity of Todo entities, the safety of state transitions, and the hygienic handling of external references, without ever infringing on the sovereignty of other Notebook modules.

## 2. Validation Philosophy

Validation within the Todos module serves a single defensive purpose: **preserving Todo integrity.** 

- Validation logic must ensure that a Todo cannot enter an impossible state.
- Validation must protect the module from malformed metadata or impossible dates.
- **Rule:** Validation NEVER modifies referenced Notebook entities. It only validates the Todo's internal structure and its pointers.

## 3. Validation Rules

### 3.1 Creation Validation
- **Text Content:** A Todo MUST have a text description. Empty or purely whitespace Todos must be rejected.
- **Length Constraints:** The text description must fall within reasonable system limits to prevent UI breakage or database overflow.
- **Default State:** A newly created Todo MUST initialize in the `Active` state.

### 3.2 Update Validation
- **Immutability of ID:** A Todo's unique identifier (UUID) cannot be modified after creation.
- **Metadata Boundaries:** Priority values must conform to the allowed enumerable set. List assignments must reference a valid, existing Todo List.

### 3.3 Relationship Validation
- **Valid References:** When a Todo is linked to an external entity (e.g., a Note), the provided UUID must be syntactically valid.
- **Dangling Link Handling:** If a relationship points to a UUID that does not exist (or no longer exists), the Todo module must NOT throw a fatal error. The relationship is simply marked or treated as a dangling/unresolvable link.
- **Rule:** Invalid relationships must be handled gracefully. They must not prevent the Todo from being read, edited, or completed.

### 3.4 State & Completion Validation
- **Valid Transitions:** State transitions must follow the paths defined in `02-TodoLifecycle.md` (e.g., a `Deleted` Todo cannot be transitioned back to `Active`).
- **Completion Timestamps:** When a Todo transitions to `Completed`, a completion timestamp MUST be recorded. If a Todo is transitioned back to `Active` (Reopened), the completion timestamp MUST be cleared.

## 4. Error Handling

- **Validation Failures:** If an operation fails validation (e.g., attempting to create a Todo with no text), the operation is aborted, and a descriptive error is returned to the consumer. The database remains unchanged.
- **Isolation:** A validation failure on one Todo MUST NOT affect the processing or state of other Todos.

## 5. Edge Cases

- **Dates in the Past:** Setting a Due Date in the past is permitted (tasks can be created already overdue), but the system should flag it appropriately in the UI.
- **Concurrent Updates:** If two clients attempt conflicting updates to a Todo's state (e.g., one completes it, one archives it), the system must utilize standard concurrency controls (e.g., last-write-wins or optimistic locking) to ensure a deterministic final state.

## 6. Business Rules

- **Data Integrity Preservation:** Validation guarantees that the Todos database contains only structurally sound entities.
- **No External Mutations:** Validation logic inspecting a relationship to a Note NEVER attempts to repair, touch, or validate the Note itself.
- **Graceful Degradation:** The inability to resolve a relationship must never corrupt the Todo itself.

## 7. Acceptance Criteria

- Attempting to create a Todo with an empty text string is rejected by the module, preserving database cleanliness.
- Attempting to link a Todo to a non-existent Note UUID succeeds at the Todo database level (the pointer is saved), but the UI gracefully displays "Link Unavailable" without crashing.
- Marking a Todo as `Completed` successfully assigns a completion timestamp, and subsequently reopening the Todo successfully clears that timestamp.
- An architectural review confirms that the Todo validation layer has zero write dependencies on any external canonical modules.

## 8. Cross References

- [02-TodoLifecycle.md](./02-TodoLifecycle.md)
- [04-TodoRelationships.md](./04-TodoRelationships.md)
