> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Module
> **Document Owner:** Core Architecture Team

# 04 — OCR Validation

---

## 1. Purpose

This document outlines the principles for validating files before, during, and after OCR processing. Validation protects processing quality and system resources without ever modifying the original binary attachments.

## 2. Validation Philosophy

Validation ensures the OCR engine only attempts to process files it can reasonably understand. It acts as a shield for CPU resources, dropping invalid jobs early so the queue remains performant for valid jobs.

## 3. Pre-Processing Validation

### 3.1 Unsupported Attachments
- The module must check the Attachment's MIME type before queuing. Attachments like `.mp3` or `.exe` are immediately dropped.
- **Rule:** Do not queue jobs that are guaranteed to fail.

### 3.2 Duplicate Requests
- The module must validate if an OCR Result already exists for the given Attachment UUID.
- If a result exists and the underlying Checksum has not changed, the new request is ignored (unless explicitly flagged as a forced Reprocessing request).

## 4. Processing Validation

### 4.1 Corrupted Files
- If the binary fetched from storage fails checksum validation or is structurally corrupted (e.g., a truncated image), the OCR module must mark the job as `Failed` and emit an error. It MUST NOT attempt to repair or delete the attachment.

### 4.2 Unreadable Files
- A file may be structurally valid but completely unreadable by the engine (e.g., an image of pure static, or an image exceeding maximum dimension limits). The job is marked as `Failed`.

## 5. Post-Processing Validation

### 5.1 Empty Results
- If the engine completes successfully but finds zero text (e.g., a photograph of an empty wall), the result is validated as `Empty`. This is distinct from a `Failure`. An `Empty` result prevents the system from endlessly retrying the file.

### 5.2 Retry Validation
- The module must validate retry attempts against a maximum retry counter (e.g., Max 3 retries) to prevent poison-pill attachments from crashing worker nodes in an infinite loop.

## 6. Business Rules

### 6.1 Failure Philosophy
- OCR failures affect ONLY the OCR module.
- Validation should report failures (e.g., corrupted file) while strictly preserving overall system integrity.
- Under no circumstances does an OCR failure corrupt or alter:
  - Notes
  - Attachments
  - Tags
  - Wiki Links
  - Editor content

### 6.2 Attachment Independence
- **Canonical Source:** Attachments remain the canonical source. Validation never modifies Attachments.
- **Ownership:** OCR Results never own Attachments. 
- **Integrity Preservation:** If OCR decides an image is "bad", it flags the *OCR Job* as bad, leaving the Attachment perfectly intact.
- **Quality Protection:** Validation protects processing quality and system stability.

## 7. Acceptance Criteria

- Uploading a 5GB `.zip` file disguised as a `.jpg` results in the OCR module immediately discarding the job during pre-processing validation, preventing memory exhaustion.
- Scanning a pure black image results in an `Empty` success state, ensuring the engine does not attempt to re-process it during the next automated sweep.
