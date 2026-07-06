> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Module
> **Document Owner:** Core Architecture Team

# 05 — OCR Events

---

## 1. Purpose

This document outlines the domain events published and consumed by the OCR module. These events facilitate decoupled background processing and notify downstream consumers (like Search) when new text is available.

## 2. Event Model

### 2.1 Published Events
These events notify the ecosystem of the state of the OCR pipeline.
- **`OCRRequested`**: Emitted when a job enters the queue.
- **`OCRStarted`**: Emitted when a worker begins processing the binary.
- **`OCRCompleted`**: Emitted when text is successfully extracted. Contains the Attachment UUID and the derived text.
- **`OCRFailed`**: Emitted when the engine encounters an unrecoverable error.
- **`OCRRetryRequested`**: Emitted when a failed job is bumped back to the queue.
- **`OCRCancelled`**: Emitted when a pending job is aborted.
- **`OCRResultsUpdated`**: Emitted during a Reprocessing event, indicating that downstream indices should replace the old text with the new text.

### 2.2 Consumed Events
These events inform the OCR module of external actions requiring a response.
- **`AttachmentCreated`**: Consumed to automatically trigger `OCRRequested` for supported MIME types.
- **`AttachmentDeleted`**: Consumed to delete any stored OCR results and trigger `OCRCancelled` for any pending jobs tied to the deleted Attachment.

## 3. Dependencies and Ordering Philosophy

- **Decoupled Architecture:** The OCR module publishes `OCRCompleted`. It does NOT directly call the Search API to inject the text. The Search module must listen for the event.
- **Ordering Philosophy:** 
  `AttachmentCreated` &rarr; `OCRRequested` &rarr; `OCRStarted` &rarr; `OCRCompleted` &rarr; `Search Index Updated`.

## 4. Business Rules

- **Event Immutability:** Event payloads containing UUIDs and Extracted Text must be read-only for consumers.
- **Silent Failures:** An `OCRFailed` event should not trigger user-facing error toasts in the UI unless the user manually requested the processing. Background failures should fail silently and log for telemetry.

## 5. Acceptance Criteria

- When the OCR engine finishes extracting text from a receipt, it emits `OCRCompleted`. The Search module independently consumes this event and makes the receipt searchable within 5 seconds.
- Deleting an Attachment emits `AttachmentDeleted`, causing the OCR module to silently purge the extracted text from its database tables.
