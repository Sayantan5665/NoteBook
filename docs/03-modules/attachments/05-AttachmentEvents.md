> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Overview
> **Document Owner:** Core Architecture Team

# 05 — Attachment Events

---

## 1. Purpose

This document outlines the domain events published and consumed by the Attachments module. These events facilitate loose coupling with the UI, the Notes module, and background processing systems.

## 2. Event Model

### 2.1 Published Events
These events notify the ecosystem of changes within the Attachment domain.
- **`AttachmentCreated`**: Emitted when a new file is successfully ingested, validated, and assigned a UUID.
- **`AttachmentAttached`**: Emitted when a formal reference link is established between a Note UUID and an Attachment UUID.
- **`AttachmentDetached`**: Emitted when a formal reference link is severed.
- **`AttachmentUpdated`**: Emitted when Attachment metadata (like Display Name) is changed.
- **`AttachmentDeleted`**: Emitted when the binary asset and metadata are permanently destroyed.
- **`AttachmentRestored`**: Emitted when a soft-deleted attachment is recovered.
- **`AttachmentValidationFailed`**: Emitted when a background check detects missing or corrupted binary data.
- **`AttachmentReferenceUpdated`**: Emitted if the underlying storage mechanism changes, requiring the UI to fetch a new presigned URL.

### 2.2 Consumed Events
These events inform the module of external actions that might affect Attachment lifecycles.
- **`NoteTrashed` / `NotePermanentDeleted`**: Consumed to recalculate the reference count for Attachments linked to the deleted Note. If the reference count drops to zero, the Attachment is flagged as an Orphan.
- **`NoteRestored`**: Consumed to increment the reference count for associated Attachments.

## 3. Dependencies and Ordering Philosophy

- **Decoupled Architecture:** The Attachments module does not care if the Search module is listening to `AttachmentCreated` to index a PDF. It simply publishes the event.
- **Ordering Philosophy:** 
  `Binary Uploaded` &rarr; `Validated` &rarr; `Persisted` &rarr; `Publish AttachmentCreated` &rarr; `Note Updated with UUID` &rarr; `Publish AttachmentAttached`.

## 4. Business Rules

- **Event Immutability:** Event payloads containing UUIDs must remain stable. 
- **Reactivity:** Lifecycle state transitions (like moving to an Orphaned state) should be triggered reactively via these events rather than relying solely on expensive scheduled database scans.

## 5. Acceptance Criteria

- Uploading a new PDF emits `AttachmentCreated`, which successfully triggers a background worker in a separate OCR module.
- Permanently deleting a Note emits `NotePermanentDeleted`, which the Attachments module consumes to identify and flag any newly orphaned attachments.
