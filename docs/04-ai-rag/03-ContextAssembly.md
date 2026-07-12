# 03 — Context Assembly

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Context Assembly document defines how disparate pieces of retrieved information are packaged into a unified, ephemeral payload suitable for consumption by an AI model.

---

## 2. Conceptual Identities

- **Context Request:** The initial demand for background information, driven by the user's prompt.
- **Candidate Chunks:** The raw, unformatted fragments of text returned by the Search module in response to a Context Request.
- **Context Assembly:** The process of filtering, formatting, and joining Candidate Chunks into a cohesive block.
- **Context Package:** The final, structured, ephemeral artifact produced by Context Assembly. It contains the exact text and metadata that will be injected into the prompt.
- **Context Consumer:** The downstream process (Prompt Construction) that reads the Context Package.

---

## 3. Context Package Lifecycle & Ephemeral Nature

- **Transformation:** Candidate Chunks are transformed into a Context Package.
- **Purpose:** The Context Package exists solely for prompt construction.
- **Lifecycle:** After prompt construction, it remains an ephemeral derived artifact. Context Packages never become Notebook entities.
- **Regeneration:** They may be regenerated at any time from the canonical source. If the application crashes during assembly, the package is lost, but no Notebook data is affected.

---

## 4. Business Rules

- **Context Assembly does not alter canonical data.**
- **Context Packages are strictly read-only for downstream consumers.**
- **Notebook entities remain the canonical source of truth.**

---

## 5. Workflow

1. The RAG Pipeline issues a Context Request.
2. The Search module provides Candidate Chunks.
3. The Context Assembly process formats these chunks (e.g., adding XML tags or Markdown headers for model readability).
4. A Context Package is yielded to the Prompt Construction phase.

---

## 6. Acceptance Criteria

- The Context Package clearly delineates boundaries between different Candidate Chunks so that the AI model can attribute citations accurately.
- No Context Package is ever written to the canonical SQLite database.

---

## 7. Cross References

- [04-PromptConstruction.md](./04-PromptConstruction.md)
- [09-TokenBudgeting.md](./09-TokenBudgeting.md)
