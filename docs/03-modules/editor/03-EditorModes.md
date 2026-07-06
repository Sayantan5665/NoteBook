> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 03 — Editor Modes

---

## 1. Purpose

This document defines the conceptual operating modes of the Editor. Modes dictate how the Editor presents content and how (or if) it responds to user input, providing tailored experiences for different workflows.

## 2. Scope

**This document covers:**
- Conceptual editing modes (Read, Edit, Focus, Distraction-Free, Read-Only).
- State transitions between modes.

**This document does NOT cover:**
- UI layout specific to each mode (e.g., exactly which toolbars are hidden).
- Operating system-level full-screen mechanics.

## 3. Editor Modes

### 3.1 Edit Mode (Default)
- **Purpose:** The standard interaction paradigm for actively creating or modifying content.
- **Behavior:** The cursor is active, selection commands work, and content modification commands (typing, deleting, formatting) are fully processed.

### 3.2 Read Mode
- **Purpose:** Optimized for consuming content without accidental modification.
- **Behavior:** The Editor ignores all content modification commands. Selection (copying) remains active. Hyperlinks are directly clickable without modifier keys.

### 3.3 Read Only Mode (Future)
- **Purpose:** A strict enforcement mode (e.g., viewing a Trashed Note, viewing an old Version History snapshot, or lacking permissions).
- **Behavior:** Identical to Read Mode, but the application explicitly disables the ability to transition back into Edit Mode.

### 3.4 Focus Mode (Future)
- **Purpose:** To highlight the current sentence or paragraph while fading out the rest of the text.
- **Behavior:** Operates as a visual filter on top of Edit Mode. Content modification behaves identically to Edit Mode.

### 3.5 Distraction Free Mode (Future)
- **Purpose:** To remove extraneous UI elements (toolbars, sidebars) to maximize writing space.
- **Behavior:** A UI configuration wrapper around Edit Mode.

## 4. State Transitions

- The Editor can smoothly transition between `Read Mode` and `Edit Mode` at runtime (e.g., via a toggle switch).
- Transitioning into `Read Only Mode` is typically dictated at initialization by the underlying Note state.

## 5. Business Rules

- **Content Integrity:** Switching modes MUST NOT modify the underlying Note payload.
- **Mode Independence:** Modes alter the Editor's interpretation of input, but they do not alter the core Note domain.

## 6. Acceptance Criteria

- Switching from Edit Mode to Read Mode successfully prevents keystrokes from mutating the content payload.
- Links are natively clickable in Read Mode.
