# Editor Module

> **Document Type:** Module README
> **Module:** editor
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §5](../../00-overview/04-FunctionalRequirements.md) · [../../01-architecture/01-SystemOverview.md §3](../../01-architecture/01-SystemOverview.md) · [../../02-database/04-Schema.md §3.2](../../02-database/04-Schema.md) · [../notes/README.md](../notes/README.md) · [../wikilinks/README.md](../wikilinks/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Editor module defines the behavior of the rich text editing surface — the interface through which users create and modify note content. The editor is powered by Tiptap (a ProseMirror-based extensible editor) and is the primary input mechanism for all note content.

The Editor module focuses on what the editor does: what formatting is supported, how content is saved, how autosave works, how the toolbar behaves, and what the editor does when the user performs specific editing actions. Implementation details of the Tiptap library are not the concern of this module — behavior is.

---

## Scope

**This module covers:**
- Supported rich text formatting elements (headings, paragraphs, lists, tables, code blocks, etc.)
- Toolbar behavior and formatting commands
- Autosave: trigger conditions, debounce behavior, and save confirmation
- Manual save (Ctrl/Cmd+S)
- Reading and writing note content as Tiptap JSON
- Handling paste events (rich content, plain text, images)
- Drag-and-drop into the editor (files, text)
- Focus management and editor initialization
- Character count and word count display in the editor status bar
- Editor keyboard shortcuts
- Undo and redo within the editor session

**This module does NOT cover:**
- Note creation and deletion (see `notes/`)
- Wiki link syntax and navigation (see `wikilinks/`)
- Attachment uploading and management (see `attachments/`)
- Version history creation (triggered by note save, documented in `notes/`)
- Plugin-contributed editor extensions (see `plugins/`)

---

## Responsibilities

This module is responsible for:

- Defining the complete list of supported formatting nodes and marks
- Defining toolbar command availability and active state rules
- Defining the autosave mechanism: debounce interval, dirty-state tracking, and save trigger
- Ensuring the editor serializes content as Tiptap JSON on every save
- Ensuring plain text is extracted from Tiptap JSON for FTS5 and embedding input
- Handling editor initialization from a persisted Tiptap JSON document
- Managing the editor's undo/redo stack (session-scoped; does not persist)

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-FormattingElements.md` | Planned | Complete list of supported nodes (headings, lists, code blocks, tables, etc.) and marks (bold, italic, etc.) |
| `02-Autosave.md` | Planned | Autosave trigger conditions, debounce window, dirty-state tracking, save indicators |
| `03-Toolbar.md` | Planned | Toolbar item definitions, active state rules, keyboard shortcuts |
| `04-ContentPaste.md` | Planned | Paste handling for rich text, plain text, images, and external HTML |
| `05-EditorKeyboardShortcuts.md` | Planned | Full keyboard shortcut reference for editor commands |

---

## Key Business Rules (Summary)

- The Tiptap JSON document is the authoritative representation of note content. Generated HTML is a rendering artifact and is never persisted.
- Autosave fires after a configurable debounce period following the last user keystroke. It does not fire on every keystroke.
- If autosave is in progress when the user closes a note, the application waits for the save to complete before releasing the editor.
- The undo/redo stack is session-scoped — it resets when a note is closed and reopened.
- Pasting content from external sources strips unsafe HTML (scripts, iframes) before inserting into the editor.
- The editor must render all supported formatting elements without data loss on open after save.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-NT-02 | Rich text editor supports: H1–H6, bold, italic, underline, strikethrough, inline code, code blocks, ordered/unordered/task lists, tables, blockquotes, horizontal rules, embedded images |
| FR-NT-09 | Display word count, character count, last-modified |
| FR-NT-10 | Autosave at configurable interval or on each edit event |

---

## Future Considerations

- **Plugin-contributed editor nodes:** The Tiptap extension model allows plugins to contribute custom node types (e.g., math equations, draw.io diagrams, Kanban boards). The plugin system defines the API; this module defines the integration contract.
- **Slash commands:** Typing `/` to trigger a command palette within the editor for inserting blocks, templates, or AI assistance.
- **AI-assisted writing:** Inline AI suggestions for grammar correction, summarization, or content generation. This integrates the editor with the `ai/` module.
- **Full-screen / distraction-free mode:** A writing mode that hides the sidebar and toolbar for focus writing.
- **Multi-cursor / multi-selection:** Advanced selection operations beyond the standard single-cursor model.
