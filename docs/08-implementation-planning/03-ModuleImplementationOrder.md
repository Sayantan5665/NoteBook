# 03 — Module Implementation Order

> **Module:** Implementation Planning & Roadmap
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Module Implementation Order provides a granular breakdown explaining *why* modules are sequenced in their specific order, highlighting prerequisites and parallel work opportunities.

---

## 2. Module Sequencing Rationale

### 2.1 The Critical Path
- **Database → Workspace → Notes:** This is the unalterable critical path. Without a database, a workspace cannot exist. Without a workspace, notes have no context. No UI or advanced features can be developed until this core is functioning.

### 2.2 Prerequisites
- **Editor Requires Notes:** The Editor module is a UI projection. It requires the underlying Note data structure to be stable.
- **Search Requires Notes and Attachments:** FTS indexing cannot be implemented until there is text and OCR data to index.
- **AI Requires Embeddings and Search:** RAG orchestration relies on Vector and FTS retrieval. Therefore, AI is built *after* local search is perfected.
- **Sync Requires Stable Schema:** Synchronization must be implemented only when the canonical data structures are mature, to avoid constantly rewriting conflict resolution logic.

### 2.3 Parallel Work Opportunities
- **UI Framework & Database Setup:** The UI shell (Electron/Tauri/Web) can be initialized in parallel with the core SQLite schemas.
- **Settings & Notifications:** Can be developed in parallel with core features, as they operate mostly independently of the Note data model.
- **Import/Export & Backup:** Can be developed simultaneously by different teams once the Workspace schema is stable.

---

## 3. Business Rules

- **Critical Path Prioritization:** Resources must be heavily allocated to the Critical Path before assigning engineers to peripheral modules (like Settings or Import/Export).

---

## 4. Acceptance Criteria

- Development teams have a clear understanding of what modules they are blocked by, and what modules they are blocking.

---

## 5. Cross References

- [02-DevelopmentPhases.md](./02-DevelopmentPhases.md)
- [04-DependencyGraph.md](./04-DependencyGraph.md)
