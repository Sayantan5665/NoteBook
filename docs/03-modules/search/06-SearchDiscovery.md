> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Search Module
> **Document Owner:** Core Architecture Team

# 06 — Search Discovery

---

## 1. Purpose

This document defines the conceptual workflows for Discovery within the Notebook. It outlines how user-facing features consume the core Search module to help users locate information efficiently.

## 2. Discovery Concepts

Discovery encompasses the various UI workflows and system features that surface information to the user.

### 2.1 Contextual Discovery
- **Quick Search:** A fast, ephemeral omnibar (like Spotlight) used for instant navigation to a Note title or recent file.
- **Global Search:** A dedicated, robust view supporting complex queries, filters, and paginated result lists.
- **Context Search:** Searching only within the specific Note currently open in the Editor.

### 2.2 Relational Discovery
- **Related Notes:** Surfacing notes that share similar Tags, Folder locations, or Wiki Link structures.
- **Suggested Results:** Offering proactive links or content blocks before the user even finishes typing their query.

### 2.3 Historical Discovery
- **Recent Results:** Displaying previously opened or recently modified Notes as default options when the search bar is focused.
- **Popular Results (Future):** Surfacing Notes based on high interaction frequency.

## 3. Edge Cases

### 3.1 Empty Results
- When a query yields zero hits, the Discovery layer is responsible for graceful degradation. It should suggest altering filters, checking spelling, or offering to create a new Note with the query title.

## 4. Business Rules

- **Consumer Only:** Discovery consumes Search. Discovery NEVER owns Search logic, nor does it own the underlying Notes or Indexes.
- **Presentation Logic:** The Discovery layer (typically UI/UX components) decides *how* to present the data (highlighting, snippets, ordering), while the Search module simply provides the raw UUIDs and metadata.

## 5. Acceptance Criteria

- When a user opens Quick Search and types "Alpha", the Discovery layer calls the Search module, receives 5 Note UUIDs, and renders them in a dropdown menu.
- If the Search module returns 0 results, the Discovery layer displays an "Empty Results" state and a "Create New Note: Alpha" button.
