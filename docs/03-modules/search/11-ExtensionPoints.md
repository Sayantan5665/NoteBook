> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Search Module
> **Document Owner:** Core Architecture Team

# 11 — Extension Points

---

## 1. Purpose

This document outlines the extensibility of the Search module. It scopes how future capabilities, external providers, and AI enhancements can plug into the discovery pipeline.

## 2. Future Capabilities

### 2.1 Advanced Search Paradigms
- **Semantic Search:** Moving beyond exact keyword matching to conceptual matching using Vector Search.
- **Hybrid Search:** Blending traditional full-text ranking (BM25) with Semantic Vector ranking for optimal relevance.
- **Natural Language Search:** Allowing conversational queries (e.g., "Find notes from last Tuesday containing receipts").

### 2.2 User Productivity Enhancements
- **Saved Searches:** Persisting complex queries (with filters) to act as dynamic virtual folders.
- **Search Profiles:** User-defined ranking weights (e.g., a "Developer Profile" that heavily weights Code Block matches over plain text matches).

### 2.3 Provider Enhancements
- **Plugin Search Providers:** Allowing third-party plugins to inject their own specialized indexes into the Global Search UI.
- **External Search Providers:** Federated search integrating results from external platforms (e.g., Google Drive, Jira) alongside Notebook results.
- **Workspace Search:** Extending the index to search across multiple independent Workspaces simultaneously.

### 2.4 AI and Graph Enhancements
- **Knowledge Graph Integration:** Querying based on the spatial relationship of Wiki Links (e.g., finding Notes two hops away from a specific topic).
- **Future AI-Assisted Search:** Using LLMs to synthesize a conversational answer from the top 5 Search Results (RAG pattern).

## 3. Business Rules

- **Augmentation, Not Replacement:** Extension points extend Search capabilities. They must not replace or break the foundational Full-Text search.
- **Backward Compatibility:** Existing Search behaviour (syntax, filters, events) must remain completely backward compatible as new capabilities are introduced.
- **Strict Boundaries:** Regardless of the extension (e.g., AI-Assisted Search), ownership boundaries remain unchanged. AI enhancements must consume Search Results as derived data and NEVER modify the canonical Notes.

## 4. Acceptance Criteria

- A future "External Provider Plugin" can successfully return Jira tickets into the Global Search UI without requiring any modifications to the core SQLite FTS5 database schema.
- Implementing Semantic Vector Search operates entirely parallel to the existing Full-Text index, preserving the ability for users to perform exact boolean queries.
