> **Document Type:** Module Specification
> **Status:** Frozen
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

`User` &rarr; `Create Todo` &rarr; `Validate` &rarr; `Organize` &rarr; `Optional Relationships` &rarr; `Publish Events` &rarr; `Search Index` &rarr; `Embeddings (Future)` &rarr; `Retrieval` &rarr; `AI Assistant (Optional)` &rarr; `User Decision`

- **Single Owner:** Each stage has a single owner. The Todos module owns creation, validation, and organization.
- **Immutable Ownership:** Ownership never transfers across boundaries.
- **Consumers:** Search, Retrieval, and AI consume Todo information without ever changing Todo ownership.

## 4. Module Interactions & Dependency Rules

### 4.1 Dependency Principles
- **Unidirectional Context:** Todos may reference Notes to provide context for a task. This relationship is strictly unidirectional. A Note never references a Todo structurally.
- **Event-Driven Observation:** Downstream modules (Search, Notifications) observe Todo changes via the Event Bus. The Todos module has no direct dependencies on these consumers.
- **Upstream Observation:** The Todos module observes canonical module events (e.g., `NoteDeleted`) solely to maintain referential hygiene, never to mutate upstream data.

### 4.2 Search Integration Philosophy
Search integrates with Todos via the event bus:

`Todo` &rarr; `Search Index` &rarr; `Search`

- **Clarification:** Search consumes Todo information (via events). Search indexes Todo data to make tasks discoverable. Search NEVER owns Todo entities. Search indexes remain strictly derived artifacts.

### 4.3 AI Integration Philosophy (Future)
Future AI integrations will rely on the retrieval pipeline:

`Todo` &rarr; `Retrieval` &rarr; `AI Assistant`

- **Clarification:** The AI Assistant consumes Todo information through Retrieval. AI may reference Todos as context. AI NEVER owns Todos. AI NEVER modifies Todos automatically. Users always remain in control of task modification.

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
