> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace, Notes (optional)
> **Document Owner:** Core Architecture Team

# Todos Module

---

## 1. Purpose

The Todos module provides action management capabilities within the Notebook ecosystem. It enables users to capture, organize, and track actionable items (Todos) independently from, but optionally linked to, the canonical knowledge base (Notes and Folders).

## 2. Scope

**This document covers:**
- Todo entity concepts and lifecycle.
- Organizational metadata (lists, priorities, status, due dates).
- Relationships between Todos and other Notebook entities.
- Event models and extension points for action management.

**This document does NOT cover:**
- Database schema or physical persistence layers.
- API endpoints or transport layers.
- Specific task scheduling algorithms or reminder delivery mechanisms.
- Notification UI implementation.
- Source code structures.

## 3. Responsibilities

- **Todo Lifecycle Management:** Governing the creation, modification, completion, archiving, and deletion of Todos.
- **Organization and Metadata:** Maintaining structured attributes (status, priority, due dates, lists) that enable grouping and filtering.
- **Relationship Management:** Managing optional, non-destructive references from Todos to other canonical entities (e.g., Notes).

## 4. Ownership

- **Ownership:** The Todos module completely owns Todo entities, Todo Lists, and Todo metadata.
- **Boundaries:** 
  - Todos are independent entities. They do NOT own Notes, Folders, or Attachments.
  - A Todo may reference a Note, but this relationship is strictly read-only from the Todo's perspective.
  - Todos NEVER automatically modify canonical Notebook entities.

## 5. Dependencies

- **Workspace Module:** Todos exist within a Workspace. The Workspace defines the logical boundary and access context.
- **Notes Module (Optional):** Todos may reference Notes to provide context for an action.

## 6. Consumed Interfaces

- Accepts user commands to create, update, complete, archive, or delete Todos.
- Accepts queries to filter, sort, and retrieve Todos based on metadata.

## 7. Published Events

- `TodoCreated`: Emitted when a new Todo is captured.
- `TodoUpdated`: Emitted when a Todo's content or metadata changes.
- `TodoCompleted`: Emitted when a Todo is marked as done.
- `TodoReopened`: Emitted when a completed Todo is reverted to an active state.
- `TodoArchived`: Emitted when a Todo is moved to the archive.
- `TodoDeleted`: Emitted when a Todo is permanently removed.

## 8. Consumed Events

- `NotePermanentDeleted`: Consumed to gracefully handle dangling references if a linked Note is removed.
- `WorkspaceDeleted`: Consumed to cascade deletion of all Todos within the workspace.

## 9. Extension Points

- **Due Date Reminders (Future):** Integration with a scheduling module to trigger local notifications.
- **AI Task Extraction (Future):** Permitting the AI Assistant to suggest new Todos based on Note content, always subject to explicit user acceptance.
- **Calendar Integrations (Future):** Syncing Todos with external calendar providers via plugins.

## 10. Settings

- Default Todo List for newly captured items.
- Default priority assignment.
- Archive policies (e.g., automatically archive completed Todos after N days).
- Sorting preferences (e.g., always group by due date).

## 11. Acceptance Criteria

- A user can create a Todo, assign it a due date, and mark it complete without any interaction with the Notes module.
- A user can link a Todo to an existing Note. Completing the Todo leaves the linked Note entirely unmodified.
- Deleting a Note that is referenced by a Todo leaves the Todo intact, simply removing the resolvable link.

## 12. Cross References

- [01-TodosOverview.md](./01-TodosOverview.md)
- [02-TodoLifecycle.md](./02-TodoLifecycle.md)
- [03-TodoOrganization.md](./03-TodoOrganization.md)
