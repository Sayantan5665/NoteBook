> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Search Module
> **Document Owner:** Core Architecture Team

# 08 — Search Ranking

---

## 1. Purpose

This document outlines the conceptual philosophy of Ranking within the Search module. It dictates how results are prioritized for presentation without prescribing specific mathematical algorithms.

## 2. Ranking Philosophy

Ranking determines the presentation order of Search Results. It ensures the user sees the most conceptually relevant information at the top of the list.

### 2.1 Relevance Philosophy
- Relevance is highly contextual and determines how closely a document matches the user's intent.
- It conceptually weighs factors like term frequency, exact phrase matching, and proximity of keywords.
- Relevance may evolve over time as ranking algorithms improve.
- Ranking criteria may expand as the Notebook ecosystem evolves (e.g., adding metadata fields).
- Future semantic ranking must remain fully backward compatible with core full-text ranking.
- **Rule:** Ranking affects presentation order ONLY. It never modifies Notebook content.

### 2.2 Ranking Consistency & Stability
- Given the exact same search index and the exact same query, the ranking order must be deterministic and stable.
- The rank of a Note should only change if the Note's content changes, the query changes, or the ranking algorithm is intentionally upgraded.

## 3. Conceptual Ranking Influences

While the exact algorithm (e.g., BM25) is an implementation detail, the architecture recognizes the following domains as ranking influences:

### 3.1 Metadata Influence
- A match in the Note's `Title` conceptually scores higher than a match buried deep in the body text.

### 3.2 Tag Influence
- A match against a highly applied Tag might influence the clustering or scoring of associated Notes.

### 3.3 Wiki Link Influence
- A Note possessing hundreds of Backlinks (highly referenced) might be boosted in rank over an orphaned Note, acting as a rudimentary PageRank.

### 3.4 OCR Influence
- Text extracted from OCR is inherently lower confidence than user-typed text. An exact match in a Note should conceptually outrank a fuzzy match in an OCR'd receipt.

### 3.5 Freshness Concepts
- The recency of a Note (`Modified Date`) may act as a tie-breaker or a modifier, gently boosting newer documents over heavily aged ones.

### 3.6 Semantic Influence (Future)
- Future AI Embeddings will influence ranking by scoring conceptual similarity (e.g., searching for "automobile" returning a Note containing "car").

## 4. Business Rules

- **Presentation Only:** Ranking affects presentation order only. It dictates how the Discovery layer sorts the array.
- **Non-Destructive:** Ranking calculations NEVER modify indexed data or canonical Note data.
- **Independence:** Ranking logic is independent of the underlying storage implementation. It operates on the abstracted search index.

## 5. Acceptance Criteria

- A Note titled "Project Meeting" appears higher in the result set than a Note containing the word "meeting" at the very bottom of its body text.
- Adjusting the ranking weight of the `Title` field alters the sort order of the results without modifying any canonical Notebook files.
