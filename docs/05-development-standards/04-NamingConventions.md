# 04 — Naming Conventions

> **Module:** Development Standards
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

The Naming Conventions document ensures a ubiquitous language across the codebase, making it easier to search, read, and reason about the system's architecture.

---

## 2. General Conventions

- **Clarity over Brevity:** Variable and class names should clearly express their intent. Avoid single-letter variables except in very short loops.
- **Ubiquitous Language:** Use terminology defined in the documentation (e.g., `Note`, `Workspace`, `ContextPackage`). Do not invent synonyms (e.g., do not use `Document` when referring to a `Note`).

---

## 3. Specific Conventions

- **Modules:** Named as plural nouns or broad concepts (e.g., `Notes`, `Workspace`, `Settings`).
- **Services:** Suffixed with `Service` and encapsulate domain logic (e.g., `NoteService`).
- **Repositories:** Suffixed with `Repository` and abstract data access (e.g., `NoteRepository`).
- **Events:** Named in the past tense, starting with the entity (e.g., `NoteCreated`, `SettingsUpdated`).
- **DTOs:** Data Transfer Objects used across module boundaries should be suffixed with `Dto` or `Request`/`Response` depending on the context (e.g., `NoteSummaryDto`).
- **Entities:** Named as singular nouns representing the domain model (e.g., `Note`, `Folder`).
- **Value Objects:** Named as descriptive nouns representing immutable attributes (e.g., `Coordinates`, `HexColor`).
- **Files and Directories:** Use a consistent case across the project (e.g., `kebab-case` for directories, `PascalCase` for class files, `camelCase` for utilities).
- **Commands:** Named as imperative verbs describing the action (e.g., `CreateNoteCommand`).
- **Queries:** Named as nouns or questions describing the requested data (e.g., `GetNoteByIdQuery`).
- **Interfaces:** Prefix with `I` (if standard for the chosen language ecosystem, e.g., `INoteRepository`) or use descriptive nouns/adjectives (e.g., `NoteRepository` for the interface, `SqliteNoteRepository` for implementation).

---

## 4. Business Rules

- **Consistency:** Once a convention is established for a specific layer or pattern, it must be used uniformly across all modules.

---

## 5. Acceptance Criteria

- Code reviews catch and reject poorly named variables or classes that violate these conventions or the project's ubiquitous language.

---

## 6. Cross References

- [02-CodingStandards.md](./02-CodingStandards.md)
