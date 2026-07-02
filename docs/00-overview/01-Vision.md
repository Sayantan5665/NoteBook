# 01 — Vision

> **Document Type:** Product Vision
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [02-Goals.md](./02-Goals.md) · [03-Scope.md](./03-Scope.md) · [06-Roadmap.md](./06-Roadmap.md) · [07-Glossary.md](./07-Glossary.md)

---

## 1. Purpose

This document establishes the foundational product vision for **Notebook** — an offline-first, local-first, AI-powered personal knowledge management (PKM) desktop application. It defines the strategic intent, core philosophy, and target outcome that govern all design, architecture, and engineering decisions across the project.

All other documents in `docs/00-overview/` derive their context from this vision. In the event of a conflict between documents, this document takes precedence on matters of strategic direction.

---

## 2. Problem Statement

Modern knowledge workers face a fragmented landscape of note-taking and PKM tools that share a common set of structural trade-offs:

| Problem | Root Cause |
|---|---|
| Privacy erosion | Notes stored on third-party cloud servers |
| Vendor lock-in | Proprietary formats and centralized APIs |
| Subscription dependency | Core functionality gated behind recurring payment |
| AI without personal context | Generic LLMs with no awareness of user knowledge |
| Offline unreliability | Cloud-dependent architectures that fail without internet |
| Data loss risk | User data owned and controlled by a remote provider |

Existing solutions force users to choose between convenience and control. **Notebook rejects that trade-off.**

---

## 3. Vision Statement

> **Notebook exists to give every knowledge worker a private, intelligent, and fully self-owned "Second Brain" — running entirely on their own machine, with no subscriptions, no cloud dependency, and no compromise on privacy.**

Concretely, Notebook shall deliver a desktop application where:

- **Workspace-first architecture:** The Workspace is the top-level logical container. Every note, attachment, AI chat, embedding, todo, tag, setting, and version history record belongs to exactly one Workspace. Each Workspace is fully independent and self-contained.
- Every note, attachment, and AI conversation is stored locally and owned entirely by the user.
- Notes are connected through wiki-style links (`[[Note Title]]`); the application automatically maintains bidirectional backlinks without user intervention.
- AI-powered knowledge retrieval is grounded exclusively in the user's own content — never in external training data or third-party cloud APIs.
- The application functions completely and correctly with no active internet connection.
- Optional, user-initiated synchronization to Google Drive is the only permitted network activity for data transfer. Google Drive is not the primary data store; the primary data store is the local SQLite database and local filesystem.
- The system is extensible, enabling users and developers to adapt it to specialized workflows through a first-class plugin system.

---

## 4. Core Philosophy

Notebook is built on five non-negotiable principles. These principles function as hard constraints on all design and architectural decisions.

### 4.1 Offline First

The application **shall** operate with full fidelity in an air-gapped environment. Internet connectivity is an optional enhancement, not a prerequisite. The definitive list of offline-capable features is maintained in [03-Scope.md §3](./03-Scope.md).

### 4.2 Local First

All persistent data — notes, attachments, AI embeddings, version history, todos, and settings — **shall** reside on the user's local filesystem or a local embedded database. No developer-owned server, centralized database, or proprietary cloud infrastructure exists or is required. No data is transmitted to any external party without explicit, per-action, user-initiated consent.

### 4.3 Privacy First

Notebook **shall not** collect, aggregate, or report telemetry, usage analytics, or behavioral data of any kind by default. User data **shall** never leave the local machine unless the user explicitly initiates a synchronization operation. The system **shall** contain no mechanism for passive data exfiltration.

### 4.4 Zero Mandatory Cost

Every core feature of Notebook **shall** be available without a subscription, a paid API key, a hosted database, or any recurring financial commitment. Optional workflows using paid third-party services **may** be supported via the plugin system but **shall** never be required for any functionality defined in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md).

### 4.5 Extensible by Design

Notebook **shall** expose a stable plugin interface allowing developers to extend or replace major subsystems, including: AI providers, sync providers, OCR providers, importers, exporters, editor extensions, and themes. The core application **shall not** be a closed platform.

---

## 5. Target Users

Notebook is designed for the following primary personas:

| Persona | Description |
|---|---|
| **The Privacy-Conscious Professional** | Handles sensitive notes and documents. Requires zero involuntary cloud exposure. |
| **The Researcher / Academic** | Accumulates large volumes of notes and attachments. Needs powerful search and AI retrieval over personal content. |
| **The Developer / Technical User** | Values local tooling, plugin development, and extensibility. |
| **The Offline Worker** | Operates in environments with limited or no internet access. Requires full functionality offline. |
| **The Independent Knowledge Worker** | Builds and curates a personal knowledge base over years. Needs version history, organization, and long-term data portability. |

---

## 6. Strategic Differentiators

| Differentiator | Notebook | Typical Cloud PKM |
|---|---|---|
| Data residency | 100% local | Third-party cloud server |
| AI knowledge source | User's own content only | Generic LLM / cloud API |
| Internet required (core features) | No | Yes |
| Subscription required | No | Typically |
| Vendor lock-in | None (open formats + export) | High |
| Local AI inference | Yes (Ollama) | Rarely |
| Plugin extensibility | First-class | Limited or none |
| Centralized backend | None | Required |

---

## 7. Assumptions

1. Users have access to a desktop or laptop running Windows, macOS, or Linux.
2. Users who wish to use local AI features have sufficient hardware to run Ollama-compatible language models, or accept that AI response quality is hardware-dependent.
3. Google Drive is used exclusively as an optional synchronization target. It is not the primary data store. All data remains authoritative on the local machine regardless of sync state.
4. The target user population is comfortable managing a locally installed desktop application.

---

## 8. Constraints

1. There is no developer-owned backend. All processing, storage, and AI inference must occur on the user's machine.
2. The application cannot support real-time collaborative editing because data is not centrally stored.
3. AI responses are strictly bounded to the user's own indexed content. General-purpose AI chat is explicitly out of scope.
4. The application shall not require any network connectivity for any core operation.

---

## 9. Future Considerations

The following directions are acknowledged for long-term consideration and **shall not** be architecturally foreclosed by initial design decisions, but are **not** in scope for the initial release:

- Peer-to-peer workspace synchronization without reliance on Google Drive.
- Support for additional sync providers (Dropbox, OneDrive, self-hosted WebDAV).
- A mobile companion application with read-only or limited editing capability.
- A community marketplace for published plugins and themes.
- Support for additional local AI inference providers beyond Ollama.

See [06-Roadmap.md](./06-Roadmap.md) for the phased delivery plan.

---

*This document is the authoritative source for the strategic intent of Notebook. All product, architecture, and engineering decisions shall be evaluated against the vision, philosophy, and constraints defined here.*
