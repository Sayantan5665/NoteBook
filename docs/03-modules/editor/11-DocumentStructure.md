> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 11 — Document Structure

---

## 1. Purpose

This document defines the conceptual structure of the active Editor payload. It outlines how text and media are organized into a valid hierarchy, ensuring predictable behavior during editing.

## 2. Scope

**This document covers:**
- The conceptual document model (Blocks, Inline, Nesting).
- Document validation and structural integrity.

**This document does NOT cover:**
- Internal Editor implementation (e.g., ProseMirror JSON schemas).
- The database schema for storing this payload.

## 3. Conceptual Document Model

The document is not a flat string of text; it is a structured tree of nodes.

### 3.1 Blocks
The fundamental vertical building blocks of the document.
- Examples: Paragraph, Heading, Block Quote, Code Block, Table, List.
- **Rule:** A document is a sequence of Blocks.

### 3.2 Inline Elements
The content residing *inside* Blocks.
- Examples: Text, Inline Code, Hyperlinks, Inline Images.
- **Rule:** Inline elements can receive marks (styling like Bold or Italic).

### 3.3 Nested Structures
Blocks that contain other Blocks.
- Examples: A List Item contains a Paragraph. A Block Quote can contain a List. A Table Cell contains Paragraphs.

### 3.4 Hierarchy and Sections
While the Editor technically sees a flat sequence of top-level blocks, conceptually, Headings (H1-H6) imply a section hierarchy, allowing for future features like folding/collapsing sections.

## 4. Document Validation and Integrity

### 4.1 Validation Principles
Validation protects the conceptual document model from corruption. The Editor enforces:
- **Valid Block Hierarchy:** Ensuring root-level and nested blocks follow schema rules.
- **Valid Nesting:** Preventing infinite or disallowed nesting (e.g., a Heading cannot contain a Table).
- **Valid Inline Content:** Ensuring inline elements only exist where permitted (e.g., no Block Quotes inside a span of bold text).
- **Valid Embedded References:** Ensuring pointers to attachments are structurally sound.
- **Structural Integrity After Editing:** Every user action (typing, deleting, pasting) must result in a valid document state.

### 4.2 Schema Enforcement
- **Structural Integrity:** The Editor continuously guarantees structural integrity. For instance, if a user deletes a List, the internal List Items must also be deleted or converted to plain Paragraphs, rather than leaving orphaned nodes.

## 5. Business Rules

- **Valid After Edit:** The document structure MUST remain valid after every single editing command. An operation that would result in an invalid structure must be blocked or normalized automatically.
- **Conceptual Abstraction:** The structure described here is conceptual. The specific internal representation (DOM vs JSON tree) is an implementation detail belonging to the UI layer, as long as it maps correctly to the Notes module payload.

## 6. Performance Considerations

- **Tree Depth:** Excessive nesting (e.g., a quote inside a list inside a quote inside a table) drastically increases parsing complexity. The schema should enforce reasonable maximum depths to maintain rendering performance.

## 7. Acceptance Criteria

- Attempting to paste a Table inside a Code Block results in the Table being stripped to plain text or the paste being rejected, thereby preserving the schema integrity of the Code Block.
- The document can be consistently traversed as a tree of blocks and inline elements.
