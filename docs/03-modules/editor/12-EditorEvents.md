> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module, Workspace Module
> **Document Owner:** Core Architecture Team

# 12 — Editor Events

---

## 1. Purpose

This document outlines the conceptual event model for the Editor module. It defines how the Editor communicates user intent and UI state changes to the surrounding application architecture, while strictly separating UI behavior from domain persistence.

## 2. Scope

**This document covers:**
- Published Events emitted by the Editor.
- Consumed Events listened to by the Editor.
- Event ordering philosophy.

**This document does NOT cover:**
- Implementation-specific event bus implementations (e.g., RxJS, native DOM events).

## 3. Ownership and Philosophy

- **Ownership:** The Editor owns events that describe *editing behavior* and *UI state*. 
- **Separation of Concerns:** Business domain events (e.g., `NoteSaved`, `NoteCreated`) remain strictly owned by the Notes module. The Editor never emits `NoteSaved` directly; it emits `EditorSaveRequested`, prompting the Notes module to act and subsequently emit `NoteSaved`.

## 4. Published Events

The Editor broadcasts these events to the system.

### 4.1 Editor Lifecycle Events
- **`EditorInitialized`**: Emitted when the component has successfully mounted and parsed the initial payload.
- **`EditorDisposed`**: Emitted when the component unmounts safely.

### 4.2 Content Editing Events
- **`EditorContentChanged`**: Emitted whenever the volatile payload mutates. Used primarily to trigger Autosave debounce timers or word count updates.

### 4.3 Selection Events
- **`EditorSelectionChanged`**: Emitted when the cursor moves or text is highlighted. Used to update context-aware toolbars (e.g., highlighting the "Bold" button if the cursor lands inside bold text).

### 4.4 Formatting and Command Events
- **`EditorCommandExecuted`**: Emitted when a specific command (e.g., "Toggle Heading 1") is successfully applied. Useful for analytics or macro recording.

### 4.5 Clipboard Events
- **`EditorPasteIntercepted`**: Emitted when external content is pasted and sanitized.

### 4.6 Save-Related Events (Reference)
- **`EditorSaveRequested`**: Emitted when the user explicitly triggers a manual save command (e.g., `Ctrl+S`). The Notes module listens for this.

## 5. Consumed Events

The Editor listens to these events from the broader system to adjust its behavior.

- **`NoteSaved`**: Emitted by the Notes module. The Editor consumes this to clear its internal `Dirty` state flags and update visual indicators.
- **`VersionRestored`**: Emitted by the Notes module. Forces the Editor to gracefully replace its entire volatile state with the newly restored payload.
- **`ThemeChanged`**: Emitted by the Application. Adjusts the Editor's rendering (e.g., Dark Mode).

## 6. Business Rules

- **Events Describe Behavior Only:** Editor events must only carry data regarding the editing session (e.g., the current selection range, the dirty status flag), NOT persistent database mutations.
- **Decoupled Architecture:** The Editor broadcasts events blindly. It does not know if a Toolbar or an Autosave timer is listening.

## 7. Event Ordering Philosophy

A typical interaction cascade:
`User Types` &rarr; `EditorContentChanged` &rarr; `(Application debounces timer)` &rarr; `EditorSaveRequested (Autosave)` &rarr; `Notes Module Saves DB` &rarr; `NoteSaved` &rarr; `Editor Clears Dirty State`.

## 8. Error Handling and Edge Cases

- **Event Flooding:** Events like `EditorContentChanged` and `EditorSelectionChanged` fire extremely rapidly. The Event Bus or the immediate consumers MUST implement debouncing or throttling to prevent CPU spikes.

## 9. Acceptance Criteria

- Typing in the Editor triggers `EditorContentChanged` without triggering `NoteSaved`.
- Moving the cursor updates toolbar state purely via `EditorSelectionChanged` without requiring a full React/DOM re-render of the Editor canvas.
