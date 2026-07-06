> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 06 — Extension Points

---

## 1. Purpose

This document outlines the extensibility of the Wiki Links & Backlinks module. It scopes how future features and plugins can build upon the relational knowledge graph.

## 2. Scope

**This document covers:**
- Graph enhancements (Aliases, Namespaces, Transclusion).
- Deep referencing (Block and Heading References).
- Ecosystem integration (Knowledge Graph, Plugins).

## 3. Future Capabilities

### 3.1 Aliases and Namespaces
- **Aliases:** Defining alternative display text for a link without altering the underlying UUID (e.g., `[[UUID|Custom Name]]`).
- **Namespaces:** Organizing target Notes via logical prefixes (e.g., `[[project:Alpha]]`), mapped at the graph level rather than the Folder level.

### 3.2 Transclusion
- Embedding the live, read-only content of a target Note directly within the source Note (e.g., `![[UUID]]`). The Wiki Links module tracks this as a distinct type of relational edge (`Transcludes`).

### 3.3 Deep Referencing
- **Heading References:** Linking directly to a specific Heading ID within a target Note (e.g., `[[UUID#Heading]]`).
- **Block References:** Linking directly to a specific Block UUID within a target Note (e.g., `[[UUID^BlockID]]`).

### 3.4 Semantic Relationships
- Allowing users or AI to type the *nature* of the link (e.g., "Supports", "Contradicts", "Is Parent Of"), enabling rich ontological querying.

### 3.5 External Links
- First-class support for validating links to external websites, local files outside the Workspace, or Deep Links into other applications.

### 3.6 Knowledge Graph Visualization
- Exposing the graph registry via a read-only API so that a separate Visualization Module can render interactive 2D/3D nodes and edges.

### 3.7 Future Collaboration
- Handling graph merge conflicts when multiple users link to or rename Notes concurrently.

## 4. Plugin Hooks

- Plugins may register to listen to the `BacklinksUpdated` event to generate custom analytics or visualizations.
- Plugins can hook into the Link Validation cycle to provide custom resolution logic (e.g., checking if an HTTP link is alive).

## 5. Business Rules

- **Strict UUID Adherence:** Extensions (like Aliases or Transclusion) must continue to use the underlying UUID. They must NEVER revert to fragile title-based linking.
- **Graph Integrity:** Deep referencing (Block References) must degrade gracefully to standard Note links if the specific block inside the target Note is deleted.

## 6. Acceptance Criteria

- A future plugin can request the entire Backlink graph for a Note without needing to parse the raw Markdown or JSON content itself.
