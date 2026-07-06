> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# Attachments Module

---

## 1. Purpose

The Attachments module manages all binary assets and files associated with Notes in the Notebook application. It ensures files are tracked, validated, and served efficiently without polluting the core Note domain with binary data.

## 2. Scope

**This document covers:**
- Attachment identity, lifecycle, and metadata.
- Relationships between Notes and Attachments.
- Event models and validation philosophy.

**This document does NOT cover:**
- Storage layer implementations (e.g., local filesystem, AWS S3).
- Rich text rendering or Editor behavior.
- OCR or AI processing implementations.
- Search indexing.

## 3. Responsibilities

- **Identity Management:** Issuing and tracking immutable UUIDs for binary assets.
- **Metadata Management:** Tracking file types, sizes, checksums, and original names.
- **Lifecycle Tracking:** Ensuring files are safely attached, detached, and eventually garbage-collected.

## 4. Ownership and Boundaries

- **Ownership:** This module owns the Attachment domain completely.
- **Boundaries:** Notes reference Attachments. Attachments NEVER own Notes. Binary content is conceptually and physically independent from the Note's text payload.

## 5. Dependencies

- **Notes Module:** The Attachments module must observe Note lifecycles to understand when an attachment is orphaned.
- **Storage Subsystem:** (Conceptual) The module relies on an underlying persistence mechanism to read/write bytes, though it abstracts this from the rest of the application.

## 6. Interfaces and Events

### 6.1 Consumed Interfaces
- None directly. The module provides interfaces to the Editor/Notes modules.

### 6.2 Published Events
- `AttachmentCreated`
- `AttachmentAttached`
- `AttachmentDetached`
- `AttachmentUpdated`
- `AttachmentDeleted`
- `AttachmentRestored`
- `AttachmentValidationFailed`

### 6.3 Consumed Events
- `NoteTrashed` / `NotePermanentDeleted` (Triggers reference checks for orphan detection)
- `NoteSaved` (May trigger `AttachmentAttached` if a new reference is found)

## 7. Extension Points

- OCR processing.
- Thumbnail generation and Media Previews.
- External Storage Providers (e.g., Google Drive integration).

## 8. Settings

- `AutoCleanOrphans`: Whether to automatically delete unreferenced attachments or keep them indefinitely.
- `MaxFileSize`: Configurable constraints on asset ingestion.

## 9. Business Rules

- **Immutable Identity:** Attachments are issued a UUID at creation which never changes.
- **Referential Integrity:** Notes reference Attachments via their UUIDs.
- **Independent Binary:** The binary content is managed entirely separately from the Note payload.
- **N:M Relationship (Future):** Multiple Notes may eventually reference the exact same Attachment UUID.

## 10. Acceptance Criteria

- An image dropped into the Editor results in a distinct Attachment UUID managed by this module, with the Note holding only the reference string.
- Deleting the text reference in the Note does not immediately destroy the binary asset.

## 11. Cross References

- [01-AttachmentOverview.md](./01-AttachmentOverview.md)
- [02-AttachmentLifecycle.md](./02-AttachmentLifecycle.md)
- [03-AttachmentMetadata.md](./03-AttachmentMetadata.md)
- [04-AttachmentValidation.md](./04-AttachmentValidation.md)
- [05-AttachmentEvents.md](./05-AttachmentEvents.md)
- [06-ExtensionPoints.md](./06-ExtensionPoints.md)
