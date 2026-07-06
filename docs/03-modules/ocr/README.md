> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Module
> **Document Owner:** Core Architecture Team

# OCR Module

---

## 1. Purpose

The OCR (Optical Character Recognition) module provides a processing service to extract textual content from supported binary Attachments. It empowers users to search for text locked within images and scanned documents.

## 2. Scope

**This document covers:**
- OCR processing lifecycles and job management.
- OCR result generation and validation.
- Event models communicating OCR completion.
- Future extension points (e.g., handwriting, languages).

**This document does NOT cover:**
- Tesseract or specific OCR engine implementations.
- Search indexing of the extracted text.
- AI embedding generation.
- The storage of the original binary attachments.

## 3. Responsibilities

- **Job Management:** Queueing, executing, retrying, and cancelling OCR requests.
- **Extraction:** Reading binary data and emitting derived text strings.
- **Validation:** Filtering out unsupported files before attempting expensive processing.
- **Lifecycle:** Managing the lifecycle of the resulting extracted text.

## 4. Ownership and Boundaries

- **Ownership:** This module owns the OCR processing queue and the resulting derived text artifacts.
- **Boundaries:** 
  - OCR consumes Attachments but NEVER owns them.
  - OCR NEVER modifies the original binary files.
  - OCR processing is strictly decoupled from the Search and AI modules. It simply publishes its results for them to consume.

### 4.1 Canonical OCR Flow
A conceptual workflow illustrating the role of OCR within the system:

`Attachment` &rarr; `OCR Request` &rarr; `OCR Job` &rarr; `OCR Result` &rarr; `Search` &rarr; `Embeddings` &rarr; `AI`

- OCR consumes Attachments.
- OCR produces derived textual artifacts (OCR Results).
- Search and Embeddings consume OCR Results.
- AI consumes Search and Embedding outputs.
- Ownership boundaries remain perfectly intact at every stage.

## 5. OCR Capabilities
OCR Results expose capabilities consumed by other modules. They are NOT responsibilities owned by the OCR module itself.
- Can participate in Search indexing.
- Can participate in AI retrieval.
- Can be exported alongside notes.
- Can enable future language detection.
- Can enable future document analysis (e.g., layout mapping).

## 6. Dependencies

- **Attachments Module:** The OCR module depends on the existence of Attachments and their emitted events (e.g., `AttachmentCreated`) to trigger processing.

## 7. Interfaces and Events

### 7.1 Consumed Interfaces
- Provides an internal interface for manual or scheduled OCR triggering.

### 7.2 Published Events
- `OCRRequested`
- `OCRStarted`
- `OCRCompleted`
- `OCRFailed`
- `OCRRetryRequested`
- `OCRCancelled`
- `OCRResultsUpdated`

### 7.3 Consumed Events
- `AttachmentCreated` (To auto-queue supported files)
- `AttachmentUpdated` (To trigger reprocessing if the binary conceptually changed)
- `AttachmentDeleted` (To garbage collect associated OCR results)

## 8. Extension Points

- Cloud OCR Providers.
- Language Packs and Handwriting Recognition.
- Layout Analysis and Table Recognition.

## 9. Settings

- Preferences for auto-running OCR on upload vs manual triggering.
- Preferred languages for detection algorithms.

## 10. Business Rules

- **Non-Destructive:** OCR NEVER modifies Attachments.
- **Derived Artifacts:** OCR results are derived artifacts. They are never canonical data.
- **Idempotency:** OCR may be re-run at any time without duplicating data.
- **Independence:** OCR processing is independent from Search and AI.
- **Safe Failure:** OCR failures never corrupt Attachments.
- **Quality Control:** OCR validation protects processing quality by preventing unreadable files from clogging the queue.

## 11. Acceptance Criteria

- Uploading a PNG containing text triggers the module, which eventually emits an `OCRCompleted` event with the extracted text, without altering the original PNG.
- A failed OCR job safely marks the job as failed and does not prevent the user from viewing the original attachment.

## 12. Cross References

- [01-OCROverview.md](./01-OCROverview.md)
- [02-OCRLifecycle.md](./02-OCRLifecycle.md)
- [03-OCRResults.md](./03-OCRResults.md)
- [04-OCRValidation.md](./04-OCRValidation.md)
- [05-OCREvents.md](./05-OCREvents.md)
- [06-ExtensionPoints.md](./06-ExtensionPoints.md)
