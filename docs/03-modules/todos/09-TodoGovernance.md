> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Todos Module
> **Document Owner:** Core Architecture Team

# 09 — Todo Governance

---

## 1. Purpose

This document serves as the architectural constitution for the Todos module. It rigorously defines what the module owns, what it explicitly does not own, and the strict rules governing its interaction with the broader Notebook ecosystem.

## 2. Ownership Boundaries

### 2.1 The Todos Module Owns:
- **Todo Entities:** The fundamental data structures representing actionable tasks.
- **Todo Lifecycle:** The state machine managing Creation, Active, Completed, Archived, and Deleted states.
- **Todo Organization:** Lists, priorities, due dates, and status metadata.
- **Todo Relationships:** The pointers connecting Todos to other Notebook entities.
- **Todo State:** The definitive source of truth regarding whether a task is pending or done.

### 2.2 The Todos Module does NOT Own:
- **Notes:** The core knowledge artifacts.
- **Folders:** The hierarchical organization of Notes.
- **Tags:** The global taxonomy applied to Notes.
- **Attachments:** Binary files stored in the Workspace.
- **Search:** The Full-Text Search indexing and retrieval pipelines.
- **AI / Embeddings:** The contextual vectorization of Notebook content.
- **OCR:** Text extracted from images.

## 3. Canonical Todo Workflow

The following conceptual workflow illustrates the strict lifecycle of a Todo, demonstrating how it interacts with other modules without transferring ownership.

`User` &rarr; `Create Todo` &rarr; `Validate` &rarr; `Organize` &rarr; `Reference Notebook Entities (Optional)` &rarr; `Publish Events` &rarr; `Search Index Update` &rarr; `AI Consumption (Optional)`

- **Every stage has a single owner.** The Todos module owns creation, validation, and organization.
- **Ownership never changes.** A Todo remains a Todo even if it is indexed by Search.
- **Search and AI consume Todo information but never own Todo entities.** They are downstream consumers of the `Publish Events` phase.

## 4. Module Interactions & Dependency Rules

- **Unidirectional Context:** Todos may reference Notes to provide context for a task. This relationship is strictly unidirectional. A Note never references a Todo structurally.
- **Event-Driven Observation:** Downstream modules (Search, Notifications) observe Todo changes via the Event Bus. The Todos module has no direct dependencies on these consumers.
- **Upstream Observation:** The Todos module observes canonical module events (e.g., `NoteDeleted`) solely to maintain referential hygiene, never to mutate upstream data.

## 5. Consistency Rules

- **First-Class Entities:** Todos are independent, first-class Notebook entities. They are not subservient to Notes.
- **References are Optional:** A Todo does not require a relationship to exist.
- **Data Safety:** The Todos module is architecturally prohibited from executing write operations against the Notes, Folders, or Tags schemas.

## 6. Business Rules

- **Todos are first-class Notebook entities.**
- **References are optional.**
- **Ownership never transfers.**
- **Events communicate state changes.**
- **Extensions consume Todo capabilities without changing ownership.**

## 7. Acceptance Criteria

- An architectural audit confirms that the Todos module possesses zero write-access to the canonical tables owned by the Notes, Folders, Attachments, or Tags modules.
- A newly created Todo successfully flows through the Canonical Todo Workflow, updating the Search index via events without the Todos module directly invoking the Search API.
- A user successfully maintains a complex task list entirely independent of their Notes, proving the first-class nature of the Todo entity.

## 8. Cross References

- [01-TodosOverview.md](./01-TodosOverview.md)
- [04-TodoRelationships.md](./04-TodoRelationships.md)
- [07-TodoEvents.md](./07-TodoEvents.md)
