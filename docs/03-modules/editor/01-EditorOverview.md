> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 01 — Editor Overview

---

## 1. Purpose

This document provides a conceptual overview of the Editor module. It defines the architectural responsibilities of the Editor and establishes clear boundaries between the Editor and the core Notes domain.

## 2. Responsibilities

- **Rendering:** Transforming semantic Note content (e.g., JSON or Markdown) into a visual, interactive interface.
- **Input Handling:** Capturing user keystrokes, pointer interactions, and editing commands.
- **Volatile State Management:** Maintaining the active, unsaved modifications during an editing session.

## 3. Editor Runtime State
- **Concept:** Transient state variables maintained entirely by the Editor while it is active.
- **Examples:**
  - Active cursor position
  - Current selection range
  - Scroll position
  - Focus state
  - Active formatting context
  - Active editing session ID
- **Clarification:** Runtime state belongs strictly to the Editor. It is temporary and is NEVER part of canonical Note data.

## 3. Conceptual Architecture and Boundaries

### 3.1 Ownership Boundaries
The most critical architectural principle of the Notebook application is the separation of Content Ownership from Presentation:
- **The Editor DOES NOT own Notes.** It acts as a temporary consumer and mutator of a Note's content payload.
- **The Notes Module owns Notes.** It governs identity (UUID), persistence, lifecycle, and metadata.

### 4.2 Editor vs Note vs Editing Session
- **Note:** The persistent, canonical data record residing in the database.
- **Editing Session:** A temporary, logical lock managed by the Notes module to ensure a Note is safely opened and saved.
- **Editor:** The UI component that presents the active session to the user.

### 4.3 Canonical Editing Flow
A conceptual workflow describing the relationship between the Editor and the Notes module:
`Canonical Note` &rarr; `Editor` &rarr; `Editing Session` &rarr; `Validation` &rarr; `Persistence` &rarr; `Version History` &rarr; `Business Events`

- The Note remains the canonical source of truth.
- The Editor modifies Note content but does not own the Note.
- Version History stores historical revisions.
- Business events notify downstream modules.
- Search, AI, and Synchronization consume published changes.

## 4. Subsystem Interactions

### 4.1 Interaction with Notes
- The Editor asks the Notes module for the current content payload.
- The Editor never modifies the Note's UUID or core metadata (like Creation Date) directly.

### 4.2 Interaction with Editing Sessions
- The Editor initiates an Editing Session when it mounts.
- It pushes volatile changes (the "Dirty State") to the Session.
- It terminates the Session when the Editor unmounts.

### 4.3 Interaction with Version History
- The Editor does not directly create Version History. It triggers a "Save" action, and the Notes module decides if a formal Version snapshot is warranted.

### 4.4 Interaction with Autosave
- The Editor emits `ContentChanged` events or directly calls a throttled save function.
- Autosave logic (when to save, how to debounce) conceptually lives outside the Editor's rendering loop to ensure performance.

### 4.5 Interaction with Clipboard
- The Editor handles parsing incoming clipboard data (e.g., stripping harmful HTML, converting rich text to semantic payloads) and serializing outgoing clipboard data.

### 4.6 Interaction with Drag & Drop
- The Editor manages drop zones for text and future attachments, translating screen coordinates into document insertion points.

## 5. Business Rules

- **Rendering is Non-Destructive:** The act of rendering a Note MUST NOT change its persistent content.
- **Immutable Identity:** No Editor action can ever change a Note's UUID.
- **Content Focus:** Editor commands operate strictly on the content payload, not on the Note's metadata.

## 6. Acceptance Criteria

- The Editor successfully completely mounts and unmounts without corrupting the Note's UUID.
- The Editor can be swapped out entirely for a plain-text textarea without breaking the core Notes module functionality.
