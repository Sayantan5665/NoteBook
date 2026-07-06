> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Overview
> **Document Owner:** Core Architecture Team

# 04 — Attachment Validation

---

## 1. Purpose

This document outlines the principles for validating Attachments. Validation protects the integrity of the binary assets and ensures the relational links between Notes and Attachments remain accurate.

## 2. Validation Philosophy

- **Integrity Protection:** Validation exists to guarantee that what the user uploaded is exactly what is stored, and that the application knows where to find it.
- **Scope Restriction:** Validation checks file headers and checksums. It does NOT define antivirus or malware scanning capabilities, which belong to infrastructure or security layers.

## 3. Core Concepts

### 3.1 Supported File Concepts
- The module conceptually accepts any binary file, but enforces structural validation based on the claimed MIME type (e.g., verifying an uploaded `.png` actually possesses a valid PNG file header).

### 3.2 File Integrity
- Using the `Checksum` generated at upload, the module can periodically verify that the underlying stored binary has not suffered "bit rot" or corruption.

### 3.3 Duplicate Detection Philosophy
- The module uses the Checksum to detect identical file uploads. 
- Conceptually, if a user uploads `logo.png` to Note A, and later uploads the exact same `logo.png` to Note B, the module may silently de-duplicate the storage, returning the original Attachment UUID to Note B.

## 4. Reference Validation

### 4.1 Broken References
- A "Broken Reference" occurs when a Note requests an Attachment UUID that does not exist in the Attachments module's registry.
- The Editor must gracefully degrade (e.g., showing a "Missing File" placeholder) rather than crashing.

### 4.2 Missing Files
- A "Missing File" occurs when the registry possesses metadata for a UUID, but the underlying storage subsystem cannot locate the binary asset.

### 4.3 Corrupted Files
- A "Corrupted File" occurs when the registry possesses the file, but its current Checksum no longer matches the `Checksum` stored in metadata.

## 5. Recovery Interaction

- If a file is Missing or Corrupted, the module emits an `AttachmentValidationFailed` event.
- System administrators or sync conflict-resolution algorithms can attempt to repair the file from a Backup module.
- Validation logic never attempts to automatically delete the metadata of a missing file, as it serves as a tombstone for recovery.

## 6. Business Rules

- **Validation Preserves Integrity:** Validation ensures the stored byte stream matches the expected byte stream.
- **Fail Gracefully:** Validation failures MUST be non-destructive to the Note payload. A broken image link in a Note must not prevent the user from editing the surrounding text.

## 7. Acceptance Criteria

- Renaming an uploaded `.txt` file to `.jpg` and attempting to attach it results in a validation rejection due to a MIME type mismatch.
- A background validation job successfully flags an Attachment as "Missing" if its underlying physical file is manually deleted from the disk by an administrator.
