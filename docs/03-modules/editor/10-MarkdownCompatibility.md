> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 10 — Markdown Compatibility

---

## 1. Purpose

This document outlines the Editor's philosophical and practical interoperability with Markdown. It defines Markdown as an interface, rather than the core identity of the Notebook architecture.

## 2. Scope

**This document covers:**
- Markdown as an interoperability layer (Import/Export).
- Supported and unsupported Markdown concepts.
- Round-trip philosophy.

**This document does NOT cover:**
- Markdown parsing libraries.
- The actual storage format (which belongs to the Notes/Database modules).

## 3. Philosophy

- **Interoperability Format:** Markdown is an interoperability layer. It is a highly supported, universally understood syntax for moving text between systems.
- **Independence:** The Canonical Note remains conceptually independent of Markdown. The Editor uses a rich semantic model (e.g., JSON) that can be translated *to* and *from* Markdown.

## 4. Markdown Concepts

### 4.1 Supported Concepts
- Headings (`#`, `##`)
- Emphasis (`*`, `**`, `~~`)
- Lists (`-`, `1.`, `- [ ]`)
- Blockquotes (`>`)
- Code Blocks (```` ``` ````)
- Tables
- Links and Images (`[]()`, `![]()`)
- Horizontal Rules (`---`)

### 4.2 Unsupported Concepts
- Deeply specific HTML embedded inside Markdown that violates the Editor's schema.
- Obscure Markdown flavors outside of standard CommonMark/GFM (GitHub Flavored Markdown).

## 5. Import and Export

- **Import (Parsing):** When plain-text Markdown is pasted or imported, the Editor parses the syntax and converts it into its rich semantic model.
- **Export (Serialization):** When copying or exporting, the Editor can serialize its rich semantic model back into standard Markdown syntax.

## 6. Round-Trip Philosophy

- **Goal:** The system strives for a lossless round-trip for supported concepts (Markdown &rarr; Editor &rarr; Markdown).
- **Rich Text Compatibility:** Not all rich text features (e.g., custom colored text, advanced alignment, specialized custom blocks) have a native Markdown equivalent.
- **Rule:** When exporting rich features to Markdown, the system degrades gracefully (e.g., falling back to plain text or standard HTML tags) rather than generating proprietary syntax that traps the user's data.

## 7. Business Rules

- **Schema Adherence:** Incoming Markdown must be coerced to fit the Editor's valid document structure.
- **Data Liberation:** Markdown export must always be available to ensure users can liberate their data in a human-readable format.

## 8. Acceptance Criteria

- Pasting standard CommonMark text into the Editor perfectly converts the syntax into visual, rich blocks.
- Copying a rich table from the Editor and pasting it into a raw text editor outputs valid Markdown table syntax.
