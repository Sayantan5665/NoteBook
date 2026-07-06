# Documentation Style Guide

> **Document Type:** Standard
> **Status:** Approved

---

## 1. Purpose

This document outlines the structural, formatting, and stylistic standards for all technical documentation in the Notebook project. Adhering to these rules ensures an enterprise-level consistency across all specifications, improving readability for both human developers and AI coding agents.

## 2. Markdown Conventions

- **Headings:** Use ATX-style headings (`#`, `##`, `###`). Always leave a blank line before and after a heading. Do not skip heading levels (e.g., jumping from `##` to `####`).
- **Lists:** Use hyphens (`-`) for unordered lists. Use numbers (`1.`, `2.`) for ordered workflows.
- **Tables:** Use standard GitHub-Flavored Markdown tables. Always include header rows. Use tables for state mappings, event payloads, or data schemas.
- **Mermaid Diagrams:** Use Mermaid.js (`mermaid` code blocks) for flowcharts, state diagrams, and sequence diagrams. Ensure node labels are concise.
- **Code Block Usage:** Use fenced code blocks with the appropriate language tag (e.g., `typescript`, `sql`, `json`). Do NOT use code blocks for general emphasis.

## 3. Terminology and Keywords

- **RFC 2119 Keywords:** Use **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** to signify strict architectural or business rule requirements. Capitalize these keywords to distinguish them from casual usage.
- **Consistent Terminology:** Capitalize domain entities when referring to the specific domain concept (e.g., "Folder", "Workspace", "Note"). Do not capitalize them when used generically.

## 4. Cross References

- **Relative Linking:** Always use relative links (e.g., `[Notes Module](../notes/README.md)`) instead of absolute URLs to ensure documentation remains functional offline and across different repository hosts.
- **No Duplication:** Never copy-paste business rules or schemas from one document to another. Instead, provide a summary and a cross-reference link to the authoritative source document.

## 5. Examples

- **Practicality:** When defining abstract concepts (like hierarchy paths or sync behaviors), always provide a concrete, practical example to clarify the edge cases.
- **Formatting:** Format short examples in italics or as blockquotes. Format technical payload examples as JSON code blocks.

## 6. Writing Tone

- **Tone:** Professional, objective, and declarative. 
- **Voice:** Use active voice. Example: "The Workspace module owns the manifest" (Active) instead of "The manifest is owned by the Workspace module" (Passive).
- **Enterprise Consistency:** Avoid colloquialisms, jokes, or overly conversational language. Specifications act as binding contracts for implementation.
