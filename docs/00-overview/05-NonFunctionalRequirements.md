# 05 — Non-Functional Requirements

> **Document Type:** Non-Functional Requirements Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-Vision.md](./01-Vision.md) · [02-Goals.md](./02-Goals.md) · [04-FunctionalRequirements.md](./04-FunctionalRequirements.md) · [07-Glossary.md](./07-Glossary.md)

---

## 1. Purpose

This document specifies the non-functional requirements (NFRs) for Notebook — the quality attributes, system-level constraints, and measurable targets that govern *how* the system must perform, beyond *what* it does. Functional capabilities are defined in [04-FunctionalRequirements.md](./04-FunctionalRequirements.md).

NFRs here are binding on architecture and implementation decisions. Where a goal in [02-Goals.md](./02-Goals.md) corresponds to a measurable NFR, the measurable target in this document takes precedence.

---

## 2. Requirement Identifier Convention

Each requirement is identified as `NFR-<CATEGORY>-<NUMBER>`.

| Category Code | Category |
|---|---|
| `PERF` | Performance |
| `REL` | Reliability and Availability |
| `SEC` | Security and Privacy |
| `PORT` | Portability and Compatibility |
| `MAINT` | Maintainability and Extensibility |
| `USAB` | Usability and Accessibility |
| `DATA` | Data Integrity and Durability |
| `SCALE` | Scalability |

---

## 3. Performance

**NFR-PERF-01** The application **shall** reach an interactive state (first meaningful render, Workspace selectable) within **3 seconds** of launch on a machine meeting the minimum hardware specification (§7).

**NFR-PERF-02** Full-text search **shall** return the first page of results within **300 milliseconds** for a Workspace containing up to 10,000 notes, measured on the minimum hardware specification.

**NFR-PERF-03** Semantic (vector) search **shall** return ranked results within **1 second** for a Workspace with up to 10,000 embedded documents, measured on the minimum hardware specification.

**NFR-PERF-04** The rich text editor **shall** exhibit no perceptible input lag (< 16 ms per keypress render cycle) for notes up to **50,000 words**.

**NFR-PERF-05** AI chat responses **should** begin streaming to the UI within **2 seconds** of query submission, measured on a machine with an Ollama-compatible GPU or CPU meeting the recommended specification.

**NFR-PERF-06** The application **should** consume no more than **500 MB of RAM** during normal operation (idle Workspace, no active AI inference).

**NFR-PERF-07** Workspace loading (open an existing Workspace) **shall** complete within **2 seconds** for a Workspace containing up to 50,000 notes.

**NFR-PERF-08** OCR processing of a single-page image **should** complete within **5 seconds** on the minimum hardware specification.

**NFR-PERF-09** Workspace export (full archive) **should** complete within **30 seconds** for a Workspace containing up to 10,000 notes and 1 GB of attachments, on the minimum hardware specification.

### Benchmark Conditions

All performance targets are measured under the following conditions unless otherwise noted:

- Operating System: Windows 11 or macOS 13 (Ventura)
- RAM: 8 GB
- Storage: SSD with ≥ 500 MB/s sequential read
- CPU: Quad-core at ≥ 2.5 GHz
- No other resource-intensive applications running concurrently

---

## 4. Reliability and Availability

**NFR-REL-01** The application **shall** be available for full use (all core features) with no active internet connection at all times. Availability is not contingent on any external service.

**NFR-REL-02** The application **shall not** lose user data as a result of an unexpected crash. Auto-save (FR-NT-10) combined with write-ahead logging in SQLite **shall** ensure at-most-one-edit-cycle data loss on crash.

**NFR-REL-03** A Google Drive sync failure **shall not** corrupt, overwrite, or delete locally stored data.

**NFR-REL-04** The application **should** recover gracefully from a corrupted or incomplete Workspace database, surfacing a clear error and providing a recovery path.

**NFR-REL-05** Plugin failures **shall** be isolated from the core application process; a misbehaving plugin **shall not** cause the application to crash or become unresponsive.

**NFR-REL-06** The application **should** target a Mean Time Between Failures (MTBF) of at least **8 hours** of continuous use in normal operation.

**NFR-REL-07** During Google Drive synchronization, the application **shall** never modify, overwrite, or delete local data without explicit user confirmation. The local Workspace **shall** remain in a consistent, fully operational state regardless of sync outcome. If a conflict cannot be resolved automatically, the local version **shall** be preserved until the user resolves the conflict manually.

---

## 5. Security and Privacy

**NFR-SEC-01** User data **shall** never be transmitted to any external server without an explicit, user-initiated action. Passive or background data exfiltration is absolutely prohibited.

**NFR-SEC-02** The application **shall not** collect, store, or transmit telemetry, usage analytics, crash reports, or any behavioral data by default. If opt-in telemetry is added in a future release, it **shall** be disabled by default and require explicit user consent.

**NFR-SEC-03** Google Drive OAuth credentials **shall** be stored exclusively in the operating system's native secure credential store (e.g., Windows Credential Manager, macOS Keychain, libsecret on Linux). Credentials **shall not** be stored in plaintext files or the application database.

**NFR-SEC-04** The Electron application **shall** disable `nodeIntegration` in renderer processes. All Node.js access **shall** be mediated through a `contextBridge` preload script with a minimal, explicitly declared API surface.

**NFR-SEC-05** The plugin system **shall** enforce a declared-permission model. Plugins **shall** only access application APIs they have declared and the user has approved.

**NFR-SEC-06** The application **should** support optional at-rest encryption of the Workspace SQLite database using a user-provided passphrase.

**NFR-SEC-07** All AI inference **shall** occur locally by default. No note content, query text, or AI response **shall** be transmitted to a remote AI service unless the user has explicitly configured a remote provider via the plugin system.

**NFR-SEC-08** The application **shall** validate and sanitize all content rendered in the rich text editor to prevent cross-site scripting (XSS) or script injection attacks via imported or pasted content.

### Privacy Summary

| Data Type | Stored Locally | Sent Externally |
|---|---|---|
| Notes | ✅ Yes | ❌ Never (without user action) |
| Attachments | ✅ Yes | ❌ Never (without user action) |
| AI chat history | ✅ Yes | ❌ Never |
| Embeddings | ✅ Yes | ❌ Never |
| OAuth tokens | ✅ Secure store | ❌ Not to developer servers |
| Telemetry | ❌ Not collected | ❌ Never |

---

## 6. Portability and Compatibility

**NFR-PORT-01** The application **shall** be distributable and fully functional on Windows (10 and 11), macOS (12 Monterey and later), and Linux (Ubuntu 20.04 LTS and later, or equivalent).

**NFR-PORT-02** The application **shall** produce exports in open, standard formats (Markdown, plain text, JSON) that are readable by standard tools independent of Notebook.

**NFR-PORT-03** The local SQLite database **shall** be accessible using the standard SQLite CLI or any SQLite-compatible tool, without requiring decryption (unless the user has enabled encryption per NFR-SEC-06).

**NFR-PORT-04** The application **shall not** rely on deprecated or platform-proprietary APIs that would prevent future portability.

**NFR-PORT-05** The application's Workspace directory structure **should** be human-readable and self-documenting, such that a user can understand its layout without documentation.

---

## 7. Maintainability and Extensibility

**NFR-MAINT-01** The codebase **shall** follow consistent TypeScript coding standards documented in `docs/development/`.

**NFR-MAINT-02** All major subsystems (AI, sync, OCR, search, editor) **shall** be implemented behind an interface or abstract class to allow substitution via the plugin system or future internal refactoring.

**NFR-MAINT-03** The Plugin SDK **shall** maintain backward compatibility across minor versions. Breaking changes to the plugin API **shall** be versioned with a major version increment and documented in a migration guide.

**NFR-MAINT-04** The application **should** achieve a unit test coverage of at least **70%** for business logic in the application layer.

**NFR-MAINT-05** All Architecture Decision Records (ADRs) **shall** be maintained in `docs/adr/` and linked from the relevant module documentation.

**NFR-MAINT-06** The application **shall** use a repository pattern for all database access, ensuring that database implementation details are not leaked into business logic layers.

---

## 8. Usability and Accessibility

**NFR-USAB-01** All primary user workflows **should** be completable using only a keyboard, without requiring a mouse or pointing device.

**NFR-USAB-02** The application **should** respect the operating system's accessibility settings, including font scaling and high-contrast modes.

**NFR-USAB-03** All interactive UI controls **shall** have accessible labels or `aria-label` attributes to support screen reader compatibility.

**NFR-USAB-04** The application **should** respect the system-level light/dark mode preference on all supported platforms.

**NFR-USAB-05** Error messages displayed to the user **shall** be written in plain language, clearly describe what went wrong, and where possible, suggest a corrective action.

**NFR-USAB-06** The application **should** respond to user input events within **100 milliseconds** to maintain the perception of immediate responsiveness.

---

## 9. Data Integrity and Durability

**NFR-DATA-01** All writes to the Workspace database **shall** use SQLite transactions with write-ahead logging (WAL) mode enabled, ensuring atomicity and crash safety.

**NFR-DATA-02** The application **shall** verify the integrity of the local SQLite database on Workspace open and **should** surface a warning if corruption is detected.

**NFR-DATA-03** Exported data **shall** be a faithful representation of the source content; no data **shall** be silently omitted or altered during export.

**NFR-DATA-04** Attachments stored in the Workspace directory **shall** not be modified or re-encoded by the application; the application **shall** preserve the original file.

**NFR-DATA-05** Version history records **shall** be immutable once written; the application **shall not** modify or delete a version snapshot except through an explicit user action.

---

## 10. Scalability

**NFR-SCALE-01** The application **shall** remain stable and maintain all performance NFRs for a Workspace containing up to **50,000 notes**.

**NFR-SCALE-02** The application **shall** remain stable and maintain all performance NFRs for a Workspace containing up to **10 GB of attachments**.

**NFR-SCALE-03** The embedding and vector search subsystem **shall** remain operational for Workspaces containing up to **100,000 embedding vectors**.

**NFR-SCALE-04** The application **shall** support at least **10 concurrent Workspaces** registered in the application (though only one is active at a time).

**NFR-SCALE-05** Workspace export, import, backup, and restore operations (FR-WS-09 to FR-WS-12) **shall** scale linearly with Workspace size and **shall** not degrade core application responsiveness while running in the background.

---

## 11. Minimum Hardware Specification

The following is the minimum supported hardware configuration for baseline performance targets:

| Specification | Minimum | Recommended |
|---|---|---|
| CPU | Quad-core 2.5 GHz | 8-core 3.0 GHz+ |
| RAM | 8 GB | 16 GB |
| Storage | SSD, 500 MB/s read | NVMe SSD |
| GPU (for local AI) | Not required | NVIDIA/AMD GPU with ≥ 8 GB VRAM |
| OS | Windows 10, macOS 12, Ubuntu 20.04 | Latest stable release |

> **Note:** AI inference performance (NFR-PERF-05) is highly dependent on the hardware configuration and the Ollama model selected. On minimum-spec hardware without a supported GPU, AI responses may be significantly slower than the 2-second streaming target.

---

## 12. Future Considerations

- Formal accessibility audit against WCAG 2.1 AA conformance criteria.
- Automated performance regression testing integrated into CI/CD pipeline.
- Encrypted Workspace database (NFR-SEC-06) implementation plan.
- Load testing framework for the vector search subsystem at scale.
