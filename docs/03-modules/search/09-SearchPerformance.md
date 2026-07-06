> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Search Module
> **Document Owner:** Core Architecture Team

# 09 — Search Performance

---

## 1. Purpose

This document outlines the performance, scalability, and recovery philosophies of the Search module. It ensures the system remains highly responsive in large workspaces while strictly safeguarding canonical data.

## 2. Performance Philosophy

Performance optimizations exist to make discovery instantaneous. However, optimizations must never compromise data correctness or system stability.

### 2.1 Concurrency Concepts
- Indexing and Querying are conceptually concurrent. A user must be able to execute a Search Query simultaneously while a background Index Update is processing a newly saved Note.
- Read operations (Queries) must not be blocked by write operations (Indexing).

### 2.2 Incremental Updates
- The system prioritizes surgical, incremental updates (patching only the Note that changed) over full table scans to minimize CPU and disk I/O overhead.

### 2.3 Index Freshness
- The system accepts an "Eventually Consistent" model to guarantee Editor performance. When a Note is saved, the Editor immediately regains control, while the Search Index updates milliseconds later in the background.

## 3. Scalability Principles

### 3.1 Large Workspace Behaviour
- The module must maintain stable query execution times even when the Workspace contains 100,000 Notes.
- This is conceptually achieved through paginated queries, index chunking, and memory-bound result limits (e.g., halting the query after finding 1,000 matches).

### 3.2 Resource Management
- Full Reindex operations are resource-intensive. They should yield to foreground UI tasks, ensuring the application does not freeze while rebuilding the database.

## 4. Stability and Recovery

### 4.1 Cancellation
- Heavy queries or deep indexing jobs must be cancellable. If the user rapidly deletes their search string, the execution thread must abort gracefully to free resources.

### 4.2 Recovery and Rebuild Philosophy
- **Disposable Artifacts:** Because search indexes are strictly derived, the ultimate recovery strategy for a corrupted index is simply to delete it and invoke a Full Rebuild.
- **Safe Failures:** Search failures (e.g., an Out of Memory error during indexing) affect ONLY discovery. They never corrupt Notebook data (Notes, Attachments, OCR Results, Tags, Wiki Links, or Editor content). The canonical source remains perfectly safe on the filesystem.

## 5. Business Rules

- **Correctness First:** Performance optimizations preserve correctness. A fast query that returns missing data is a failure.
- **Data Safety:** Performance failures, timeouts, and index corruption NEVER cascade to destroy canonical data.
- **AI Independence:** Search performance logic remains independent from AI processing overhead.
- **Storage Independence:** Search remains conceptually independent from the raw storage implementation (e.g., local disk vs S3).

## 6. Acceptance Criteria

- Creating 10,000 Notes programmatically queues 10,000 incremental index updates without crashing the application or locking the UI thread.
- Force-quitting the application mid-way through a Full Reindex leaves the canonical Markdown files untouched. Upon restart, the Search module detects the incomplete index and restarts the build.
