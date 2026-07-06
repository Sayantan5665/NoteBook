> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Search Module
> **Document Owner:** Core Architecture Team

# 10 — Search Events

---

## 1. Purpose

This document outlines the domain events published and consumed by the Search module. These events facilitate decoupled background processing, ensure index eventual consistency, and notify UI consumers of query status.

## 2. Event Model

### 2.1 Published Events
Search publishes events describing search activities. These events inform the UI and telemetry systems but NEVER mutate canonical Notebook data.
- **`SearchIndexRequested`**: Emitted when a canonical event (e.g., `NoteSaved`) places a task in the indexing queue.
- **`SearchIndexStarted`**: Emitted when a worker begins processing an incremental index update.
- **`SearchIndexCompleted`**: Emitted when an incremental index update successfully patches the index.
- **`SearchIndexFailed`**: Emitted when an index update fails (e.g., malformed data).
- **`SearchIndexRebuilt`**: Emitted when a Full Reindex operation completes successfully.
- **`SearchQueryExecuted`**: Emitted when the engine begins parsing and executing a user query.
- **`SearchResultsGenerated`**: Emitted when a query finishes and transient Result objects are available.
- **`SearchCancelled`**: Emitted when a query or index operation is intentionally aborted.
- **`SearchRefreshRequested`**: Emitted by UI layers asking the engine to re-run the active query due to a detected index change.
- **`SearchRefreshCompleted`**: Emitted when the refresh operation finishes.

### 2.2 Consumed Events
Search acts as a passive consumer of events from producer modules to keep its derived indexes fresh.
- **From Notes:** `NoteSaved`, `NotePermanentDeleted`
- **From Attachments:** `AttachmentCreated`, `AttachmentUpdated`, `AttachmentDeleted`
- **From OCR:** `OCRCompleted`, `OCRResultsUpdated`
- **From Tags:** `TagAssigned`, `TagRemoved`, `TagRenamed`
- **From Wiki Links:** `WikiLinkCreated`, `WikiLinkRemoved`

## 3. Search Event Lifecycle

### 3.1 Event Consistency and Ordering
- **Eventual Consistency:** The Search module guarantees eventual consistency. `SearchIndexCompleted` will eventually fire after `NoteSaved`, but the delay is asynchronous.
- **Idempotency:** The module must handle out-of-order or duplicate events gracefully (e.g., receiving two `NoteSaved` events rapidly should result in a single, correct final index state for that Note UUID).

### 3.2 Event Dependencies
- Search events depend strictly on the success of the upstream modules. An `AttachmentCreated` event must be fully committed by the Attachments module before the Search module attempts to index it.

## 4. Business Rules

- **Observation Only:** Search consumes events from Notes, Attachments, OCR, Tags, and Wiki Links purely to observe changes.
- **No Ownership via Events:** Events never own Search indexes. They merely trigger processes.
- **Non-Destructive Communication:** Search events NEVER instruct other modules to modify Notebook content.

## 5. Acceptance Criteria

- When the OCR module publishes `OCRCompleted`, the Search module consumes it, updates the index, and publishes `SearchIndexCompleted` without altering the canonical OCR Result.
- If a user triggers a Search Query, the system publishes `SearchQueryExecuted` and then `SearchResultsGenerated` milliseconds later, enabling UI loading spinners to behave predictably.
