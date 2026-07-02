# 02 — Goals

> **Document Type:** Product Goals
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-Vision.md](./01-Vision.md) · [03-Scope.md](./03-Scope.md) · [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) · [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md) · [06-Roadmap.md](./06-Roadmap.md) · [07-Glossary.md](./07-Glossary.md)

---

## 1. Purpose

This document translates the strategic vision defined in [01-Vision.md](./01-Vision.md) into concrete, measurable product goals. Goals stated here drive prioritization decisions in [06-Roadmap.md](./06-Roadmap.md) and directly inform acceptance criteria in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) and [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md).

---

## 2. RFC 2119 Key Word Reference

This document uses RFC 2119 terminology throughout. For the project-wide definition see [07-Glossary.md §2](./07-Glossary.md).

| Keyword | Meaning |
|---|---|
| **shall** | Absolute requirement. |
| **shall not** | Absolute prohibition. |
| **should** | Strong recommendation; deviation requires documented justification. |
| **may** | Permitted but not required. |

---

## 3. Goal Catalogue

### G-1 — User Empowerment

**G-1.1** The application **shall** enable users to create, edit, organize, and retrieve personal knowledge entirely on their local machine without requiring any external service.

**G-1.2** The application **shall** enable users to link notes using wiki-style internal links and **shall** automatically maintain bidirectional backlinks without user intervention.

**G-1.3** The application **shall** enable users to attach files to notes, extract text from those files via OCR, and have that text indexed for search and AI retrieval.

**G-1.4** The application **shall** enable users to query their knowledge base using natural language through a local AI system grounded exclusively in their own notes and attachments.

**G-1.5** The application **shall** enable users to manage tasks and todos within their Workspace without requiring a separate application.

**G-1.6** The application **shall** enable users to recover previous versions of any note through an integrated, automatic version history.

**G-1.7** The application **shall** enable users to organize content with user-defined tags and retrieve content by tag.

---

### G-2 — Data Ownership and Privacy

**G-2.1** The application **shall** store all user data — notes, attachments, embeddings, AI chat history, todos, tags, settings, and version history — exclusively on the user's local filesystem or local embedded database.

**G-2.2** The application **shall not** transmit any user data to any third-party server or service without an explicit, per-action, user-initiated request.

**G-2.3** The application **shall not** collect, aggregate, or report telemetry or behavioral data by default.

**G-2.4** The application **should** provide a clear, auditable log of any data leaving the local machine (e.g., Google Drive sync activity).

**G-2.5** All user data **should** be recoverable by a technically capable user using standard tools (e.g., SQLite CLI, filesystem access) independently of the Notebook application.

---

### G-3 — Offline Reliability

**G-3.1** Every core feature of the application **shall** be fully operational without an active internet connection. The definitive list of core features is in [03-Scope.md §3](./03-Scope.md).

**G-3.2** The application **shall** gracefully degrade optional features (e.g., Google Drive sync) when internet connectivity is unavailable, without impacting the availability of core features.

**G-3.3** The application **shall not** require internet connectivity at startup, during normal operation, or for any data-persistence operation.

---

### G-4 — Performance

**G-4.1** The application **should** reach an interactive state within 3 seconds of launch on a modern mid-range consumer laptop.

**G-4.2** Full-text search **should** return results within 300 ms for Workspaces containing up to 10,000 notes.

**G-4.3** Semantic search **should** return results within 1 second for Workspaces containing up to 10,000 embedded documents.

**G-4.4** The rich text editor **should** exhibit no perceptible input lag for notes up to 50,000 words.

**G-4.5** AI chat responses **should** begin streaming within 2 seconds of query submission on supported hardware with a typical Ollama model.

**G-4.6** The application **should** remain stable and performant with a Workspace containing up to 50,000 notes and 10 GB of attachments.

---

### G-5 — Accessibility and Usability

**G-5.1** The application **should** support full keyboard navigation for all primary workflows.

**G-5.2** The application **should** respect the system-level light/dark mode preference and **may** provide additional user-selectable themes.

**G-5.3** The application **should** surface clear, actionable error messages with sufficient context for users to self-resolve common failures.

---

### G-6 — Portability and Interoperability

**G-6.1** The application **shall** support export of notes and Workspaces in open, non-proprietary formats (at minimum: Markdown, plain text, JSON).

**G-6.2** The application **shall** support import from common note-taking formats to reduce migration friction.

**G-6.3** The application **shall** support optional, user-initiated, bidirectional synchronization of Workspace data to a user-owned Google Drive account.

**G-6.4** All data stored by the application **should** be accessible and recoverable without the Notebook application being installed.

---

### G-7 — Extensibility

**G-7.1** The application **shall** provide a stable plugin interface enabling third-party developers to extend functionality without modifying core application code.

**G-7.2** The plugin interface **shall** support extensibility for, at minimum: AI providers, sync providers, OCR providers, importers, exporters, editor extensions, and themes.

**G-7.3** The application **should** ship with a documented Plugin SDK. Refer to `docs/sdk/` for the specification.

---

### G-8 — Zero Mandatory Cost

**G-8.1** Every feature in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) **shall** be achievable without any subscription, paid API key, or external paid service.

**G-8.2** Optional integration with paid services **may** be supported via the plugin system but **shall not** be required for any core functionality.

---

## 4. Goal-to-Feature Traceability

| Goal | Primary Features |
|---|---|
| G-1.1 | Workspace, Folders, Notes, Rich Text Editor |
| G-1.2 | Wiki Links, Automatic Backlinks |
| G-1.3 | Attachments, OCR |
| G-1.4 | Local AI (RAG), Semantic Search, AI Chats |
| G-1.5 | Todo Management |
| G-1.6 | Version History |
| G-1.7 | Tags |
| G-2.x | All data storage; no backend; no telemetry |
| G-3.x | Offline-first architecture |
| G-4.x | FTS5, sqlite-vec, Tiptap performance |
| G-5.x | UI/UX design standards |
| G-6.x | Import, Export, Google Drive Sync |
| G-7.x | Plugin System |
| G-8.x | Local AI (Ollama), no subscription gates |

---

## 5. Success Criteria

The goals in this document are considered met when:

1. All functional requirements in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) pass their defined acceptance criteria.
2. All non-functional targets in [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md) are measurably achieved under benchmark conditions.
3. A complete end-to-end user journey — create Workspace → write notes → attach files → run OCR → search → ask AI → sync to Google Drive → export — can be completed with no internet connection for all steps except the sync step.
4. All user data is recoverable from the local SQLite database independently of the application.

---

## 6. Out-of-Scope Goals

The following are explicitly not goals of this project. See [03-Scope.md §5](./03-Scope.md) for the complete out-of-scope statement.

- Real-time collaborative editing
- Graph or canvas visualization of note relationships
- Note templates
- General-purpose AI chat (not grounded in user content)
- Any developer-owned or centralized backend

---

## 7. Assumptions

1. Users accept that AI response quality is dependent on local hardware and the Ollama model they configure.
2. Users are responsible for managing their own Google Drive quota when sync is enabled.
3. Performance goals in G-4 are defined against a mid-range consumer laptop and are targets, not contractual guarantees.

---

## 8. Future Considerations

- Quantitative usability benchmarks from user research (task completion time, error rate).
- WCAG 2.1 AA accessibility conformance targets.
- Expanded performance goals as Workspace scale targets increase.
- Goals specific to a potential mobile companion application.
