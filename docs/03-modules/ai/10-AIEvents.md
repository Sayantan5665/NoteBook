> **Document Type:** Module Specification
> **Status:** Frozen
> **Version:** 1.0
> **Depends On:** AI Assistant Module, Embeddings & Retrieval, Search, Notes
> **Document Owner:** Core Architecture Team

# 10 — AI Events

---

## 1. Purpose

This document defines the domain events published and consumed by the AI Assistant module. These events facilitate decoupled coordination between the AI module and the rest of the Notebook ecosystem, enabling other modules to observe AI activity without creating direct dependencies.

## 2. Published Events

The AI Assistant module publishes events describing Conversation, Session, and Response lifecycle transitions. Published events NEVER modify canonical Notebook data. They communicate AI activity to observers.

### 2.1 Conversation Events

- **`ConversationCreated`**: Emitted when the user initiates a new AI Conversation. Observers may use this to update UI conversation lists.
- **`ConversationUpdated`**: Emitted when Conversation metadata changes (e.g., a title is set or renamed).
- **`ConversationArchived`**: Emitted when a Conversation is moved to the archived state.
- **`ConversationDeleted`**: Emitted when a Conversation is permanently removed, along with all its Messages and AI Responses.

### 2.2 Session Events

- **`ChatSessionStarted`**: Emitted when an active Chat Session begins within a Conversation.
- **`ChatSessionEnded`**: Emitted when a Chat Session concludes (user navigates away or closes the panel).

### 2.3 Message and Response Events

- **`MessageSubmitted`**: Emitted when the user submits a User Message, activating the RAG Pipeline.
- **`AIRequestStarted`**: Emitted when the assembled AI Request is dispatched to the configured AI provider.
- **`AIResponseGenerated`**: Emitted when the AI Response is successfully received and stored in the Conversation.
- **`AIResponseCancelled`**: Emitted when the user explicitly cancels an in-progress AI generation.
- **`AIResponseFailed`**: Emitted when the AI provider returns an error or the request times out.

## 3. Consumed Events

The AI Assistant module consumes events from upstream modules to detect changes that may affect retrieval context validity.

- **From Embeddings & Retrieval:** `RetrievalCompleted`, `ContextAssembled`
- **From Search:** `SearchResultsGenerated` *(optionally, for hybrid augmentation)*
- **From Notes:** `NotePermanentDeleted` *(to detect invalidated attribution references)*
- **From Attachments:** `AttachmentDeleted` *(to detect invalidated attribution references)*

## 4. Event Consistency

### 4.1 Observation Only
- The AI Assistant module consumes upstream events purely to observe changes and adapt its behaviour within its own domain.
- Consuming a `NotePermanentDeleted` event does not grant this module any authority over the Note — it is used only to mark prior attribution references as deleted.

### 4.2 Non-Destructive Communication
- Published events NEVER instruct other modules to modify Notebook content.
- A `ConversationDeleted` event communicates AI domain activity only. It MUST NOT cascade into deletion of any canonical Notebook entity.

### 4.3 Failure Isolation
- A failure to publish or consume an event is recorded within the AI module domain only.
- Event failures MUST NOT corrupt canonical Notes, Attachments, OCR Results, Search Indexes, or Embedding stores.

## 5. Business Rules

- **Observation Only:** Consumed events are used to observe upstream changes. They NEVER grant ownership of the observed entities.
- **No Canonical Modification via Events:** Published events NEVER cause other modules to modify user-authored Notebook content.
- **Failure Isolation:** All event failures are isolated to the AI domain.

## 6. Acceptance Criteria

- When `NotePermanentDeleted` is received, the AI module marks all existing Source Attribution references to that Note UUID as referencing a deleted entity — without deleting any Conversation or AI Response.
- When `AIResponseGenerated` is published, any subscribing UI component may update the conversation view without requiring a direct data query, demonstrating clean decoupling.
- A failure to dispatch `ConversationDeleted` does not prevent the user from opening, editing, or saving Notes.
