> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Todos Module
> **Document Owner:** Core Architecture Team

# 01 — Todos Overview

---

## 1. Purpose

This document establishes the conceptual foundation of the Todos module. It defines what a Todo is, its philosophical place within the Notebook ecosystem, and the strict ownership boundaries that distinguish actionable tasks from canonical knowledge.

## 2. Todo Philosophy

### 2.1 First-Class Entities
Todos are **first-class Notebook entities**. They exist independently in their own right, parallel to Notes and Folders. They do not need to be embedded within a Note to exist, ensuring that action management and knowledge management remain functionally distinct, even when conceptually linked.

### 2.2 Action vs. Knowledge
- **Notes** capture knowledge, reference material, and long-form thought.
- **Todos** capture actionable intent, deadlines, and state transitions (e.g., pending vs. done).
- Mixing the two by forcing Todos to exist *only* within Notes leads to brittle architectures. By separating them, Notebook allows users to manage actions without cluttering knowledge.

## 3. Ownership

- **The Todos module** strictly owns the Todo entity, its text content, its state (completed, pending, archived), and its organizational metadata (due dates, priorities, lists).
- **Rule:** Todos do NOT own Notes.
- **Rule:** Todos NEVER replace Notes. A Todo may represent a task to *write* a Note, but the Todo itself is not the Note.

## 4. Responsibilities

- Providing a robust schema for capturing actionable tasks.
- Maintaining the referential integrity of Todo relationships.
- Ensuring that actions taken on a Todo do not cause unintended side effects in other domains.

## 5. Todo Concepts

- **Todo:** The core atomic entity representing an actionable item. It contains a description (the task text) and various metadata.
- **Todo List:** A logical grouping container for Todos, allowing users to categorize tasks by project, area, or context.
- **State:** The completion status of a Todo (e.g., Active, Completed).
- **Reference:** An optional directional link pointing from a Todo to another Notebook entity (e.g., a Note) to provide context.

## 6. Relationships

### 6.1 Optional Linkage
- Todos may optionally reference other entities, most commonly Notes.
- For example, a Todo named "Review project proposal" may contain a reference to the "Project Proposal" Note.
- **Rule:** These relationships are strictly optional. A Todo functions perfectly without any references.

### 6.2 Non-Destructive References
- A relationship from a Todo to a Note is a read-only pointer.
- Modifying the Todo (e.g., marking it complete) does not modify the Note.
- Modifying the Note does not modify the Todo.

## 7. Business Rules

- **Independence:** Todos are independent entities. Notes and Todos remain separate.
- **Read-Only Context:** Todos may reference Notes for context, but this reference grants no mutation rights over the Note.
- **No Automatic Mutations:** Todos never modify Notebook entities automatically. The completion, archiving, or deletion of a Todo affects only the Todo itself.

## 8. Acceptance Criteria

- A user creates a standalone Todo "Buy milk" which exists securely in the Workspace without being attached to any Note.
- A user creates a Todo "Finish Q3 Report" and links it to the Note "Q3 Draft". The Todo and Note remain separate database entities connected by a directional relationship.
- An architectural audit confirms that the Todos module does not possess write access to the tables managed by the Notes module.
