# 01 — Architecture Principles

> **Module:** Development Standards
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

This document outlines the non-negotiable architectural principles that every implementation must follow. These principles ensure the Notebook application remains robust, scalable, and true to its core philosophy.

---

## 2. Core Principles

### 2.1 Offline-First & Local-First
- The application must function completely without an internet connection.
- All canonical data is stored locally. Network features (like sync or remote AI models) are strict opt-ins and must gracefully degrade when unavailable.

### 2.2 Privacy-First
- User data never leaves the local device unless explicitly authorized (e.g., syncing to a user's personal cloud or sending a prompt to a remote AI API).
- There is no telemetry, tracking, or centralized user account system managed by the core team.

### 2.3 Modular Architecture
- The system is composed of strictly bounded modules (e.g., Notes, Workspace, Search, Settings).
- Modules communicate exclusively through public interfaces (Domain Services or Events).

### 2.4 Single Responsibility & Dependency Inversion
- Classes, functions, and modules must have a single reason to change.
- High-level policy must not depend on low-level details. Both must depend on abstractions (interfaces/contracts).

### 2.5 Canonical Source of Truth
- Notebook entities (Notes, Attachments, Folders) are the absolute source of truth.
- Derived data (Embeddings, Backlinks, Search Indexes, AI Context Packages) can be safely deleted and regenerated from the canonical source at any time.

### 2.6 Event-Driven Communication
- Cross-module communication that does not require immediate synchronous responses must be handled via domain events (e.g., `NoteCreated`, `NoteDeleted`).
- This minimizes tight coupling between unrelated domains.

### 2.7 Stable Ownership Boundaries
- A module completely owns its domain. For example, the Synchronization module orchestrates sync, but it never owns or defines what a "Note" is.

### 2.8 Architecture Decision Philosophy
- Architectural changes follow a formal Architecture Decision Record (ADR) process.
- Implementation must strictly follow the approved architecture.
- Architecture is never silently changed during implementation.

---

## 3. Business Rules

- **Zero Coupling Across Boundaries:** Modules must not directly query another module's database tables.
- **Fail-Safe Derived Data:** Failure to generate derived data (e.g., an embedding generation failure) must not block the saving of canonical data.

---

## 4. Acceptance Criteria

- Code reviews verify that no direct references cross bounded contexts without using an abstracted interface or event.

---

## 5. Cross References

- [02-CodingStandards.md](./02-CodingStandards.md)
- [03-ProjectStructure.md](./03-ProjectStructure.md)
