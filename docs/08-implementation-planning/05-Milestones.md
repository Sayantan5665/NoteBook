# 05 — Milestones

> **Module:** Implementation Planning & Roadmap
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

The Milestones document defines abstract, goal-oriented checkpoints that the project must clear on its path to a Version 1.0 release.

---

## 2. Conceptual Milestones

### M0: Architecture Complete
- All foundational architecture, database schema, and module specifications are approved and frozen.

### M1: Core Features Complete
- Users can create workspaces, write Markdown notes, attach images, and search via FTS. The core local application is completely functional as a basic note-taking tool.

### M2: AI Complete
- Local vector embeddings, RAG context assembly, and Conversation UI are integrated. The application can "talk to the notes" using mock or real LLMs.

### M3: Plugins Complete
- The Plugin Sandbox is operational. Core capabilities can be extended by third-party scripts without compromising security or crashing the host.

### M4: Sync Complete
- CRDT/timestamp-based conflict resolution is implemented. Notes sync across multiple local nodes or a remote repository flawlessly.

### M5: Beta Ready (Feature Freeze)
- All planned V1 features are implemented. Development shifts entirely to bug fixing, performance tuning, and documentation. No new features are accepted.

### M6: Release Candidate
- The application passes all Quality Gates. Installers are generated and tested on clean VMs.

### M7: Version 1.0
- The application is formally released to the public.

---

## 3. Business Rules

- **Milestone Integrity:** A milestone is only achieved when all its criteria are met, tested, and documented. "Almost done" is not done.

---

## 4. Acceptance Criteria

- The project tracker aligns with these conceptual milestones, allowing maintainers to gauge overall progress without relying on arbitrary calendar dates.

---

## 5. Cross References

- [02-DevelopmentPhases.md](./02-DevelopmentPhases.md)
