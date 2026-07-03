# Todos Module

> **Document Type:** Module README
> **Module:** todos
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §12](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §3.7](../../02-database/04-Schema.md) · [../../02-database/11-EntityLifecycle.md §6](../../02-database/11-EntityLifecycle.md) · [../notes/README.md](../notes/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Todos module defines how task items are created, managed, completed, and organized within a Workspace. Todos are first-class entities in Notebook — they are not merely checklist items embedded in note content. They have their own lifecycle, their own table, and their own UI.

A Todo may optionally be linked to a note, providing context for why the task exists. If the associated note is deleted, the todo becomes standalone — it is never automatically deleted along with the note.

---

## Scope

**This module covers:**
- Creating todos (standalone or linked to a note)
- Editing todo title, due date, priority, and completion status
- Marking todos complete and incomplete
- Soft-deleting todos (moving to Trash)
- Restoring todos from Trash
- Permanently deleting todos
- The Workspace-level todo list view with filtering (by completion, by due date, by priority)
- The note-contextual todo list (todos linked to a specific note, displayed in the note panel)
- Note-link behavior: linking a todo to a note, unlinking, and behavior when the linked note is deleted

**This module does NOT cover:**
- Checklist items within note content (those are editor nodes managed by `editor/`)
- Notifications for approaching due dates (see `notifications/`)

---

## Responsibilities

This module is responsible for:

- Creating `todos` table rows with optional `note_id` foreign key
- Updating todo fields (title, completed, due_date, priority, note_id)
- Providing the Workspace todo list, with filtering and sorting
- Providing note-specific todo lists to the note panel
- Handling the `ON DELETE SET NULL` cascade: when a linked note is deleted, converting the todo to standalone without deleting it
- Managing soft-delete and restore of individual todos

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-TodoLifecycle.md` | Planned | Create, edit, complete, delete, restore workflows and state diagram |
| `02-TodoOwnership.md` | Planned | Standalone vs note-linked todos, link/unlink, note deletion behavior |
| `03-TodoListView.md` | Planned | Workspace todo list: filtering by status, due date, priority; sorting |
| `04-NoteTodoPanel.md` | Planned | Displaying note-specific todos within the note view |

---

## Key Business Rules (Summary)

- A todo with `note_id = NULL` is standalone. A todo with `note_id = <uuid>` is note-linked. Both are managed identically by the repository layer.
- When a linked note is permanently deleted, the todo's `note_id` is set to `NULL` by the `ON DELETE SET NULL` cascade — the todo is not deleted.
- Completing a todo sets `completed = 1` and preserves the record. It does not move the todo to Trash.
- Todos are soft-deleted explicitly by user action, not by note actions.
- Priority is optional. Todos without a priority are sorted below prioritized todos in the default view.
- Due dates are optional. Todos without a due date appear after due-dated todos in date-sorted views.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-TD-01 | Create todo items within a Workspace |
| FR-TD-02 | Title, completion status, creation timestamp |
| FR-TD-03 | Optional: due date, priority, description |
| FR-TD-04 | Optional note association |
| FR-TD-05 | Mark todos complete/incomplete |
| FR-TD-06 | Edit and delete todos |
| FR-TD-07 | Workspace-level todo view, filterable by completion |

---

## Future Considerations

- **Todo due date notifications:** Alerting the user when a todo's due date is approaching or past due. This integrates with the `notifications/` module.
- **Recurring todos:** Todos that automatically reset to incomplete on a schedule (daily, weekly, monthly).
- **Todo sub-tasks:** Hierarchical todos (a todo with child todos). This may require a schema change.
- **Todo boards (Kanban):** A board view for todos with configurable columns (e.g., To Do, In Progress, Done).
- **Todo export:** Exporting the Workspace todo list as Markdown task list or CSV.
