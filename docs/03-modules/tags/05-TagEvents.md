> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Tags Module Overview
> **Document Owner:** Core Architecture Team

# 05 — Tag Events

---

## 1. Purpose

This document outlines the domain events published and consumed by the Tags module. These events facilitate loose coupling with the UI, Search indices, and the Notes module.

## 2. Event Model

### 2.1 Published Events
These events notify the ecosystem of changes within the Tag domain.
- **`TagCreated`**: Emitted when a new Tag UUID is minted.
- **`TagRenamed`**: Emitted when the textual display name of a UUID changes. (UI components listen to this to update sidebars globally).
- **`TagAssigned`**: Emitted when a formal relationship is established between a Note UUID and a Tag UUID.
- **`TagRemoved`**: Emitted when a relationship is severed.
- **`TagMerged`**: Emitted when one Tag is absorbed by another, forcing listeners to update their references.
- **`TagDeleted`**: Emitted when a Tag UUID is permanently destroyed.
- **`TagRestored`**: Emitted when a Tag UUID is recovered from the Trash.

### 2.2 Consumed Events
These events inform the module of external actions that affect Tag relationships.
- **`NoteSaved`**: The Notes module or Editor signals a payload change. The Tags module may parse this payload to detect newly typed tags or removed tags, subsequently emitting `TagAssigned` or `TagRemoved`.
- **`NotePermanentDeleted`**: The module consumes this to eagerly clean up orphaned relationships in the join table/graph.

## 3. Dependencies and Ordering Philosophy

- **Decoupled Architecture:** The Tags module does not care if the Search module is listening to `TagAssigned`. It simply publishes the truth of the relationship graph.
- **Ordering Philosophy:** 
  `NoteSaved` &rarr; `Parse Payload` &rarr; `Detect Delta` &rarr; `Publish TagAssigned/Removed`.

## 4. Business Rules

- **Idempotency:** Assigning an already assigned Tag to a Note must not emit duplicate `TagAssigned` events.

## 5. Acceptance Criteria

- Renaming a Tag from the central Tag Manager UI emits a `TagRenamed` event, which the active Editor canvas consumes to instantly update the visible pill text without requiring a page refresh.
- Permanently deleting a Note emits `NotePermanentDeleted`, which the Tags module consumes to clean up the underlying relationship edges.
