> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Editor Overview
> **Document Owner:** Core Architecture Team

# 13 — Extension Points

---

## 1. Purpose

This document outlines the extensibility model of the Editor module. It defines how future capabilities, custom rendering, and specialized commands can be injected into the Editor without modifying its core engine.

## 2. Scope

**This document covers:**
- Custom Commands and Formatting.
- Custom Node Types and Marks.
- Future UI extensions (Panels, Menus).
- Plugin Hooks and Lifecycles.

**This document does NOT cover:**
- Implementation details of a Plugin SDK or underlying library extension APIs (e.g., ProseMirror Plugins).

## 3. Ownership and Boundaries

- **Ownership:** The Editor owns the registration and lifecycle of UI extensions.
- **Strict Boundary:** Extensions must respect Editor ownership boundaries. They are guests in the Editor's runtime.
- **Identity Rule:** Extensions must NEVER modify Note identity (UUID) or bypass the Editor's state management to write directly to the database.

## 4. Extension Capabilities

### 4.1 Custom Node Types and Marks
- **Nodes (Blocks):** Extensions can register entirely new structural blocks (e.g., a "Kanban Board" node, a "Math Equation" node). The Editor will parse, render, and serialize these nodes using the logic provided by the extension.
- **Marks (Inline):** Extensions can register new inline formatting (e.g., a "Spoiler" highlight, or a custom "Tag" reference).

### 4.2 Custom Commands and Formatting
- Extensions can register functions that mutate the Editor state safely (e.g., a command that automatically formats the selected text into a specific Table layout).

### 4.3 Custom Decorations
- Extensions can draw non-persistent visual overlays on top of the text (e.g., grammar-check underlines, real-time collaboration cursors, or AI suggestion highlighting) without altering the actual document payload.

### 4.4 Plugin Hooks
- Extensions can hook into the Editor's internal lifecycle:
  - `onBeforeTransaction`: Intercept and validate changes before they are applied.
  - `onPaste`: Intercept and handle specialized clipboard payloads.
  - `onKeyDown`: Register complex keyboard macros.

### 4.5 Future UI Extensions
- **Custom Panels:** Sidebars or widgets tethered to the Editor window.
- **Custom Menus:** Hover menus, slash commands (`/`), or right-click context menus injected by plugins.

## 5. Version Compatibility

- **Backward Compatibility:** Extension points should remain version-compatible whenever possible.
- **Graceful Failure:** If an extension registers a Custom Node, but the extension is later disabled or uninstalled, the Editor MUST gracefully degrade that node (e.g., displaying the raw text fallback) rather than failing to load the document.

## 6. Business Rules

- **Preserve Document Validity:** Extensions must operate within the strict boundaries of the conceptual document schema. An extension cannot arbitrarily break the tree hierarchy (e.g., inserting a raw HTML script tag into the JSON tree).

## 7. Acceptance Criteria

- A mock extension can register a new inline formatting Mark without requiring changes to the core Editor module code.
- Disabling an extension that provided a Custom Node gracefully falls back to a readable text representation in the Editor payload.
