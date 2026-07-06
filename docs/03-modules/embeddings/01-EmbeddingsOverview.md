> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes, Attachments, OCR, Tags, Wiki Links
> **Document Owner:** Core Architecture Team

# 01 — Embeddings Overview

---

## 1. Purpose

This document establishes the conceptual foundation of the Embeddings capability within the Notebook ecosystem. It defines what embeddings are, what they represent, and the strict boundaries governing their relationship with canonical data.

## 2. Concept

An embedding is a derived numeric representation of a piece of text. It encodes the semantic meaning of that text into a mathematical vector, enabling the system to measure conceptual proximity between two pieces of content without relying on exact keyword overlap.

For example, a Note discussing "annual budget review" and a Note discussing "yearly financial planning" may contain entirely different words but reside in very close proximity in the conceptual semantic space — a proximity that embeddings can capture.

## 3. Ownership

- The **Embeddings & Retrieval module** owns the derived embedding vectors and their lifecycle.
- **Rule:** Embeddings represent Notebook entities. Embeddings NEVER replace Notebook entities.
- **Rule:** Notebook entities remain the canonical source of truth at all times.
- **Rule:** Embeddings are derived semantic representations. They NEVER become canonical Notebook data.
- **Rule:** Embeddings NEVER own Notes, Attachments, OCR Results, Tags, or Wiki Links.

## 4. Embedding Philosophy

### 4.1 Derived Nature
- Embeddings are derived entirely from canonical text sources. They describe content but do not define it.
- If an embedding store is lost or corrupted, it can be fully rebuilt by re-processing the canonical text. No user-authored information is lost.

### 4.2 Semantic Representation
- An embedding preserves the meaning of the source text, not its exact wording.
- Embeddings enable discovery by conceptual similarity — supplementing the keyword-based discovery provided by the Search module.

### 4.3 Independence
- Embeddings exist as an independent semantic layer. They do not alter, annotate, or append to the source Notes, Attachments, or OCR Results they are derived from.

### 4.4 Embedding Identity Philosophy
It is critical to distinguish the conceptual identities within the Embeddings domain:
- **Embedding Request:** Initiates semantic representation generation for a specific canonical entity. It records the source entity UUID and the intended provider.
- **Embedding Generation:** The processing activity of reading the source text and producing a semantic vector. Generation is transient and leaves no trace on the source entity.
- **Embedding:** The derived semantic representation of a Notebook entity. It describes meaning without defining or replacing the entity itself.
- **Embedding Version:** A label attached to an Embedding indicating which model generation produced it. Versioning allows safe regeneration when models evolve, preserving entity identity throughout.
- Each concept has a distinct responsibility and lifecycle. The identity of the source entity (e.g., Note UUID) remains entirely independent from the Embedding identity across all versions.

## 5. Embedding Providers

The architecture conceptually supports multiple Embedding Providers. A provider is a service (local or remote) that accepts text and returns a semantic vector. The module abstracts over provider specifics to ensure the rest of the system remains provider-agnostic.

Examples of provider categories (conceptual, not prescriptive):
- **Local Providers:** Operate entirely on-device, preserving privacy.
- **Cloud Providers:** Operate via external API, potentially offering higher quality vectors.

The module is responsible for managing the provider boundary, not for implementing the provider itself.

## 6. Embedding Consumers

Consumers are the modules or capabilities that utilize embeddings:
- **Retrieval Pipeline:** The primary consumer, using embeddings to rank candidates for AI context.
- **Related Notes Discovery:** Surfacing semantically similar Notes to the user.
- **Search Module (Future):** Hybrid Search combining keyword and semantic scores.
- **AI Module (Future):** AI assistants using retrieval results as grounded context.

## 7. Retrieval Capabilities

Embeddings & Retrieval exposes capabilities consumed by downstream modules. These are NOT responsibilities owned by this module itself.
- **AI Chat:** Supplying grounded context to conversational AI features.
- **Summarization:** Providing relevant content fragments to summarization pipelines.
- **Related Notes:** Surfacing semantically proximate Notes to the active editor.
- **Semantic Discovery:** Enabling conceptual search beyond keyword matching.
- **Recommendation:** Suggesting related content proactively.
- **Future AI Agents:** Supplying contextual memory to autonomous AI workflows.

## 8. Business Rules

- **Strict Isolation:** Embeddings operate on a read-only basis with respect to source content.
- **Eventual Consistency:** An embedding will eventually reflect the current state of a Note, but there may be a brief window after saving where the embedding represents an older version of the text.
- **Integrity:** Generating an embedding for a Note must not trigger a `NoteSaved` event or update the Note's modification timestamp.

## 9. Acceptance Criteria

- A Note containing the phrase "quarterly earnings" has an embedding generated from its text payload without altering the Note's Markdown content or modification date.
- Searching semantically for "financial performance" successfully surfaces the Note about "quarterly earnings" via retrieval, confirming the embedding captured conceptual proximity.
- Deleting the entire embedding store leaves all canonical Notes, Attachments, and OCR Results completely intact.
