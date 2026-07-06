> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 09 — Embedded Content

---

## 1. Purpose

This document defines how the Editor manages embedded media and complex data structures. It establishes the boundary between the Editor (which presents the reference) and the Attachments module (which owns the binary asset).

## 2. Scope

**This document covers:**
- Supported embedded concepts (Images, Diagrams, Math).
- Rendering and editing responsibilities.
- Fallback behavior for missing assets.

**This document does NOT cover:**
- Binary file storage implementation (S3, local disk).
- Upload progress bars.

## 3. Supported Concepts

### 3.1 Current
- **Images:** Visual media embedded inline or as a block.
- **Attachments (Reference Only):** Pointers to binary files (e.g., PDF, ZIP) represented as clickable blocks.
- **Mermaid Diagrams:** Declarative text blocks rendered visually as diagrams by the Editor.

### 3.2 Future Enhancements
- **Mathematical Expressions:** LaTeX or similar syntax rendered as math blocks.
- **Bookmarks:** Rich previews of external URLs.
- **Media Embeds:** Interactive iframes for video or audio (e.g., YouTube).

## 4. Ownership and Boundaries

- **Strict Boundary:** The Editor NEVER owns binary files. 
- **Reference Only:** The active content payload contains only a semantic reference (e.g., an Attachment ID or an external URL).
- **Attachments Module:** The Attachments module is responsible for the actual storage, deduplication, and serving of the binary file.

## 5. Responsibilities

- **Rendering:** The Editor is responsible for parsing the reference ID, requesting the display URL or thumbnail from the Attachments module, and drawing it on the screen.
- **Editing:** The Editor is responsible for providing UI to resize, align, or caption the embedded block, saving these presentation attributes in the Note payload.

## 6. Conceptual Lifecycle

A conceptual flow for an embedded asset:
`Reference` &rarr; `Render` &rarr; `Update Reference` &rarr; `Remove Reference`

- **Reference:** The Editor embeds a pointer (e.g., UUID) to an external asset.
- **Render:** The Editor fetches the display data from the Attachments module for presentation.
- **Update Reference:** The user resizes the image or adds a caption; the Editor updates the Note payload.
- **Remove Reference:** The user deletes the block. The Note payload loses the reference.
- **Boundary Clarification:** Removing a reference is conceptually separate from deleting the underlying attachment. The Editor manages references only; binary asset lifecycle/garbage collection belongs strictly to the Attachments module.

## 7. Business Rules

- **Fallback Behavior:** If an referenced asset cannot be loaded (e.g., the image was deleted from the disk, or network is offline), the Editor MUST display a graceful fallback (e.g., a "Broken Image" placeholder or the raw ID) rather than crashing the rendering loop.
- **Validation:** Embedded content blocks must adhere strictly to the document structure schema (e.g., an inline image vs a block image).

## 7. Acceptance Criteria

- Pasting an image creates a reference block in the Editor payload while delegating the binary upload to the Attachments module.
- Deleting the reference block from the Editor removes it from the Note payload, but does not automatically delete the file from the Attachments module (garbage collection is a separate concern).
