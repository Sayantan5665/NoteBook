> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 07 — Clipboard

---

## 1. Purpose

This document defines the Clipboard behavior for the Editor module. It outlines how the application handles Copy, Cut, and Paste operations, ensuring data integrity, security, and schema validation during content transit.

## 2. Scope

**This document covers:**
- Internal vs External clipboard operations.
- Plain Text vs Rich Content pasting.
- Validation and sanitization requirements.

**This document does NOT cover:**
- OS-level clipboard API implementation.

## 3. Ownership and Responsibilities

- **Ownership:** The Editor owns clipboard transaction handling.
- **Responsibilities:**
  - Serialize outgoing content into standard clipboard formats (HTML, Plain Text).
  - Deserialize and sanitize incoming content from the OS clipboard.

## 4. Clipboard Operations

### 4.1 Copy and Cut
- **Internal Copy:** Copying content entirely within the application. Retains full fidelity of custom blocks (e.g., Wiki Links, custom Callouts).
- **External Copy:** The Editor serializes the selected content into universally recognized formats (Standard HTML and Plain Text) to ensure it pastes cleanly into third-party apps (e.g., Microsoft Word, browsers).
- **Cut:** Functions identically to Copy, followed immediately by a standard Deletion command for the selected range.

### 4.2 Paste
- **Paste Rich Content (Default):** The Editor inspects the incoming clipboard payload. If it contains HTML or rich formatting, the Editor attempts to map it to the application's supported formatting schema.
- **Paste as Plain Text:** Strips all incoming formatting, inserting only the raw string values at the cursor position.

### 4.3 Clipboard Normalization
- **Concept:** Content copied from external sources is conceptually normalized before becoming canonical Note content.
- **Structural Integrity:** Normalization preserves document integrity by ensuring the pasted payload conforms strictly to the Editor's schema.
- **Validity:** Clipboard processing should always produce structurally valid content.
- **Internal Formatting:** Internal clipboard operations preserve supported formatting whenever possible to maintain a seamless editing experience.

## 5. Validation and Security

- **Sanitization (Security):** Incoming HTML MUST be aggressively sanitized. Dangerous tags (`<script>`, `<iframe>`, `<form>`) must be stripped entirely to prevent XSS attacks.
- **Schema Validation:** Incoming content must be coerced to fit the Editor's conceptual document structure. Unsupported tags (e.g., custom XML from another app) are either converted to plain text or discarded.

## 6. Business Rules

- **Identity Independence:** Clipboard operations manipulate the active content payload but NEVER mutate the Note's identity (UUID).
- **Non-Destructive Degradation:** If a user pastes a complex nested table that exceeds the Editor's capabilities, the Editor must extract the text gracefully rather than failing the paste operation entirely.

## 7. Edge Cases

- **Pasting Large Data:** Pasting extremely large payloads (e.g., a 100-page document) must not freeze the application. The operation should be processed asynchronously or chunked if necessary.
- **Pasting Images:** When an image is detected in the clipboard, the Editor MUST intercept it, upload/store it via the Attachments module, and insert a conceptual Reference Block, rather than embedding a massive Base64 string directly into the text payload.

## 8. Acceptance Criteria

- Pasting a `<script>alert("hack")</script>` payload results in the script being stripped, with only the safe text remaining.
- Copying a Heading and pasting it into a third-party text editor correctly retains the plain-text equivalent or standard HTML header tag.
