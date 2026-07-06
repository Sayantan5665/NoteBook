> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 02 — Note Content

---

## 1. Purpose

This document outlines the conceptual content model for a Note. It defines what constitutes "Content" versus "Metadata" and lists the supported semantic structures a Note can contain, entirely independent of how the Editor module chooses to render them.

## 2. Scope

**This document covers:**
- The semantic distinction between Content, Metadata, Presentation, and Derived information.
- The supported conceptual content elements.

**This document does NOT cover:**
- Editor implementation (e.g., ProseMirror schema, HTML DOM representation).
- Markdown serialization logic.

## 3. The Content Model

The Notes module treats the content payload as a rich, structured document.

### 3.1 Content Ownership

It is critical to distinguish between content ownership and content rendering.
- **The Notes module owns Note content.** It acts as the definitive storage truth for the text/data payload.
- **The Editor module owns presentation and editing behavior.** It translates the payload into an interactive UI.
- **Rendering does not change the underlying Note model.** The Notes module remains ignorant of the DOM or the specific editor interface.
- **Multiple editor implementations may render the same Note.** For example, a future mobile view or an alternative block-editor plugin could render the exact same Note payload.

### 3.1 Content vs Metadata vs Presentation
- **Content:** The actual semantic data written by the user (the text, the lists, the code). This is the payload stored in the database.
- **Metadata:** Data *about* the Note (Title, UUID, Folder ID, Creation Date). Metadata lives in dedicated database columns, completely decoupled from the Content payload.
- **Presentation:** How the content looks (font size, UI theme). Presentation is explicitly NOT stored in the Note content. The Note stores semantics (e.g., "Heading 1"), not styling (e.g., "32px bold").
- **Derived Information:** Information calculated from the Content (e.g., Word Count, Reading Time). Derived information is cached or calculated on the fly, but is not considered authoritative Content.

### 3.2 Supported Content Elements

A Note conceptually supports the following structural elements:
- **Paragraphs:** Standard blocks of text.
- **Headings:** Semantic levels H1 through H6.
- **Lists:** Ordered (numbered) and Unordered (bulleted) lists.
- **Task Lists:** Checkbox items representing actionable tasks.
- **Tables:** Structured grid data.
- **Code Blocks:** Fenced blocks of text, optionally with language definitions for syntax highlighting.
- **Block Quotes:** Semantically quoted text.
- **Callouts:** Highlighted informational blocks (e.g., warnings, tips).
- **Horizontal Rules:** Thematic breaks.
- **Images:** Semantic references to visual media (stored separately as Attachments).
- **Embedded Files (Reference):** Pointers to binary attachments.
- **Mermaid Diagrams:** Declarative text blocks intended for diagram rendering.

### 3.3 Rich Text and Markdown Compatibility

- The conceptual model is highly compatible with standard Markdown (CommonMark/GFM).
- While the content supports Rich Text abstractions (bold, italic, links), it relies on a strict underlying schema to ensure data portability, allowing seamless conversion between Markdown text and rich JSON representations used by modern editors.

### 3.5 Note Size Philosophy

- **No Arbitrary Limits:** The Notes domain does not impose arbitrary content size limits on a Note (e.g., capping a Note at 10,000 words).
- **Practical Limitations:** Practical limitations may exist due to available system resources (RAM, SQLite blob limits).
- **UI Performance:** User interface performance considerations (like virtualizing long documents) are handled exclusively by the Editor module, not the Notes data model.
- **Storage Optimization:** Storage implementation details (such as chunking large text) belong strictly to the Database layer.

## 4. Business Rules

- **Separation of Concerns:** The Notes module MUST NOT store UI-specific state (like cursor position or text selection) as part of the core Content payload.
- **Content Integrity:** The content payload MUST NOT dictate the identity of the Note. An empty content payload is entirely valid.

## 5. Acceptance Criteria

- The Note content model successfully separates the semantic content payload from metadata attributes like `title` and `folderId`.
- The storage layer supports storing large structured documents encompassing all required conceptual elements.
