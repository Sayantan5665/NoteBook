> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 08 — Drag and Drop

---

## 1. Purpose

This document details the Drag & Drop (DnD) capabilities within the Editor. It establishes how users can fluidly reorganize content internally and import content from the operating system via direct manipulation.

## 2. Scope

**This document covers:**
- Internal block reordering and text dragging.
- External dragging (dropping files or text into the Editor).
- Drop validation.

**This document does NOT cover:**
- File system API implementation.
- UI drag handle designs.

## 3. Ownership and Responsibilities

- **Ownership:** The Editor owns the coordinate mapping and event handling for DnD operations.
- **Responsibilities:** Translate a screen drop coordinate into a valid structural insertion point within the active content payload.

## 4. Drag Operations

### 4.1 Internal Operations
- **Text Dragging:** Highlighting a range of text and dragging it to a new location. Acts conceptually as a combined Cut and Paste.
- **Reordering Content:** Dragging a structural block (e.g., a Paragraph, a List Item) by a conceptual handle and dropping it between other blocks to reorganize the document hierarchy.

### 4.2 External Operations
- **Text Dragging:** Dragging selected text from a browser or other application directly into the Editor. Handled similarly to a standard Paste operation (requires sanitization).
- **Image / File Dragging:** Dropping a file from the OS onto the Editor. 

## 5. Business Rules

- **Content Organization Only:** Drag & Drop affects content organization and insertion only. It NEVER alters the Note's identity (UUID).
- **Document Validity:** The Editor MUST ensure that dropping an element preserves structural integrity. (e.g., A user cannot drop a Top-Level Heading inside a Table Cell if the schema forbids it; the drop must be rejected or the element coerced).
- **Attachment Delegation:** Dropping an external file triggers an event handled by the Attachments module, resulting in the Editor inserting a Reference Block, not the binary file itself.

## 6. Error Handling and Edge Cases

- **Invalid Drop Zones:** If a user attempts to drop content into an invalid zone (e.g., outside the editor canvas, or inside a read-only widget), the drop is rejected without affecting the document.
- **Large File Drops:** Dropping a massive file should immediately trigger a visual loading state, delegating the heavy lifting to the Attachments module so the Editor thread does not block.

## 7. Performance Considerations

- Visual feedback during a drag operation (e.g., a drop-target cursor or horizontal insertion line) must calculate positions efficiently without triggering massive re-renders of the entire document.

## 8. Acceptance Criteria

- Highlighting and dragging a sentence to a new paragraph successfully moves the text.
- Dropping an image file into the Editor correctly initiates an attachment upload and inserts an image reference placeholder.
- Dropping a structural block preserves document schema validity.
