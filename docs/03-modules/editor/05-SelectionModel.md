> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 05 — Selection Model

---

## 1. Purpose

This document outlines the Editor's selection model. It defines how the Editor tracks user focus, cursor position, and highlighted content boundaries, which serve as the foundation for command execution.

## 2. Scope

**This document covers:**
- Cursors and Text Selections.
- Selection lifecycle and boundaries.
- Selection validation.

**This document does NOT cover:**
- OS-level native text selection rendering.

## 3. Core Concepts

### 3.1 Cursor Philosophy
- **Concept:** An empty selection. A specific point in the document indicating where the next insertion or deletion command will occur.
- **Runtime State:** Cursor position belongs entirely to the runtime Editor state.
- **Boundaries:** Cursor position is NEVER part of canonical Note content.
- **Identity:** Cursor movement does not modify Note identity.
- **Independence:** Cursor state is independent from persistence and synchronization layers. It belongs exclusively to the local Editor instance.

### 3.2 Selection (Range)
- A continuous span of content defined by an `anchor` (start point) and a `head` (end point).
- Formatting commands typically apply to the entirety of the selected range.

### 3.3 Multi-selection (Future)
- The ability to hold multiple distinct, non-contiguous cursors or selections simultaneously for advanced editing.

## 4. Selection Behavior and Lifecycle

- **Lifecycle:** A selection is established via pointer click/drag or keyboard navigation. It updates continuously as the user moves. It is destroyed when the Editor loses global focus (though the Editor may cache the last known position to restore focus later).
- **Boundaries:** Selections are strictly bound within the Editor's content area.
- **Validation:** Selections must always snap to valid structural boundaries. (e.g., A selection cannot conceptually start halfway through a generic HTML tag; it aligns to the semantic tokens).

## 5. Business Rules

- **Transient State:** Selections are highly volatile runtime states.
- **Persistence Boundary:** The Editor MUST NOT attempt to save cursor position or selection state to the Notes module's persistent database. It is irrelevant to the canonical Note.
- **Identity Independence:** Making a selection never changes a Note's identity or content.
- **Future Extensibility:** The selection model must support future extension (e.g., highlighting a selection to attach a comment block in a future Collaboration module).

## 6. Acceptance Criteria

- Highlighting text and applying a formatting command alters only the highlighted range.
- Closing the Editor and reopening the Note completely resets the cursor to a default position (e.g., the top of the document), proving selection state is not persisted in the Note payload.
