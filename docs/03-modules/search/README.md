> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes, Attachments, Tags, OCR, Wiki Links
> **Document Owner:** Core Architecture Team

# Search Module

---

## 1. Purpose

The Search module provides powerful, centralized discovery capabilities across the entire Notebook ecosystem. It enables users to instantly find Notes, Tags, Attachments, and extracted text via a unified indexing and querying mechanism.

## 2. Scope

**This document covers:**
- Search concepts and query philosophies.
- Search indexing philosophy and aggregation of data from other modules.
- The lifecycle of search requests and background index updates.
- Validation and error handling within the search domain.

**This document does NOT cover:**
- Ranking algorithms (e.g., TF-IDF, BM25).
- SQLite FTS5 implementation details.
- Vector search or `sqlite-vec` implementations.
- AI, Embeddings, or conversational search.
- Synchronization or Backup mechanics.

## 3. Responsibilities

- **Indexing:** Consuming events from other modules to build and maintain derived searchable artifacts (indexes).
- **Querying:** Accepting user or system queries and returning relevant result pointers.
- **Lifecycle Management:** Orchestrating incremental index updates and full reindexes.
- **Validation:** Ensuring queries are structurally valid before execution.

## 4. Ownership and Boundaries

- **Ownership:** This module owns the Search concepts, the queries, the indexes, and the search results.
- **Boundaries:** 
  - Search discovers information; it NEVER owns information.
  - Search indexes are derived artifacts.
  - Search NEVER modifies Notes, Attachments, Tags, OCR Results, or Wiki Links.

## 5. Dependencies

The Search module is a top-level consumer. It depends on virtually every domain module to supply indexable content:
- **Notes Module:** Text payloads.
- **Attachments Module:** Metadata and file names.
- **OCR Module:** Extracted text from images.
- **Tags Module:** Tag UUIDs and display names.
- **Wiki Links Module:** Link structures and backlink graphs.

## 6. Interfaces and Events

### 6.1 Consumed Interfaces
- Provides an API/interface for the UI and other modules to submit search queries and trigger manual reindexes.

### 6.2 Published Events
- `SearchIndexUpdated`
- `SearchReindexStarted`
- `SearchReindexCompleted`
- `SearchReindexFailed`

### 6.3 Consumed Events
- `NoteSaved` / `NotePermanentDeleted`
- `AttachmentCreated` / `AttachmentUpdated` / `AttachmentDeleted`
- `OCRCompleted` / `OCRResultsUpdated`
- `TagAssigned` / `TagRemoved` / `TagRenamed`
- `WikiLinkCreated` / `WikiLinkRemoved`

## 7. Extension Points

- AI Semantic Search (Embeddings).
- Natural Language Query Parsing.
- Advanced Query Syntax (e.g., boolean operators, regex).
- Federated Search (searching external providers like Google Drive).

## 8. Settings

- Reindex triggers (automatic vs manual).
- Index freshness thresholds (how long to wait before batching updates).

## 9. Business Rules

- **Ownership:** Search owns its derived indexes, but nothing else.
- **Consumer:** Search strictly consumes data from other modules.
- **Non-Destructive:** Search NEVER modifies canonical data like Notes.
- **Derived Artifacts:** Search indexes are inherently derived. They can be deleted and entirely rebuilt at any time.
- **Safe Failures:** A failure in the Search module (e.g., corrupted index) MUST NOT corrupt any canonical data or prevent the user from editing Notes.

## 10. Acceptance Criteria

- When a user types a word into a Note, the Search index eventually updates in the background, making the word discoverable without altering the Note's original Markdown payload.
- Deleting the entire search index database file does not result in the loss of a single Note; the system gracefully falls back to queuing a full Reindex.

## 12. Cross References

- [01-SearchOverview.md](./01-SearchOverview.md)
- [02-SearchLifecycle.md](./02-SearchLifecycle.md)
- [03-SearchIndexing.md](./03-SearchIndexing.md)
- [04-SearchQueries.md](./04-SearchQueries.md)
- [05-SearchFilters.md](./05-SearchFilters.md)
- [06-SearchDiscovery.md](./06-SearchDiscovery.md)
- [07-SearchResults.md](./07-SearchResults.md)
- [08-SearchRanking.md](./08-SearchRanking.md)
- [09-SearchPerformance.md](./09-SearchPerformance.md)
- [10-SearchEvents.md](./10-SearchEvents.md)
- [11-ExtensionPoints.md](./11-ExtensionPoints.md)
- [12-SearchGovernance.md](./12-SearchGovernance.md)
