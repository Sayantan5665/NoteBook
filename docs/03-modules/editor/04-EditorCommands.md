> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 04 — Editor Commands

---

## 1. Purpose

This document defines the conceptual command model within the Editor. It establishes how user intent (like typing or pressing a formatting button) is translated into structured mutations on the active content payload.

## 2. Scope

**This document covers:**
- Command categories (Insertion, Deletion, Formatting, History, Clipboard).
- The Command Execution Lifecycle.
- Command validation.

**This document does NOT cover:**
- Keyboard shortcuts mapping to these commands.
- Specific programmatic API calls (e.g., `editor.chain().focus().toggleBold().run()`).

## 3. Conceptual Commands

### 3.1 Undo / Redo Philosophy
- **Concept:** Reverts or reapplies the previous conceptual command.
- **Undo / Redo History:** A transient runtime state that operates only within the current editing session.
- **Version History:** A persistent record of the Note's state over time, managed by the Notes module.
- **Relationship & Boundaries:**
  - Clearing the Undo history (e.g., by closing the Editor) does not affect Version History.
  - Restoring a historical version from Version History is NOT equivalent to an Undo command; it creates a new active payload and a new Version History entry.
  - *Conceptual Diagram (Mental Model):*
    `Editing Session (Transient Undo History) <---> Canonical Note (Persistent Version History)`

### 3.2 Clipboard Commands
- **Copy / Cut / Paste:** Handles moving rich text and plain text into and out of the Editor. Paste commands are responsible for sanitizing incoming data to match the Editor's allowed schema.

### 3.3 Selection Commands
- **Select All:** Expands the selection boundaries to encapsulate the entire document.

### 3.4 Mutation Commands
- **Insert:** Adding text, paragraphs, or blocks (e.g., Code Blocks, Tables) at the cursor.
- **Delete:** Removing content at the cursor or within the active selection.

### 3.5 Formatting Commands
- **Inline Marks:** Applying styling (Bold, Italic, Strikethrough) to text ranges.
- **Block Nodes:** Converting blocks (e.g., turning a Paragraph into an H1 Heading or a Quote).

## 4. Command Execution Lifecycle

1. **Trigger:** The user initiates a command via keyboard, toolbar, or menu.
2. **Validation:** The Editor verifies if the command is valid given the current context (e.g., you cannot apply "Heading" formatting inside a "Code Block").
3. **Execution:** The Editor mutates its internal volatile state.
4. **Event Emission:** The Editor emits an `EditorCommandExecuted` or `EditorContentChanged` event.
5. **Autosave Trigger:** The mutation flags the Editor as `Dirty`, eventually triggering a handoff to the Notes module.

## 5. Business Rules

- **Content Only:** Commands operate strictly on the content payload. No Editor command can directly modify a Note's metadata (like Title or UUID) unless explicitly bridging to a specialized UI input.
- **Sanitization:** Paste commands MUST sanitize incoming HTML/text to prevent schema corruption or malicious injection (XSS).
- **Session Scoped History:** Undo/Redo stacks are destroyed when the Editor is closed. They are not persisted.

## 6. Error Handling

- Invalid commands (e.g., trying to execute a table command when no table is selected) should fail silently or securely disable the corresponding UI trigger.

## 7. Acceptance Criteria

- Executing a Bold command correctly wraps the selected text in the appropriate semantic markup.
- Pasting external HTML successfully strips unsupported tags and retains only schema-approved content.
