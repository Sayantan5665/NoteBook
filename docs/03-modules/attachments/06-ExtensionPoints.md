> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Overview
> **Document Owner:** Core Architecture Team

# 06 — Extension Points

---

## 1. Purpose

This document outlines the extensibility of the Attachments module. It scopes how future features, external storage providers, and processing pipelines can integrate with binary assets.

## 2. Future Capabilities

### 2.1 Content Processing
- **OCR (Optical Character Recognition):** Scanning image attachments to extract text, populating a searchable index.
- **Media Previews & Thumbnail Generation:** Automatically generating low-resolution WebP thumbnails for heavy TIFF images, or capturing the first frame of a video upload.
- **Audio Waveforms:** Generating visual waveform data arrays for audio files to render advanced playback UIs.

### 2.2 Advanced Interactivity
- **Image Editing:** Cropping, rotating, or annotating an image. *Rule:* This must conceptually create a new Attachment UUID or a specific "Layered Version" rather than destructively mutating the original UUID's bytes.
- **PDF Annotation:** Overlaying highlights and text on a PDF attachment.

### 2.3 Storage and Ecosystem Integration
- **External Storage Providers:** Abstracting the storage layer so a plugin could map `Attachment UUID 123` to a file hosted in Google Drive or a private AWS S3 bucket, rather than local disk.
- **Future Collaboration:** Handling concurrent upload conflicts or sync state management for large binary blobs.

### 2.4 Derived Artifact Philosophy
- **Concept:** Artifacts (e.g., Thumbnails, Previews, OCR Text, AI Embeddings, Cached Renderings) are mathematically or semantically derived from the Attachment.
- **Canonical Source:** Derived artifacts are NEVER the canonical Attachment. The original binary remains the sole source of truth.
- **Volatility:** Derived artifacts may be regenerated at any time.
- **Independence:** The loss, deletion, or corruption of a derived artifact does not affect the core Attachment itself. The system simply regenerates it when needed.

## 3. Plugin Hooks

- **Ingestion Pipeline Hooks:** Allowing plugins to intercept the `Create` lifecycle stage to perform custom validation (e.g., rejecting files over a specific size, or stripping EXIF data before save).
- **Presentation Hooks:** Allowing the Editor to request a specific renderer for an Attachment (e.g., a 3D model viewer plugin intercepting `.obj` files).

## 4. Business Rules

- **Respect Ownership Boundaries:** Extensions processing Attachments (like an OCR plugin) must write their derived data to their own domain or the Search index. They MUST NOT mutate the original binary Attachment or write text directly into the source Note payload without explicit user action.
- **Graceful Fallback:** If a Thumbnail Generation extension fails or crashes, the core Attachment must still save and be accessible in its raw form.

## 5. Acceptance Criteria

- An OCR extension can successfully listen for `AttachmentCreated`, download the image, process it, and send the text to the Search module without requiring any changes to the core Attachments module codebase.
