> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Embeddings, Search, Notes, Attachments, OCR, Tags, Wiki Links
> **Document Owner:** Core Architecture Team

# 07 — Embedding Events

---

## 1. Purpose

This document defines the domain events published and consumed by the Embeddings & Retrieval module. These events facilitate decoupled background processing, coordinate lifecycle transitions, and notify downstream consumers without violating canonical data ownership.

## 2. Published Events

The module publishes events describing embedding generation and retrieval activities. These events inform UI components, telemetry systems, and downstream AI consumers but NEVER mutate canonical Notebook data.

### 2.1 Embedding Lifecycle Events

- **`EmbeddingGenerationRequested`**: Emitted when a canonical event (e.g., `NoteSaved`) triggers an Embedding Request for a specific entity UUID.
- **`EmbeddingGenerationStarted`**: Emitted when an Embedding Job transitions from queued to active processing.
- **`EmbeddingGenerated`**: Emitted when a semantic vector is successfully produced and stored for an entity.
- **`EmbeddingGenerationFailed`**: Emitted when a generation attempt fails (e.g., provider timeout, malformed content).
- **`EmbeddingRegenerated`**: Emitted when an existing embedding is successfully replaced by a fresh one (e.g., after a model upgrade or a significant content change).
- **`EmbeddingDeleted`**: Emitted when an embedding artifact is garbage collected, typically following a `NotePermanentDeleted` or `AttachmentDeleted` event from a canonical module.
- **`EmbeddingRebuildStarted`**: Emitted when a full embedding store rebuild operation begins.
- **`EmbeddingRebuildCompleted`**: Emitted when the full rebuild operation finishes successfully.

### 2.2 Retrieval Lifecycle Events

- **`RetrievalRequested`**: Emitted when a consumer submits a Retrieval Request to the pipeline.
- **`RetrievalStarted`**: Emitted when the pipeline begins active processing of the request.
- **`RetrievalCompleted`**: Emitted when the pipeline delivers a Retrieval Result Set to the consumer.
- **`RetrievalFailed`**: Emitted when the pipeline cannot complete (e.g., embedding store unavailable).
- **`ContextAssembled`**: Emitted when a Context Package has been successfully assembled from the Retrieval Result Set and is ready for the downstream consumer.

## 3. Consumed Events

The module acts as a passive consumer of events from producer modules, using them to drive lifecycle transitions within its own domain.

- **From Notes:** `NoteSaved`, `NotePermanentDeleted`
- **From Attachments:** `AttachmentCreated`, `AttachmentDeleted`
- **From OCR:** `OCRCompleted`, `OCRResultsUpdated`
- **From Tags:** `TagAssigned`, `TagRemoved`
- **From Wiki Links:** `WikiLinkCreated`, `WikiLinkRemoved`
- **From Search:** `SearchIndexCompleted` *(consumed optionally, to trigger hybrid retrieval alignment)*

## 4. Event Consistency and Ordering

### 4.1 Eventual Consistency
- The module guarantees eventual consistency. `EmbeddingGenerated` will eventually fire after `NoteSaved`, but the gap is asynchronous.
- Retrieval queries executed during this window may reflect slightly older embeddings. This is an expected, documented trade-off.

### 4.2 Idempotency
- The module handles duplicate or out-of-order events gracefully. Receiving two `NoteSaved` events for the same Note UUID rapidly must result in a single, correct final embedding — not two duplicate vectors.

### 4.3 Event Dependencies
- The module waits for the upstream event to be fully committed by its owning module before acting on it. For example, an `OCRCompleted` event must represent a fully persisted OCR Result before the module attempts to embed the extracted text.

## 5. Business Rules

- **Observation Only:** The module consumes events from Notes, Attachments, OCR, Tags, and Wiki Links purely to observe changes and act within its own domain.
- **No Ownership via Events:** Events NEVER grant ownership over the entities they describe. Consuming a `NoteSaved` event does not give this module any authority over the Note.
- **Non-Destructive Communication:** Published events NEVER instruct other modules to modify Notebook content.
- **Event Isolation:** A failure to process a consumed event (e.g., `NoteSaved` triggers a failed embedding job) is recorded within this module only. It NEVER propagates a failure back to the Notes module or prevents subsequent Note operations.

## 6. Acceptance Criteria

- When `OCRCompleted` is published by the OCR module, the Embeddings & Retrieval module consumes it, queues an Embedding Request for the extracted text, and eventually publishes `EmbeddingGenerated` — without altering the canonical OCR Result.
- A `RetrievalCompleted` event enables UI consumers to update loading indicators predictably, demonstrating clean decoupling between pipeline execution and UI state.
- A failed embedding generation publishes `EmbeddingGenerationFailed` without causing a corresponding failure in the Notes module, confirming failure isolation.
