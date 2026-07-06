> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Overview
> **Document Owner:** Core Architecture Team

# 03 — Attachment Metadata

---

## 1. Purpose

This document defines the conceptual metadata tracked for every Attachment. Metadata describes the Attachment's properties and capabilities without exposing implementation-specific storage details.

## 2. Conceptual Metadata Fields

### 2.1 Core Identity
- **Attachment UUID:** The immutable primary identifier.
- **Display Name:** A human-readable string presented in the UI (e.g., "Q3 Financials").
- **Original File Name:** The literal filename at the time of upload (e.g., `q3_fin_final_v2.xlsx`).

### 2.2 Technical Attributes
- **Media Type (MIME):** The format of the file (e.g., `image/jpeg`, `application/pdf`).
- **Size:** The byte size of the binary asset.
- **Checksum / Content Hash:** A cryptographic hash (e.g., SHA-256) used to verify data integrity and detect duplicate uploads.

### 2.3 Temporal Data
- **Created Timestamp:** When the asset was ingested.
- **Modified Timestamp:** When the metadata (like Display Name) was last changed.

### 2.4 Relational Data
- **Owner Note Relationships:** A registry of which Note UUID(s) currently reference this Attachment.
- **Import Source:** If applicable, tracking where the file originated (e.g., "Evernote Import Job ID").

### 2.5 Capability Flags (Reference Only)
- **Preview Availability:** Boolean indicating if a fast web-preview can be generated for this file type.
- **Thumbnail Availability:** Boolean indicating if a small image thumbnail exists.
- **OCR Availability:** Boolean indicating if text has been successfully extracted from this image.
- **AI Embedding Availability:** Boolean indicating if the document has been vectorized for semantic search.

## 3. Business Rules

- **Metadata Describes Attachments:** Metadata belongs strictly to the Attachment. It does not belong to the Note referencing it.
- **Storage Agnostic:** Metadata MUST NOT include implementation-specific details like `s3_bucket_url` or `local_disk_path_c_drive`. The storage path must be resolved dynamically using the UUID.

## 4. Validation

- The module must validate that the `Media Type` matches the actual binary signature of the file, rather than trusting the user-provided file extension (e.g., preventing a `.exe` masquerading as a `.jpg`).

## 5. Future Enhancements

- **EXIF Data Extraction:** Automatically extracting location and camera data from uploaded photographs and storing it in a structured metadata sub-field.
- **Custom User Metadata:** Allowing users to add their own tags or descriptions directly to the Attachment record.

## 6. Acceptance Criteria

- Uploading a file correctly captures its byte size, computes a SHA-256 hash, and identifies its MIME type based on binary inspection.
- The metadata schema contains no explicit references to the underlying physical storage technology.
