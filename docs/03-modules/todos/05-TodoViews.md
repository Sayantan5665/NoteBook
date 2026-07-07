> **Document Type:** Module Specification
> **Status:** Frozen
> **Version:** 1.0
> **Depends On:** Todos Module
> **Document Owner:** Core Architecture Team

# 05 — Todo Views

---

## 1. Purpose

This document defines how Todo entities are presented, grouped, and filtered. It establishes the "View" as a derived artifact that transforms raw Todo data into actionable intelligence without ever altering the underlying entities or their ownership boundaries.

## 2. View Concepts

A **View** is a dynamic, read-only representation of a subset of Todos. Views allow users to contextualize their workload (e.g., chronologically, by priority, or by project) without duplicating data or altering the canonical state of any task.

- **Derived Status:** Views are derived representations. They are assembled on the fly based on queries.
- **No Ownership:** Views never own Todo data. They simply display it.
- **Immutability of Ownership:** Changing a view, sorting a view, or filtering a view never changes Todo ownership or modifies Notebook entities.

## 3. Supported Views

### 3.1 List View
- The foundational view. Displays Todos in a flat, vertical list.
- Supports chronological sorting, priority sorting, or manual reordering (if supported by the underlying List metadata).

### 3.2 Priority View
- Groups Todos strictly by their priority dimension (e.g., High, Medium, Low).
- Useful for immediate triage regardless of the Todo's parent List.

### 3.3 Status View
- Groups Todos by their lifecycle state (`Active`, `Completed`, `Archived`).
- Serves as the primary mechanism for reviewing past accomplishments or recovering archived tasks.

## 4. Future Views

The architecture must support the future addition of complex views without requiring schema changes:

- **Board View:** A Kanban-style representation grouping tasks by custom statuses or lists.
- **Calendar View:** A chronological representation mapping Todos onto specific dates based on their Due Date metadata.
- **Timeline View:** A Gantt-style representation for long-running tasks or dependencies.
- **Custom / Saved Views:** User-defined filter and sort combinations persisted as named views.

## 5. View Operations

All views rely on three fundamental data operations applied to the Todo dataset:

### 5.1 Filtering
- Reduces the dataset based on boolean logic (e.g., `status = Active AND list = "Work"`).
- Filtering is purely a query operation. It does not delete hidden tasks.

### 5.2 Sorting
- Orders the filtered dataset.
- Can be applied by Due Date (Ascending/Descending), Priority, Creation Date, or Alphabetically.

### 5.3 Grouping
- Segments the filtered dataset into distinct visual buckets (e.g., grouping a flat list by Priority).

## 6. Business Rules

- **Views are Derived Artifacts:** A View does not exist as canonical data. It is a query result.
- **Data Integrity:** Manipulating a View (e.g., applying a filter) MUST NEVER mutate the underlying Todo entities.
- **Ownership Preservation:** Viewing Todos in different contexts (e.g., viewing all Todos that reference a specific Note) does not transfer ownership of the Todo to that context.

## 7. Performance Considerations

- Large datasets with thousands of completed or archived Todos must be filtered efficiently.
- Default views (e.g., "Active Tasks") should implicitly filter out `Completed` and `Archived` states to maintain optimal query performance and UI responsiveness.

## 8. Acceptance Criteria

- A user switches from a List View to a Priority View. The underlying Todos remain unchanged in the database, demonstrating the derived nature of Views.
- Applying a filter to hide `Completed` tasks successfully removes them from the UI without modifying their state or deleting them from the system.
- An architectural review confirms that the View layer only performs read operations against the Todo dataset, preserving data integrity.

## 9. Cross References

- [03-TodoOrganization.md](./03-TodoOrganization.md)
