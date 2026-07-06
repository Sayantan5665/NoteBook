> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 06 — Formatting

---

## 1. Purpose

This document outlines the conceptual formatting capabilities supported by the Editor module. It defines how structural blocks and inline styles are managed to present the canonical Note payload to the user without prescribing specific UI elements or implementations.

## 2. Scope

**This document covers:**
- Inline and Block formatting capabilities.
- Formatting validation and consistency.
- The philosophy of separating formatting from Note identity.

**This document does NOT cover:**
- Keyboard shortcuts or toolbar designs.
- ProseMirror/Tiptap schema definitions.

## 3. Ownership and Philosophy

- **Ownership:** The Editor owns the *application* of formatting to the active session payload. The Notes module owns the persistence of that formatted payload.
- **Philosophy:** Formatting alters the structure and semantic presentation of a Note's content.
- **Critical Rule:** Formatting NEVER changes a Note's identity (UUID) or its metadata.

## 4. Supported Formatting

### 4.1 Inline Formatting
Modifies ranges of text within a structural block.
- **Bold, Italic, Strikethrough, Underline:** Standard text emphasis.
- **Inline Code:** Monospaced formatting for code snippets.
- **Hyperlinks:** Clickable URLs or Wiki Links spanning a text range.
- **Highlights (Future):** Background color emphasis.

### 4.2 Block Formatting
Defines the structural container for text.
- **Headings (H1-H6):** Semantic section titles.
- **Paragraphs:** Default structural text blocks.
- **Lists:** Ordered (numbered) and Unordered (bulleted) lists.
- **Task Lists:** Checkbox items that maintain a checked/unchecked state.
- **Block Quotes:** Semantically quoted text blocks.
- **Code Blocks:** Fenced blocks of text, optionally supporting language definitions for syntax highlighting.
- **Tables:** Structured grid data (rows and columns).
- **Horizontal Rules:** Thematic visual breaks.
- **Callouts:** Highlighted informational blocks (e.g., warnings, info).
- **Text Alignment (Future):** Left, Center, Right, Justify applied to blocks.

## 5. Business Rules

- **Schema Validation:** The Editor MUST validate all formatting applications against a strict conceptual schema (e.g., a Heading cannot contain a Table).
- **Formatting Consistency:** 
  - Formatting commands must preserve document validity at all times.
  - Formatting operations must never create structurally invalid documents.
  - Formatting affects presentation only.
  - Formatting never changes Note identity.
  - Applying incompatible formatting must gracefully degrade or automatically convert the block (e.g., converting a Heading into a List Item forces the text to adapt to the List Item rules).

## 6. Error Handling and Edge Cases

- **Nested Complexity:** Deeply nested structures (e.g., a List inside a Quote inside a Table cell) must be handled gracefully. If a nesting limit is reached, the Editor should safely flatten the structure rather than crashing.

## 7. Performance Considerations

- Large documents with thousands of heavily formatted blocks must render without UI stutter. The Editor should defer rendering off-screen formatting (virtualization) if necessary.

## 8. Acceptance Criteria

- A user can apply block and inline formatting without mutating the Note UUID.
- Applying an invalid format combination (e.g., pasting a blockquote into a code block) resolves gracefully to plain text or valid schema logic.
