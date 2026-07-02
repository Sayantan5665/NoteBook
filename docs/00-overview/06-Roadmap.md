# 06 — Roadmap

> **Document Type:** Product Roadmap
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-Vision.md](./01-Vision.md) · [02-Goals.md](./02-Goals.md) · [03-Scope.md](./03-Scope.md) · [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) · [07-Glossary.md](./07-Glossary.md)

---

## 1. Purpose

This document defines the phased delivery roadmap for Notebook — the sequence in which features and capabilities will be designed, implemented, and released. It translates the goals in [02-Goals.md](./02-Goals.md) and requirements in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) into an ordered release plan.

The roadmap reflects current planning and is subject to revision. Priority changes **should** be reflected with an updated revision date on this document.

---

## 2. Guiding Principles for Sequencing

1. **Foundation before features.** Core infrastructure (Workspace, database, editor) **shall** be completed before advanced features (AI, sync) are built on top of it.
2. **Offline first, always.** No phase introduces a feature that requires internet connectivity as a prerequisite.
3. **Incremental value.** Each phase **should** deliver an independently usable and valuable version of the application.
4. **Stability over speed.** A phase is not considered complete until its acceptance criteria (defined in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md)) are verifiably met.

---

## 3. Current Status

> **Current Phase:** Phase 0 — Foundation & Documentation
> **Implementation Status:** Not started
> **Active Milestone:** Architecture, database design, and documentation

---

## 4. Phases

---

### Phase 0 — Foundation and Documentation

**Objective:** Establish the complete technical and product foundation before any implementation begins.

**Deliverables:**

| Artifact | Status |
|---|---|
| `docs/00-overview/` — Vision, Goals, Scope, Requirements, Roadmap, Glossary | 🔄 In Progress |
| `docs/architecture/` — System architecture and module design | ⬜ Pending |
| `docs/database/` — Database schema, indexes, migrations | ⬜ Pending |
| `docs/modules/` — Functional specifications per module | ⬜ Pending |
| `docs/sdk/` — Plugin SDK specification | ⬜ Pending |
| `docs/adr/` — Architecture Decision Records (ADRs) | ⬜ Pending |
| Development environment setup guide | ⬜ Pending |

**Exit Criteria:**
- All `docs/00-overview/` documents are complete and internally consistent.
- Database schema is fully specified and reviewed.
- Architecture documentation covers all major modules and their interfaces.

---

### Phase 1 — Core Application Shell

**Objective:** Deliver a functional desktop application with Workspace management, folder hierarchy, and the rich text editor. No AI, no search, no sync.

**Features:**

| Feature | Requirement Reference |
|---|---|
| Electron + Angular application shell | — |
| Workspace create, open, close, rename, delete | FR-WS-01 to FR-WS-08 |
| Folder hierarchy (create, rename, move, delete) | FR-FL-01 to FR-FL-06 |
| Rich text note editor (full formatting support) | FR-NT-01 to FR-NT-10 |
| Note-to-folder association, move | FR-NT-07, FR-NT-08 |
| Basic attachment support (upload, view, delete) | FR-AT-01 to FR-AT-07 |
| Trash (soft delete + restore) | FR-TR-01 to FR-TR-06 |
| Tags (create, apply, browse, filter) | FR-TAG-01 to FR-TAG-06 |
| Todo management | FR-TD-01 to FR-TD-07 |
| Light/dark theme | NFR-USAB-04 |
| Keyboard navigation | NFR-USAB-01 |

**Exit Criteria:**
- A user can create a Workspace, write rich text notes, organize them in folders, add tags and todos, and all data persists across restarts.
- All Phase 1 acceptance criteria in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) pass.
- Performance targets NFR-PERF-01 and NFR-PERF-07 are met.

---

### Phase 2 — Knowledge and Search

**Objective:** Add wiki links, backlinks, version history, full-text search, OCR, and import/export. The application becomes a complete personal knowledge management tool without AI.

**Features:**

| Feature | Requirement Reference |
|---|---|
| Wiki-style internal links (`[[Note Title]]`) | FR-NT-03 |
| Automatic bidirectional backlinks | FR-NT-04, FR-NT-05 |
| Version history (auto-snapshot, restore) | FR-VH-01 to FR-VH-06 |
| Full-text search across notes and attachments | FR-FTS-01 to FR-FTS-08 |
| OCR for image and PDF attachments | FR-OCR-01 to FR-OCR-08 |
| Text extraction from Word, text, spreadsheet attachments | FR-AT-08 |
| Markdown import | FR-IMP-01 to FR-IMP-04 |
| Markdown and plain text export | FR-EXP-01 to FR-EXP-04 |

**Exit Criteria:**
- A user can link notes via wiki links; backlinks appear automatically.
- Prior versions of a note are accessible and restorable.
- Full-text search returns results within NFR-PERF-02 targets.
- OCR-extracted text is discoverable via search.
- Content can be imported from Markdown and exported back without loss.

---

### Phase 3 — Local AI and Semantic Search

**Objective:** Integrate Ollama-backed local AI, vector embeddings, semantic search, and RAG-powered AI chat — all running entirely offline.

**Features:**

| Feature | Requirement Reference |
|---|---|
| Ollama integration (model selection, inference) | FR-AI-06, FR-AI-07 |
| Vector embedding generation (notes + attachments) | FR-SEM-01, FR-SEM-02, FR-SEM-03 |
| Semantic search interface | FR-SEM-04, FR-SEM-05, FR-SEM-06, FR-SEM-07, FR-SEM-08 |
| AI chat with RAG grounding | FR-AI-01 to FR-AI-11 |
| Source citation in AI responses | FR-AI-05 |
| AI chat history persistence | FR-AI-09, FR-AI-10 |
| Incremental re-embedding on note update | FR-SEM-06 |

**Exit Criteria:**
- AI answers questions grounded solely in Workspace content and cites sources.
- Semantic search returns conceptually relevant results without exact keyword matches.
- All AI and embedding operations complete without internet connectivity.
- Performance targets NFR-PERF-03 and NFR-PERF-05 are met.

---

### Phase 4 — Synchronization and Plugin System

**Objective:** Add Google Drive synchronization and deliver the plugin system, making Notebook extensible and enabling multi-device workflows.

**Features:**

| Feature | Requirement Reference |
|---|---|
| Google Drive OAuth authorization | FR-SYNC-02, FR-SYNC-03 |
| Bidirectional Workspace sync to Google Drive | FR-SYNC-01, FR-SYNC-04 |
| Conflict detection and resolution UI | FR-SYNC-05 |
| Sync status display | FR-SYNC-06 |
| Sync revocation | FR-SYNC-08 |
| Plugin system core (load, unload, permission model) | FR-PLG-01 to FR-PLG-07 |
| Plugin management UI | FR-PLG-03 |
| Plugin SDK documentation | `docs/sdk/` |

**Exit Criteria:**
- A Workspace synced to Google Drive and restored on a second machine is fully functional.
- A sync failure does not corrupt local data (NFR-REL-03).
- A third-party plugin can be installed without modifying core application code.
- Plugin security boundaries are enforced (NFR-SEC-05).

---

### Phase 5 — Polish, Performance, and Hardening

**Objective:** Production readiness. Address performance at scale, accessibility, error handling, and long-term stability.

**Focus Areas:**

- Performance benchmarking and optimization against NFRs in [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md).
- Workspace database integrity checks on open (NFR-DATA-02).
- Comprehensive error handling and user-facing error messages (NFR-USAB-05).
- Keyboard navigation audit (NFR-USAB-01).
- Accessibility audit (NFR-USAB-02, NFR-USAB-03).
- Unit and integration test coverage to ≥ 70% (NFR-MAINT-04).
- Packaging and distribution for Windows, macOS, and Linux.
- End-to-end documentation review and release notes.

**Exit Criteria:**
- All NFRs in [05-NonFunctionalRequirements.md](./05-NonFunctionalRequirements.md) are measurably met under benchmark conditions.
- Application passes end-to-end test suite covering all Phase 1–4 features.
- Application is packaged and installable on all three target platforms.

---

## 5. Feature Dependency Map

```
Phase 0: Foundation & Docs
    └── Phase 1: Core Shell (Workspace, Notes, Folders, Editor, Tags, Todos, Trash)
            └── Phase 2: Knowledge & Search (Wiki Links, Backlinks, FTS, OCR, Version History, Import, Export)
                    └── Phase 3: Local AI (Embeddings, Semantic Search, RAG Chat)
                            └── Phase 4: Sync & Plugins (Google Drive, Plugin System)
                                    └── Phase 5: Polish & Hardening
```

---

## 6. Out-of-Roadmap Items (Future Consideration)

The following items are not in scope for the current roadmap but have been identified as potential future phases. See [03-Scope.md §8](./03-Scope.md) and [01-Vision.md §9](./01-Vision.md).

| Item | Notes |
|---|---|
| Peer-to-peer sync | Requires CRDT research and design; post-Phase 5 |
| Additional sync providers (Dropbox, WebDAV) | May be delivered as first-party plugins |
| Mobile companion application | Separate project; requires API surface design |
| Plugin marketplace | Requires plugin signing and distribution infrastructure |
| Optional at-rest database encryption | Design referenced in NFR-SEC-06 |
| WCAG 2.1 AA formal conformance | Formal audit post-Phase 5 |

---

## 7. Assumptions

1. Phases are sequential; no phase begins until the prior phase's exit criteria are met.
2. Phase timelines are not defined in this document; sprint planning is managed in the project tracker.
3. Scope changes that affect Phase 1–3 deliverables require a revision to this roadmap and review against [04-FunctionalRequirements.md](./04-FunctionalRequirements.md).
