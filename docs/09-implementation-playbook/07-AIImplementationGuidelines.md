# 07 — AI Implementation Guidelines

> **Module:** Implementation Playbook
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The AI Implementation Guidelines dictate how the AI and Retrieval-Augmented Generation (RAG) subsystems are safely integrated into the application without violating the privacy-first architecture.

---

## 2. Implementation Rules

### 2.1 Respecting Architecture
- AI logic resides strictly in its own module. The `Notes` module does not know the AI exists. The AI queries the `Search` module to retrieve context.

### 2.2 Prompt Construction
- Prompts must be constructed deterministically using templates.
- Context Packages must be explicitly bounded to prevent token budget overflows.

### 2.3 Retrieval & Citation
- The AI must never generate responses based on "hidden" data. Every chunk of text provided to the AI must be traceable back to a specific user Note.
- Citations must be parsed from the AI's response and surfaced in the UI.

### 2.4 Privacy
- **Strict Opt-In:** Implementation must ensure that no network call to a remote LLM provider occurs unless the user has explicitly enabled remote AI features and provided an API key.

### 2.5 Provider Abstraction
- The core AI logic must never depend directly on the OpenAI SDK, Anthropic SDK, or local Llama.cpp implementations.
- All LLM interactions must occur through an abstract `IModelProvider` interface, allowing providers to be swapped seamlessly.

---

## 3. Responsibilities

- **AI Team:** Implement the provider abstractions and ensure context assembly strictly adheres to token limits.

---

## 4. Business Rules

- **Zero Data Leakage:** The AI implementation must scrub or prevent context assembly if it detects tags marked as explicitly private by the user (if such a feature exists).

---

## 5. Acceptance Criteria

- The AI orchestration logic can be fully unit-tested by injecting a Mock Model Provider that returns hardcoded responses, verifying citations and prompt construction without internet access.

---

## 6. Cross References

- [04-ai-rag/README.md](../04-ai-rag/README.md)
