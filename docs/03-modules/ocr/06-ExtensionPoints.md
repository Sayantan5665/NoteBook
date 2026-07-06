> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Attachments Module
> **Document Owner:** Core Architecture Team

# 06 — Extension Points

---

## 1. Purpose

This document outlines the extensibility of the OCR module. It scopes how future capabilities, external providers, and AI enhancements can plug into the text extraction pipeline.

## 2. Future Capabilities

### 2.1 Extraction Enhancements
- **Handwriting Recognition (HTR):** Processing Apple Pencil notes or scanned cursive documents.
- **Table Recognition:** Extracting grid data into structured CSV or Markdown tables, rather than flat text.
- **Layout Analysis:** Maintaining paragraph structure, columns, and headings to preserve document flow.
- **Barcode/QR Recognition:** Extracting URLs or payload data from visual codes.

### 2.2 Infrastructure Enhancements
- **Language Packs:** Dynamically loading Tesseract language models (e.g., Japanese, Arabic) based on user locale or detected image traits.
- **Multiple OCR Providers:** Supporting a plugin architecture to switch from a local, private engine (e.g., Tesseract) to a high-fidelity Cloud OCR Provider (e.g., Google Cloud Vision, AWS Textract).

### 2.3 AI Integrations
- **Image Classification:** Before running expensive OCR, using a lightweight AI model to classify the image (e.g., "Photograph of a Cat" vs "Scanned Receipt") to selectively bypass the OCR queue.
- **Future AI-assisted OCR:** Using LLMs to error-correct the raw, messy output of the OCR engine to produce grammatically clean text.

## 3. Plugin Hooks

- Plugins could register as "Providers" for the OCR module, intercepting the `OCRRequested` event, executing the extraction via an external API, and returning the result to trigger the standard `OCRCompleted` event.

## 4. Business Rules

- **Respect Boundaries:** Cloud OCR Providers must adhere strictly to the existing input/output contracts. They must return derived text without ever mutating the canonical Attachment.
- **Privacy Controls:** If Cloud OCR is implemented, it MUST be an opt-in extension, respecting the user's requirement for local-only, private processing by default.

## 5. Acceptance Criteria

- A developer can write a plugin that routes PDF files to AWS Textract, while keeping standard PNG files routed to the local engine, without altering the core module's event definitions or database schema.
