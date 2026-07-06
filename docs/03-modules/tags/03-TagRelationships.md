> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Tags Module Overview
> **Document Owner:** Core Architecture Team

# 03 — Tag Relationships

---

## 1. Purpose

This document defines the relational mapping between Tags and Notes. It outlines the cardinalities and future structural enhancements of the tag network.

## 2. Relational Architecture

### 2.1 Tag-to-Note Relationships
- **Many-to-Many:** The relationship between Notes and Tags is conceptually a many-to-many join table or graph edges.
- **Multiple Tags:** A single Note may possess multiple Tags (e.g., `#urgent`, `#work`, `#project-alpha`).
- **Shared Tags:** A single Tag (e.g., `#urgent`) may reference multiple Notes.

### 2.2 Independence from Hierarchy
- Relationships remain entirely independent from the Folder hierarchy. A Tag can group Notes residing in completely different root Folders.

### 2.3 Relationship Philosophy
- Tags describe conceptual classification only.
- Tags do **NOT** imply:
  - Folder hierarchy
  - Parent-child ownership
  - Knowledge graph relationships (managed by Wiki Links)
  - Access permissions
  - Storage location
  - Workflow dependencies
- Classification is mathematically and logically independent of Folder and Wiki Link relationships.

### 2.4 Tag Ordering Philosophy
- Tags have no intrinsic architectural ordering.
- The presentation order of Tags belongs entirely to user preferences and view configuration (e.g., sort by name, sort by count, manual drag-and-drop).
- Search results may present Tags differently based on context.
- The Tags module owns the relationship mappings, not the UI presentation logic.

## 3. Future Relational Topologies

### 3.1 Nested Tags (Hierarchical Tags)
- Creating parent-child relationships between Tags themselves (e.g., `#programming/javascript`).
- Conceptually, searching for the parent `#programming` might automatically include all Notes tagged with the child `#javascript`.

### 3.2 Tag Groups
- Organizing distinct Tags into logical buckets in the UI (e.g., a "Status" group containing `#todo`, `#in-progress`, `#done`), allowing for exclusive toggling (a Note can only have one Status tag at a time).

## 4. Business Rules

- **No Limit:** There is conceptually no architectural limit to the number of Tags a Note can have, or the number of Notes a Tag can reference.
- **Uniqueness:** A Note can only reference a specific Tag UUID once. Duplicate assignments of the same Tag to the same Note are mathematically collapsed into a single relationship.

## 5. Acceptance Criteria

- A user can assign 10 distinct Tags to a single Note.
- A user can click a single Tag in the sidebar and view a list of 1,000 distinct Notes that reference it, regardless of which Folders those Notes live in.
