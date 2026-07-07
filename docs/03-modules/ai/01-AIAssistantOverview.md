> **Document Type:** Module Specification
> **Status:** Frozen
> **Version:** 1.0
> **Depends On:** Embeddings & Retrieval, Search, Notes
> **Document Owner:** Core Architecture Team

# 01 — AI Assistant Overview

---

## 1. Purpose

This document establishes the conceptual foundation of the AI Assistant within the Notebook ecosystem. It clarifies what the AI Assistant is, what it produces, and the precise boundaries separating it from the canonical data it draws upon.

## 2. Concept

The AI Assistant is a Retrieval-Augmented Generation (RAG) system. It answers user questions and fulfils user requests by:
1. Retrieving semantically relevant context from the user's actual Notebook content.
2. Composing that context into a grounded AI Request.
3. Generating an AI Response that reflects the retrieved content.

**Critical distinction:** The AI Assistant produces derived textual responses. It does not author Notes, does not own Notebook content, and must never modify canonical data without explicit user instruction and confirmation.

## 3. Ownership

- The **AI Assistant module** owns Conversations, Messages, and AI Responses.
- **Rule:** The AI Assistant consumes semantic context. It NEVER owns Notebook content.
- **Rule:** AI Responses are derived artifacts. They NEVER become canonical Notebook data.
- **Rule:** The AI Assistant NEVER modifies Notes, Attachments, or OCR Results automatically.

## 4. AI Assistant Philosophy

### 4.1 Grounded Generation
- The AI Assistant is designed to generate responses grounded in the user's actual Notebook. It retrieves relevant context before generation, anchoring the response to real content rather than relying solely on a model's training data.
- This grounding makes responses more accurate and more personal to the user's Workspace.

### 4.2 Transparency
- AI Responses are clearly marked as AI-generated. They are derived, imperfect artifacts — not authoritative statements.
- Users must be able to trace which Notebook entities contributed to a response (via source UUID references returned with the Context Package).

### 4.3 Non-Destructive by Default
- The AI Assistant operates on a read-only basis with respect to all canonical Notebook modules.
- Any action that would modify Notebook content (e.g., writing an AI-suggested paragraph into a Note) requires explicit, deliberate user authorization. It MUST NOT happen automatically.

### 4.4 AI Request Identity
It is critical to distinguish the conceptual identities that participate in an AI Request:
- **User Message:** Represents the user's explicit intent or question submitted to the AI Assistant.
- **Context Package:** Represents the retrieved supporting information gathered from canonical Notebook entities.
- **Prompt Assembly:** The process that prepares the complete, structured request by combining the User Message, Conversation History, and Context Package.
- **AI Request:** The final, derived input submitted to an AI provider. It is transient and has no persistence of its own.
- **AI Response:** A derived textual artifact generated from the AI Request. It is stored within the Conversation, never within a Note.

Each concept has its own distinct responsibility and lifecycle within the RAG pipeline.

## 5. AI Assistant Capabilities

The AI Assistant offers the following conceptual capabilities. These are owned by the AI Assistant module. The underlying modules they depend on (Search, Embeddings, Notes) remain independent.

- **Conversational Q&A:** Answering natural-language questions using retrieved Notebook content.
- **Summarization:** Producing derived summaries of Notes, search results, or content collections.
- **Topic Exploration:** Helping users discover related concepts across their Notebook through dialogue.
- **Future: Writing Assistance:** Suggesting content edits or completions in the Editor, subject to explicit user acceptance before any Note is modified.
- **Future: Autonomous Actions:** AI-driven multi-step tasks, always subject to explicit user authorization per action.

## 6. AI Assistant Consumers

Consumers are the modules or UI contexts that interact with the AI Assistant:
- **Chat UI:** The primary interface — a conversational panel where users submit messages and receive AI Responses.
- **Editor (Future):** In-line AI writing assistance within the Note editing surface.
- **Command Palette (Future):** Quick AI actions (e.g., "Summarize this Note") triggered without a full conversation.

**Rule:** AI Assistant outputs (Responses) are consumed by UI. They do not propagate back to modify canonical modules.

## 7. Business Rules

- **Strict Separation:** The AI Assistant's knowledge of Notebook content comes exclusively via the Retrieval Pipeline. It has no direct access to the canonical database.
- **Response Derivation:** Every AI Response is explicitly categorized as derived. It may contain errors, misinterpretations, or hallucinations and must be treated as advisory, not authoritative.
- **Idempotency:** Regenerating an AI Response for the same Message and Context Package may produce a different result. This is expected behaviour, not a bug.
- **Failure Isolation:** An AI provider failure MUST NOT cascade to prevent the user from accessing, editing, or creating Notes.

## 8. Acceptance Criteria

- The user asks "Summarize my meeting notes from last week" and receives an AI Response grounded in retrieved Note fragments, with source Note UUIDs referenced, without any modification to the source Notes.
- An AI Response marked as "Summarized from 3 Notes" can be discarded by the user without affecting any of the 3 source Notes.
- The AI Assistant is completely disabled or offline, and the user continues to create, edit, and save Notes without any interruption.
