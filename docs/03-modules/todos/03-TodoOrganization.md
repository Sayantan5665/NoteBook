> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Todos Module
> **Document Owner:** Core Architecture Team

# 03 — Todo Organization

---

## 1. Purpose

This document defines the organizational metadata and capabilities of the Todos module. It outlines how actionable tasks are structured, grouped, and filtered to provide users with an effective task management system without coupling task metadata to knowledge metadata.

## 2. Organization Philosophy

Action management requires distinct organizational paradigms from knowledge management. While Notes are organized via Folders and Wiki Links to create a knowledge graph, Todos are organized via Lists, Priorities, and Due Dates to create execution queues. 

**Rule:** Organization metadata never changes Notebook ownership. Managing Todo metadata does not alter the structural integrity of the canonical knowledge base.

## 3. Metadata Dimensions

### 3.1 Lists
- **Concept:** Logical containers for Todos, representing projects, contexts, or areas of responsibility (e.g., "Work," "Personal," "Groceries").
- **Behavior:** A Todo belongs to one List. Lists provide the primary bucketing mechanism for tasks.
- **Independence:** Todo Lists are distinct from Note Folders. A user may have a "Work" Folder for Notes and a "Work" List for Todos, but they are conceptually separate entities managed by different modules.

### 3.2 Priorities
- **Concept:** An indicator of importance or urgency assigned to a Todo.
- **Behavior:** Priorities allow users to surface critical tasks within a List or across all active tasks.
- **Values:** Typically modeled as an enumerable scale (e.g., Low, Medium, High, Urgent).

### 3.3 Status
- **Concept:** The execution state of the Todo (as defined in `02-TodoLifecycle.md`).
- **Behavior:** Status drives the primary filtering of execution queues (e.g., hiding `Completed` or `Archived` tasks from active views).

### 3.4 Due Dates
- **Concept:** A temporal constraint applied to a Todo.
- **Behavior:** Due dates allow tasks to be organized chronologically, enabling views like "Today," "Tomorrow," or "Overdue."

## 4. Operational Capabilities

The organization metadata enables the following operational capabilities, which are executed purely within the Todos domain:

### 4.1 Grouping
- Todos can be grouped by List, Priority, or Due Date to provide structured views.
- **Example:** A view showing all `Active` tasks grouped by `List`.

### 4.2 Filtering
- Queries can combine metadata dimensions to isolate specific tasks.
- **Example:** Filtering for `Status = Active` AND `Due Date <= Today` AND `Priority = High`.

### 4.3 Sorting
- Todos within a filtered or grouped view can be ordered chronologically (by due date, creation date) or categorically (by priority).

## 5. Business Rules

- **Metadata Locality:** Lists, Priorities, and Due Dates are properties of the Todo domain. They do not propagate to referenced Notes.
- **Non-Invasive Organization:** Assigning a Todo to a "High Priority" List does not make the referenced Note "High Priority." The organizational metadata applies strictly to the action, not the knowledge.
- **Optionality:** All organizational metadata (except perhaps a default List assignment) is optional. A Todo can exist simply as a string of text.

## 6. Future Enhancements

- **Smart Lists:** Dynamic lists populated by saved filter queries (e.g., a "Critical Today" smart list).
- **Sub-tasks:** Hierarchical organization within a single Todo (parent/child task relationships).
- **Context Tags:** Action-specific tags (e.g., `@phone`, `@office`) independent from the global Note Tags module.

## 7. Acceptance Criteria

- A user can create a "Work" Todo List, assign three Todos to it, and filter their view to see only "Work" tasks, all without creating any Folders in the Notes module.
- Setting a due date on a Todo that references a specific Note applies chronological organization to the Todo only; the referenced Note experiences no metadata changes.
- Sorting a list of Todos by priority correctly orders them according to the internal Todo module logic, completely independent of how Notes are sorted.
