> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module, Workspace Module
> **Document Owner:** Core Architecture Team

# Editor Module

---

## 1. Purpose

The Editor module is responsible for creating, displaying, and modifying Note content within the Notebook application. It acts as the interactive presentation layer, bridging user input with the underlying data models.

## 2. Scope

**This document covers:**
- The conceptual business rules and boundaries for editing Note content.
- Editor lifecycles, states, and command processing.
- The separation of concerns between presentation (Editor) and persistence (Notes).

**This document does NOT cover:**
- Technical implementation details (e.g., ProseMirror, Tiptap, React).
- UI layouts, toolbars, or keyboard shortcut mappings.

## 3. Ownership and Responsibilities

- **Ownership:** The Editor module strictly owns editing behavior and visual presentation. It does NOT own the Note domain, identity, or storage.
- **Responsibilities:**
  - Request Note content from the Notes module.
  - Render content into an interactive visual state.
  - Handle user input (keystrokes, commands, selections).
  - Push modified content payloads back to the Notes module for persistence.

## 4. Dependencies

- **Notes Module:** The core dependency. The Editor consumes Notes.
- **Workspace Module:** Provides context (e.g., current active Workspace configuration).
- **Attachments Module (future):** Used for embedding and rendering binary files within the Editor.

## 5. Interfaces and Events

### 5.1 Consumed Interfaces
- `NotesModule.getSession(noteId)`
- `NotesModule.saveSession(sessionId, content)`
- `NotesModule.closeSession(sessionId)`

### 5.2 Published Events
- `EditorInitialized`
- `EditorContentChanged` (Runtime volatile changes)
- `EditorSelectionChanged`
- `EditorCommandExecuted`
- `EditorDisposed`

### 5.3 Consumed Events
- `NoteSaved` (From Notes module, triggering a fresh sync if the Editor fell out of sync)
- `VersionRestored` (Forces the Editor to reload the new active payload)
- `ThemeChanged` (Application level, adjusting Editor presentation)

## 6. Extension Points

- **Custom Nodes/Marks:** The Editor architecture must support plugins registering custom block types (e.g., a custom Kanban node) without modifying the core Editor engine.
- **Command Registration:** Plugins can register new editing commands (e.g., "Format Code").

## 7. Background Jobs

- None. The Editor is a strictly synchronous, user-interactive runtime module.

## 8. Settings

- `DefaultEditorMode`: e.g., 'edit' vs 'read'.
- `TypographyScale`: Preferences for visual text sizing (distinct from semantic headings).

## 9. Business Rules

- **Strict Boundary:** The Editor owns editing behavior, not Note ownership.
- **Immutable Identity:** The Editor never changes Note identity (UUID).
- **Separation of Concerns:** Rendering does not change Note content.
- **Session Decoupling:** Editing sessions are separate domain concepts from the Editor component.

## 10. Acceptance Criteria

- The Editor can successfully load a payload from the Notes module, render it, and push updates back without mutating the Note's UUID.
- The Editor gracefully handles being disposed and re-initialized.

## 11. Cross References

- [01-EditorOverview.md](./01-EditorOverview.md)
- [02-EditorLifecycle.md](./02-EditorLifecycle.md)
- [03-EditorModes.md](./03-EditorModes.md)
- [04-EditorCommands.md](./04-EditorCommands.md)
- [05-SelectionModel.md](./05-SelectionModel.md)
