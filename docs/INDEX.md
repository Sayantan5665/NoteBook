# Notebook Documentation Index

> **Document Type:** Navigation Guide
> **Applies To:** Notebook — All Versions

---

## 1. Purpose

Welcome to the Notebook documentation suite. This `INDEX.md` file serves as the single entry point and complete documentation map for the entire Notebook project. 

Its primary purpose is to:
- Provide a clear, structured map of all project documentation.
- Show the documentation hierarchy and dependency order.
- Explain the purpose of every documentation section.
- Help developers, architects, contributors, and AI coding agents quickly locate information without searching blindly.
- Serve as the canonical navigation guide, ensuring that AI coding agents understand exactly where each type of information belongs and how it is structured.

---

## 2. Documentation Principles

Notebook documentation strictly adheres to the following principles:

- **Single Responsibility:** Every document has a single, well-defined responsibility. Documents do not overlap in purpose.
- **No Duplication (DRY):** Documentation must *never* duplicate information. 
- **Reference Over Repetition:** Documents must reference related documents using relative links instead of repeating content.
- **Architectural Traceability:** Architectural decisions and significant changes to system design are recorded exclusively using Architecture Decision Records (ADRs).
- **Frozen Documents:** Baseline documentation (e.g., core architecture, database schemas, and foundational modules) is considered "frozen." Changes to frozen documents should only occur through approved ADRs or targeted, approved documentation patches.
- **Living Index:** This `INDEX.md` file must always reflect the current documentation structure. It acts as a map, not a specification.

---

## 3. Documentation Structure

The documentation is organized into numbered directories to enforce reading order, alongside key root-level files.

- **`README.md`**
  - **Purpose:** High-level project introduction, vision, and setup instructions.
  - **When to reference:** Initial onboarding.
  - **Dependencies:** None.
- **`INDEX.md`** (This File)
  - **Purpose:** Central navigation and documentation map.
  - **When to reference:** Whenever locating specific knowledge or understanding where new documentation should be placed.
- **`PROJECT_PROGRESS.md`**
  - **Purpose:** Tracking completed work, current tasks, and immediate technical debt.
  - **When to reference:** Project management and sprint planning.
- **`GOVERNANCE.md`**
  - **Purpose:** Outlines the core principles, coding standards, and project rules.
  - **When to reference:** Before contributing code or documentation.
- **`00-overview/`**
  - **Purpose:** Product definitions, user personas, and functional requirements.
  - **Contents:** Feature requirements, use cases, product vision.
  - **When to reference:** Understanding *what* the application does and *who* it is for.
- **`01-architecture/`**
  - **Purpose:** High-level system design, domain models, and core technological choices.
  - **Contents:** System overview, clean architecture definitions, IPC, event bus.
  - **When to reference:** Understanding the technical boundaries and systemic structures.
- **`02-database/`**
  - **Purpose:** The physical storage model and data principles.
  - **Contents:** Storage layout, SQLite configuration, backup strategies.
  - **When to reference:** Designing data persistence or troubleshooting storage.
- **`03-modules/`**
  - **Purpose:** Detailed functional specifications for individual system modules.
  - **Contents:** Folders for Workspace, Notes, Folder, Tags, etc.
  - **When to reference:** Implementing, refactoring, or testing specific features.
- **`04-ai/`**
  - **Purpose:** Deep dive into the AI subsystem (Ollama integration, prompt engineering).
  - **Contents:** Local AI strategy, embedding models, RAG pipelines.
  - **When to reference:** Working on AI features or understanding local ML execution.
- **`05-plugin-sdk/`**
  - **Purpose:** Guidelines and specifications for the Plugin ecosystem.
  - **Contents:** Extension points, API contracts, security sandboxing.
  - **When to reference:** Building third-party plugins or expanding the SDK.
- **`06-development/`**
  - **Purpose:** Engineering standards and local development environment setup.
  - **Contents:** Build scripts, linting rules, PR templates, `DocumentationStyleGuide.md`, `DocumentationNamingConvention.md`.
  - **When to reference:** Setting up a local dev environment or reviewing PRs.
- **`07-testing/`**
  - **Purpose:** Quality assurance strategy.
  - **Contents:** Unit tests, E2E (Playwright), mock data generation.
  - **When to reference:** Writing tests or verifying application stability.
- **`08-release/`**
  - **Purpose:** Packaging and deployment procedures.
  - **Contents:** CI/CD pipelines, Electron builder configs, update mechanisms.
  - **When to reference:** Preparing a new software release.
- **`09-roadmap/`**
  - **Purpose:** Long-term implementation planning and future milestones.
  - **Contents:** Epic planning, future versions (V2, V3).
  - **When to reference:** Planning future architecture or major feature development.
- **`ADR/`**
  - **Purpose:** Architecture Decision Records.
  - **Contents:** Sequential log of technical decisions.
  - **When to reference:** Understanding *why* a specific technical approach was chosen.
- **`templates/`**
  - **Purpose:** Reusable markdown templates for standardized documentation.
  - **Contents:** Module templates, ADR templates.
  - **When to reference:** Creating new documentation files.

---

## 4. Documentation Hierarchy

To fully grasp the Notebook system, documentation should be consumed in a specific dependency order. Understanding downstream decisions requires context from upstream principles.

```text
README
  ↓
Governance
  ↓
Product Overview
  ↓
Architecture
  ↓
ADR
  ↓
Database
  ↓
Module Specifications
  ↓
AI Design
  ↓
Plugin SDK
  ↓
Development Standards
  ↓
Testing
  ↓
Release
  ↓
Implementation Roadmap
```

**Why read in this order?**
You cannot understand the Database schema without first understanding the Architecture (e.g., local-first SQLite). You cannot understand the Module Specifications without understanding the Database they rely on. Finally, Testing and Release strategies are dictated by the culmination of all prior functional and architectural requirements.

---

## 5. Module Index

The `03-modules/` directory contains detailed functional specifications for discrete areas of the application. 

| Module | Purpose | Location | Status | Related Modules |
|---|---|---|---|---|
| **Workspace** | Manages the root logical container and database lifecycle. | `03-modules/workspace/` | Approved / Frozen | Folder, Notes, Settings |
| **Folder** | Provides hierarchical organization for Notes. | `03-modules/folder/` | Approved / Frozen | Workspace, Notes |
| **Notes** | Core content management and note-taking logic. | `03-modules/notes/` | *Placeholder* | Folder, Editor, Attachments |
| **Editor** | The rich-text / markdown editing interface. | `03-modules/editor/` | *Placeholder* | Notes, Wiki Links |
| **Wiki Links** | Manages bidirectional linking between content. | `03-modules/wiki-links/` | *Placeholder* | Notes, Backlinks |
| **Backlinks** | Derives and displays reverse link relationships. | `03-modules/backlinks/` | *Placeholder* | Wiki Links, Notes |
| **Attachments** | Handles binary file storage and metadata. | `03-modules/attachments/` | *Placeholder* | Notes, Search |
| **Tags** | Provides flat, non-hierarchical categorization. | `03-modules/tags/` | *Placeholder* | Notes, Search |
| **Search** | Full-Text Search (FTS) and hybrid retrieval. | `03-modules/search/` | *Placeholder* | Notes, Tags, AI |
| **AI** | Local LLM interactions, RAG, and embeddings. | `03-modules/ai/` | *Placeholder* | Search, Notes |
| **Todos** | Task extraction and tracking from within Notes. | `03-modules/todos/` | *Placeholder* | Notes |
| **Synchronization** | Peer-to-peer or cloud sync (e.g., Google Drive). | `03-modules/sync/` | *Placeholder* | Workspace, Backup |
| **Backup** | Point-in-time local automated backups. | `03-modules/backup/` | *Placeholder* | Workspace, Sync |
| **Import / Export** | Data migration into and out of Notebook. | `03-modules/import-export/` | *Placeholder* | Workspace |
| **Plugins** | Extensibility management and execution. | `03-modules/plugins/` | *Placeholder* | Settings |
| **Settings** | Application and Workspace-level configurations. | `03-modules/settings/` | *Placeholder* | Workspace |
| **Notifications** | System alerts, toasts, and background job statuses. | `03-modules/notifications/` | *Placeholder* | Workspace |

---

## 6. ADR Index

*This section serves as a placeholder index for Architecture Decision Records located in the `ADR/` directory.*

- **Concept:** Every ADR has a unique sequential identifier (e.g., `ADR-001-LocalFirst.md`).
- **Purpose:** ADRs strictly record structural, architectural, or significant technological decisions.
- **Supremacy:** A new ADR supersedes previous architectural assumptions.
- **Process:** If a "frozen" document needs to be structurally changed, an ADR must be written and approved first. The documentation is then patched to reflect the ADR.

---

## 7. Documentation Workflow

The official lifecycle for introducing new features or technical changes:

1. **Idea:** A feature or technical improvement is proposed.
2. **Requirements:** Added to `00-overview/` to define the *what*.
3. **Architecture:** Evaluated against `01-architecture/`.
4. **ADR (if required):** If the idea changes the architecture, an ADR is written and approved.
5. **Database:** Storage implications are mapped out in `02-database/`.
6. **Module Specifications:** Functional logic is defined in `03-modules/`.
7. **Review:** Peer review of the proposed documentation.
8. **Patch:** Existing documentation is updated carefully, following DRY principles.
9. **Freeze:** The specification is approved and locked.
10. **Implementation:** Code is written strictly following the frozen spec.
11. **Testing:** Verified against `07-testing/` and Acceptance Criteria.
12. **Release:** Merged and packaged following `08-release/`.

---

## 8. Document Ownership

To maintain boundaries, specific types of knowledge belong exclusively in designated documents:

- **README**: Project introduction, installation, and quick start.
- **INDEX**: Documentation navigation, map, and hierarchy rules.
- **PROJECT_PROGRESS**: Project management, to-do lists, and status.
- **GOVERNANCE**: Project rules, contribution guidelines, and style.
- **Architecture**: System design, inter-process communication (IPC), structural bounds.
- **Database**: Data model, physical storage layout, schema rules.
- **Modules**: Functional behavior, business rules, workflows, events.
- **AI**: AI subsystem logic, models, inference parameters.
- **Plugin SDK**: Extension development, third-party hooks.
- **Development**: Engineering standards, linting, build tools.
- **Testing**: Quality assurance, CI testing strategies.
- **Release**: Packaging, versioning, and deployment logic.
- **Roadmap**: Implementation planning, long-term features.

---

## 9. Maintenance Rules

To prevent documentation rot, `INDEX.md` and the broader documentation suite must be maintained according to the following rules:

1. **Always Update the Index:** Every new documentation section, folder, or module must be added to this `INDEX.md`.
2. **Remove Dead Links:** If a document is deprecated or removed, it must be removed from the index.
3. **Validate Links:** All relative links must remain up to date.
4. **No Duplication:** `INDEX.md` should **never** contain duplicated technical documentation or business rules.
5. **Concise Navigation:** This document must remain concise. It acts as a compass and a map, not a technical specification.
