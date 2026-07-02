# 14 — Architecture Decisions

> **Document Type:** Architecture Decision Records (ADR)
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> All documents in `docs/01-architecture/`

---

## 1. Purpose

This document records the key architectural decisions made for Notebook, the reasoning behind each decision, the alternatives considered, and the known trade-offs. These records ensure that future contributors understand why the architecture is as it is and can make informed decisions about evolution.

Each entry follows the format: **Decision → Context → Reasoning → Alternatives → Trade-offs → Future**.

---

## ADR-001 — Electron as the Desktop Framework

**Decision:** Use Electron to build the desktop application.

**Context:** Notebook requires cross-platform desktop deployment (Windows, macOS, Linux) with full local filesystem access, native OS integration (file dialogs, system tray, credential store), and the ability to run a Node.js application layer on the user's machine.

**Reasoning:**
- Electron provides a mature, well-supported cross-platform desktop framework.
- The renderer process (Chromium) enables use of the Angular frontend without platform-specific UI code.
- The main process (Node.js) provides full filesystem, OS, and native module access for the application and infrastructure layers.
- Electron's contextIsolation and sandbox model allows security to be enforced at the process boundary.
- Large ecosystem: Electron Forge for packaging, established signing workflows, active community.

**Alternatives Considered:**
- **Tauri:** Smaller binary, Rust backend. Rejected because: the application layer is TypeScript; requiring Rust for infrastructure would add significant complexity and a second language barrier. Tauri's Node.js sidecar support is less mature.
- **NW.js:** Less security isolation than Electron. Rejected.
- **Native per-platform (Swift/WinUI/GTK):** Requires three separate codebases. Rejected as unsustainable for a small team.

**Trade-offs:**
- Electron apps have larger binary size and higher memory usage than native apps.
- Mitigation: Acceptable for a desktop knowledge management tool; users expect some overhead.

**Future:** Monitor Tauri's TypeScript/Node.js support maturity. If it reaches parity with Electron for this use case, migration is feasible due to the Clean Architecture separation.

---

## ADR-002 — Angular as the Frontend Framework

**Decision:** Use Angular as the UI framework.

**Context:** The renderer process needs a mature, opinionated UI framework with strong TypeScript support, a built-in DI system, and component-level routing.

**Reasoning:**
- Angular's built-in dependency injection aligns with the application's DI-first design.
- Strong TypeScript support and strict mode compile-time safety.
- The Angular component model (with Signals) provides sufficient reactivity without a separate state management library.
- The Angular module system and lazy loading support the feature-modular architecture.
- Angular's RxJS integration is available for stream-based concerns (IPC event streams).

**Alternatives Considered:**
- **React:** Less opinionated; would require additional library choices (state management, DI, routing). More ecosystem churn.
- **Vue:** Strong, but smaller enterprise ecosystem. Less mature DI story.
- **Svelte/SvelteKit:** Excellent performance; not a desktop-application-oriented framework; smaller talent pool.

**Trade-offs:**
- Angular has a steeper learning curve and more boilerplate than React or Vue.
- Angular's compiler and zone.js add build complexity.
- Mitigation: Standalone components and Signals reduce boilerplate significantly in Angular 17+.

**Future:** Angular's standalone component model and Signal-based reactivity continue to evolve. The architecture is well-positioned to benefit from future Angular improvements.

---

## ADR-003 — SQLite as the Primary Database (Per Workspace)

**Decision:** Use SQLite, one database file per Workspace, as the primary data store.

**Context:** All user data must be stored locally. The database must be embeddable (no separate server process), portable (a file the user can copy), and capable of supporting FTS and vector search.

**Reasoning:**
- SQLite is the most widely deployed embedded database. It is serverless, zero-config, and produces a single portable file.
- SQLite FTS5 extension provides full-text search with no additional infrastructure.
- sqlite-vec extension provides vector storage and nearest-neighbor search, co-located with relational data.
- A per-Workspace database file provides natural data isolation: deleting a Workspace means deleting a file.
- The SQLite file format is open, well-documented, and readable by standard tools — supporting the data portability principle.
- WAL mode provides crash safety and improved concurrency.

**Alternatives Considered:**
- **PostgreSQL (local):** Requires a running server process; overkill for a single-user local app.
- **PouchDB / LevelDB:** Better for sync-heavy architectures; less suited for complex relational queries.
- **LMDB:** High performance; limited ecosystem; no built-in FTS or vector search.
- **Single global database (all Workspaces in one file):** Rejected because it complicates Workspace-level export, backup, and deletion.

**Trade-offs:**
- SQLite has limited concurrent write support. Acceptable because Notebook is single-user and single-process.
- Very large databases (>10 GB) can have performance implications. Mitigated by attachment files living on the filesystem (only metadata in the database).
- WAL mode must be explicitly enabled and managed.

**Future:** If the application ever needs multi-user or networked features, the Repository pattern allows the SQLite implementations to be replaced with a different backend without touching use cases.

---

## ADR-004 — Prisma as the ORM

**Decision:** Use Prisma to manage the SQLite database schema, migrations, and typed queries.

**Context:** Database access needs to be type-safe, migration-managed, and abstracted behind the repository pattern.

**Reasoning:**
- Prisma provides a strongly-typed query builder generated from the schema, eliminating runtime SQL type errors.
- Prisma Migrate provides a declarative, version-controlled migration system.
- Prisma's schema file is human-readable and serves as documentation of the database structure.
- Prisma supports SQLite.

**Alternatives Considered:**
- **Drizzle ORM:** Lighter weight; strong TypeScript support; less mature migration tooling at the time of evaluation.
- **Knex.js:** Query builder, not a full ORM; requires manual type definitions.
- **Raw SQL with `better-sqlite3`:** Maximum control; no migration management; more boilerplate.
- **TypeORM:** Decorator-heavy; less idiomatic TypeScript; known performance issues with complex queries.

**Trade-offs:**
- Prisma generates a client for each schema; schema changes require regeneration (`prisma generate`).
- Prisma does not natively support FTS5 or sqlite-vec queries; these use `$queryRaw`. This is acceptable and isolated to two repository implementations.
- Prisma's migration system assumes a known schema at migration time; dynamic schema changes (future plugin-provided tables) would require a different migration strategy.

**Future:** If Drizzle ORM matures significantly, it is a viable alternative with less overhead. The Repository pattern ensures a migration is a change only to infrastructure implementations.

---

## ADR-005 — Clean Architecture with Repository Pattern

**Decision:** Apply Clean Architecture with a strict four-layer model and the Repository Pattern for all data access.

**Context:** The application must be testable without infrastructure, extensible via plugins, and maintainable over a long product lifetime.

**Reasoning:**
- Testability: Use cases can be tested with in-memory repository mocks without a database.
- Substitutability: The plugin system requires that AI, OCR, and sync subsystems be replaceable at runtime.
- Longevity: A PKM tool accumulates years of user data. Architectural debt that prevents evolution is high-risk.
- The four-layer model (Presentation → Application → Domain → Infrastructure) with the Dependency Rule eliminates all coupling between business logic and infrastructure.

**Alternatives Considered:**
- **Layered architecture (without strict dependency rule):** Simpler; easier to bypass. Rejected because it allows infrastructure to bleed into business logic, making testing and substitution difficult.
- **Hexagonal architecture:** Equivalent in principle; the naming convention is different. Clean Architecture terminology was chosen for its widespread recognition.
- **Service-oriented (flat services):** Common in Angular apps; produces tightly coupled, hard-to-test code. Rejected.

**Trade-offs:**
- More files, more indirection, more ceremony than a flat service approach.
- New developers require orientation to the layer model.
- Mitigation: The monorepo package structure enforces the layers mechanically; ESLint boundary rules catch violations at compile time.

---

## ADR-006 — Ollama as the Default Local AI Provider

**Decision:** Use Ollama as the default AI inference provider for chat and embeddings.

**Context:** AI features must work entirely offline. The AI provider must be local, model-agnostic, and free to use.

**Reasoning:**
- Ollama is the leading local LLM runtime; it supports a wide range of models (Llama, Mistral, Gemma, Phi, etc.).
- Ollama provides a local HTTP API (`localhost:11434`) that is easy to consume from Node.js.
- Ollama supports both chat completion and embedding generation, covering both AI use cases.
- Ollama is free and open-source.
- Ollama is model-agnostic: users choose their preferred model based on hardware capability.
- The provider abstraction means Ollama can be replaced by a plugin without changing any use case.

**Alternatives Considered:**
- **llama.cpp (direct):** Maximum control; more complex integration; no unified API. Available as a plugin option.
- **LM Studio:** Good UI; less suitable as a programmatic backend.
- **OpenAI API (cloud):** Rejected as default — violates local-first and privacy-first principles. Available as a plugin option.
- **Bundled ONNX/WASM model:** No external process dependency; very limited model selection; performance constraints. Potential future option for a fallback "no-Ollama" mode.

**Trade-offs:**
- Ollama is a separately installed application — users must install and run it independently. This adds a setup step.
- AI feature quality and speed depend heavily on the user's hardware and chosen model.
- Ollama must be running for AI features to work; the application degrades gracefully when it is not.

---

## ADR-007 — Angular Signals for State Management (No NgRx)

**Decision:** Use Angular Signals and signal-based services as the state management approach. Do not use NgRx, Akita, or any global state store library.

**Context:** The renderer UI needs reactive state management. The application is single-user with no concurrent sessions.

**Reasoning:**
- Notebook is a single-user, single-window desktop application. The complexity that NgRx is designed to manage (large teams, complex async flows, time-travel debugging, state serialization) is not present.
- Angular Signals (stable in Angular 17+) provide fine-grained reactivity with minimal boilerplate.
- Signal-based services provide shared state without a global store: each feature gets a service with Signals that are injected where needed.
- RxJS is used for inherently stream-based concerns (IPC push events) where Signals would be less ergonomic.

**Alternatives Considered:**
- **NgRx:** Full Redux-pattern state management. Rejected due to significant overhead (actions, reducers, effects, selectors) that is not justified for a single-user local app.
- **NgRx SignalStore:** Lighter than full NgRx; possible future consideration if Signal-based service pattern proves insufficient.
- **BehaviorSubject stores:** Familiar RxJS pattern; works but Signals are preferred for derived state and template binding.

**Trade-offs:**
- Without a global store, debugging complex state interactions requires understanding the signal dependency graph rather than inspecting a Redux DevTools timeline.
- Feature services with Signals are simpler but require discipline to avoid proliferating too many independent state containers.

---

## ADR-008 — Manual Composition Root (No IoC Container Library)

**Decision:** Use a manually-written composition root in the Electron main process rather than a third-party IoC container library.

**Context:** The main process needs dependency injection for constructing use cases and their dependencies.

**Reasoning:**
- The application has a well-defined, relatively stable set of dependencies. A manual composition root is readable, debuggable, and transparent.
- Third-party IoC containers (tsyringe, InversifyJS, awilix) add runtime overhead, magic decorators, and learning curve for no material benefit in this context.
- The two-scope model (Application lifetime vs. Workspace lifetime) is straightforward to express manually.

**Alternatives Considered:**
- **tsyringe:** Lightweight; decorator-based. Potential future option if manual composition becomes unwieldy.
- **InversifyJS:** Well-established; more complex than needed. Rejected.
- **awilix:** Functional style; good for large applications. Overkill for this use case.

**Trade-offs:**
- The manual composition root grows as the application grows. Mitigated by splitting into sub-factories per domain area.
- No automatic circular dependency detection (provided by some IoC containers). Mitigated by ESLint import rules that prevent circular imports.

---

## ADR-009 — In-Process Plugin Execution (Main Process)

**Decision:** Plugins execute in the Electron main process, within the declared-permission model of the `PluginHostApi`.

**Context:** Plugins need access to application capabilities. Process-level isolation is the gold standard but adds complexity.

**Reasoning:**
- In-process execution is the simplest implementation that allows plugins to call application APIs synchronously.
- The `PluginHostApi` provides capability-based access control that prevents plugins from accessing internal use cases or repositories directly.
- Plugin errors are caught and isolated by the `PluginRegistryService`.
- This is consistent with how Electron itself handles extensions in many applications.

**Alternatives Considered:**
- **Utility process (worker thread):** Stronger isolation; message-passing API; higher implementation complexity. Planned for a future release.
- **Separate renderer window (sandbox):** Only useful for UI plugins. Not sufficient for AI/OCR/sync plugins.

**Trade-offs:**
- A malicious or buggy plugin could theoretically interfere with the main process if it bypasses the Host API restrictions (e.g., via prototype pollution). Mitigated in the short term by requiring user confirmation at install time and by restricting file access paths.

**Future:** Migrate plugins to Electron's `utilityProcess` API for OS-level isolation. The `PluginHostApi` IPC surface is designed to be message-passing-compatible, making this migration feasible.

---

## ADR-010 — Google Drive as the Only Built-In Sync Provider

**Decision:** Ship with Google Drive as the only built-in sync provider. Additional providers are available via the plugin system.

**Context:** Workspace synchronization across devices requires a storage backend. Multiple built-in providers would significantly increase maintenance burden.

**Reasoning:**
- Google Drive has a large user base, generous free storage (15 GB), and a well-documented OAuth2 API.
- Building and maintaining multiple sync providers (Dropbox, OneDrive, WebDAV) simultaneously would multiply integration complexity.
- The `ISyncProvider` interface means any alternative can be delivered as a plugin without requiring a core application change.

**Alternatives Considered:**
- **Self-hosted sync (WebDAV, S3):** High setup burden for non-technical users. Available via plugin.
- **iCloud Drive:** macOS-only; limited API surface for custom applications.
- **Dropbox:** Similar API quality to Google Drive; narrower user base.

**Trade-offs:**
- Users without a Google account cannot use the built-in sync. They must use a plugin-provided provider or the manual export/import workflow.
- Google's OAuth API and terms of service are subject to change.

**Future:** First-party plugins for Dropbox, OneDrive, and WebDAV sync are planned as post-launch deliverables.
