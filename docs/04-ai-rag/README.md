# AI & RAG Design

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

This module establishes the conceptual architecture for the AI and Retrieval-Augmented Generation (RAG) subsystem within the Notebook application. It defines how artificial intelligence integrates with Notebook knowledge without compromising data privacy, offline capabilities, or the canonical source of truth.

---

## 2. Scope

This specification covers:
- AI Architecture and RAG pipelines.
- Context assembly and prompt construction.
- Conversation memory and model abstractions.
- Strategies for embeddings, retrieval, token budgeting, and citations.
- Future enhancements (agent workflows, reasoning models, etc.).

**Out of Scope:**
- Specific LLM prompt strings or templates.
- Explicit algorithmic definitions for retrieval or ranking.
- Hardcoded integrations with specific commercial AI providers.

---

## 3. Ownership and Responsibilities

- **The AI module owns:** Conversation orchestration, prompt construction, inference coordination, and citation coordination.
- **The AI module does NOT own:** Notes, Workspace, Search, Embeddings, Synchronization, Backup, Import, Export, or Plugins. 

---

## 4. Dependencies

The AI module depends on abstractions provided by:
- **Search Module:** For executing retrieval queries.
- **Embeddings Module:** For semantic vector similarity.
- **Domain Services (Notes/Workspace):** For accessing canonical Notebook entities (read-only during context assembly).

---

## 5. Business Rules

- **Offline-First and Privacy-First:** The architecture must natively support entirely local AI execution.
- **Canonical Truth:** Notebook entities remain the canonical source of truth at all times. Derived AI responses or embeddings never replace user data.
- **Provider Agnostic:** The application depends on abstract model capabilities, not specific providers.
- **Stateless Prompts:** The AI system maintains conversation state explicitly and passes it dynamically; the core storage layer is unaffected by AI chat.

---

## 6. Acceptance Criteria

- The AI module can be completely disabled without affecting the core functionality of the Notebook.
- AI operations (e.g., streaming generation) fail gracefully on network timeouts without corrupting any Domain data.
- Retrieval operations request data via the Search module's public extension points rather than directly querying SQLite.

---

## 7. Cross References

- [01-AIArchitecture.md](./01-AIArchitecture.md)
- [13-AIGovernance.md](./13-AIGovernance.md)
