> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 01 — Attachment Overview

---

## 1. Purpose

This document establishes the conceptual foundation of Attachments in the Notebook architecture. It clarifies the relationship between a Note's text content and its associated binary files.

## 2. Concept

An Attachment is a distinct, managed binary asset (e.g., an image, a PDF, a spreadsheet) uploaded into a Workspace. It exists independently of the Note text but is linked via reference to provide a rich multimedia experience.

## 3. Ownership

- The **Attachments module** owns the binary file, its metadata, and its lifecycle.
- The **Notes module** (and Editor) owns the text payload that references the Attachment.
- **Rule:** Attachments are independent entities. Notes reference Attachments. Attachments NEVER own Notes.

## 4. Attachment Identity

- Every Attachment is assigned a unique, immutable UUID upon ingestion.
- The UUID is the only valid way for a Note or an external module to request the file. Filenames are metadata, not identifiers.

## 5. Attachment Relationships and References

### 5.1 Attachment Reference Philosophy
- **Reference Model:** Notes reference Attachments using immutable Attachment UUIDs.
- **Editor Interaction:** Editors work strictly with Attachment references rather than raw binary content.
- **Ownership:** The binary content remains fully owned by the Attachments module, not the Note.
- **Identity Distinction:** Attachment identity remains entirely independent from Note identity.
- **Concept Distinction:**
  - **Note:** The text payload containing references.
  - **Attachment:** The actual managed binary asset and its metadata.
  - **Attachment Reference:** The pointer (e.g., UUID string) embedded within the Note's text linking it to the Attachment.

### 5.2 Shared Attachments (Future Capability)
- **Shared References:** Multiple Notes may reference the exact same Attachment UUID.
- **Ownership Unchanged:** Shared references do not change Attachment ownership.
- **Reference Removal:** Removing one reference from a Note does not automatically remove the Attachment, as other Notes may still reference it.
- **Relationship Management:** Relationship management (tracking which Notes link to which Attachments) remains the responsibility of the Attachments module.

## 6. Supported Categories

The module conceptually supports any file type, but categorizes them for downstream processing:
- **Images:** (png, jpg, webp, gif) Can be rendered inline or analyzed by OCR.
- **Documents:** (pdf, docx, xlsx) Can be previewed or indexed by search.
- **Media:** (mp4, mp3) Can be played inline.
- **Archives/Generic:** (zip, exe) Stored as raw binaries for download.

## 7. Embedded vs Linked Attachments

- **Embedded:** The Editor UI renders the attachment directly inline (e.g., showing an image).
- **Linked:** The Editor UI renders a clickable button or text link to download/open the attachment.
- *Note:* Both embedded and linked attachments are conceptually identical under the hood; the difference is purely in Editor presentation.

## 8. Business Rules

- **Immutability:** Once an Attachment is ingested and assigned a UUID, its core binary content cannot be mutated in place. Edits (like cropping an image) technically result in a new Attachment UUID or a new version layer depending on future implementations.
- **Isolation:** The failure of an Attachment to load MUST NOT prevent the Note itself from loading.

## 9. Attachment Capabilities
Attachments expose capabilities consumed by other modules. They are NOT responsibilities owned by the Attachments module.
- Can generate previews.
- Can generate thumbnails.
- Can participate in OCR.
- Can generate AI embeddings.
- Can be synchronized.
- Can be backed up.
- Can be exported.
- Can participate in search indexing.

## 10. Acceptance Criteria

- Uploading an image generates a distinct UUID for the image file.
- The Note payload stores only `![alt text](attachment://UUID)`, completely isolating the text database from the binary blob.
