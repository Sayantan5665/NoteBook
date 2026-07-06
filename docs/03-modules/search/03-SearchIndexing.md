> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Search Module
> **Document Owner:** Core Architecture Team

# 03 — Search Indexing

---

## 1. Purpose

This document explains the conceptual philosophy of Search Indexing. It clarifies how information is aggregated from diverse modules into a cohesive, searchable structure without violating ownership boundaries.

## 2. Aggregation Concepts

Search acts as a centralized aggregator. It pulls data from multiple sources to create a unified discovery layer.

### 2.1 Indexing Sources
The Search module conceptually indexes information from:
- **Notes:** Full markdown payloads, frontmatter, and structural blocks.
- **Attachments:** File names, MIME types, and file sizes.
- **OCR Results:** Derived text strings generated from images and PDFs.
- **Tags:** Tag display names and their relationship maps to Notes.
- **Wiki Links:** Note-to-Note relationship graphs and aliases.

## 3. Indexing Strategies

### 3.1 Incremental Indexing
- As the user works, the system listens to granular events (e.g., `NoteSaved`, `OCRCompleted`) and patches the index surgically. This ensures the index remains fresh with minimal CPU overhead.

### 3.2 Full Reindex
- A heavy operation invoked manually or during system migrations. It clears all derived indexes and rebuilds them completely by reading the canonical state of all domain modules.

### 3.3 Index Freshness
- The delay between a canonical change and its reflection in the index. The system aims for near real-time freshness, but conceptually operates on an eventually consistent model.

## 4. Architectural Rules

### 4.1 Derived Indexes
- **Rule:** Indexes are strictly derived artifacts.
- They are a compressed, optimized mathematical representation of the canonical data. 
- They never become canonical data themselves.

### 4.2 Data Ownership Philosophy
- The Search module owns the **Search indexes**, the **index lifecycle**, the concept of **index freshness**, and the orchestration of **index rebuilding**.
- The Search module does **NOT** own the **Indexed Notes**, **Indexed Attachments**, **Indexed OCR Results**, **Indexed Tags**, or **Indexed Wiki Links**.
- **Rule:** Indexes remain strictly derived representations. The indexed entities remain owned exclusively by their respective source modules. The Search module creates a localized, optimized copy of text purely for fast retrieval without asserting ownership over the canonical text.

## 5. Conceptual Index Lifecycle
An index conceptually moves through a defined lifecycle that is entirely independent from the lifecycle of the Notes it represents:

`Index Request` &rarr; `Build` &rarr; `Ready` &rarr; `Refresh` &rarr; `Rebuild` &rarr; `Retired`

- **Independence:** The index lifecycle is decoupled from the Note lifecycle. 
- **Safety:** Index rebuilding never modifies Notebook data.

## 6. Business Rules

- **Zero Canonical Impact:** The Search module can completely rebuild its indexes without altering the state, modification dates, or integrity of the canonical source files.
- **Fault Isolation:** A corrupted index affects only the Search module. It must be solvable by initiating a Full Reindex without requiring a backup restoration of user files.

## 7. Acceptance Criteria

- When an `OCRCompleted` event fires, the Search module intercepts the derived OCR text and injects it into its index, linking it to the parent Attachment UUID.
- A user can manually trigger a Full Reindex from the settings menu; the system successfully wipes the FTS tables and reconstructs them over several seconds, while the user's canonical Notes folder remains completely untouched.
