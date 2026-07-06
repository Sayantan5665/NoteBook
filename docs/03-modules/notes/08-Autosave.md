> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 08 — Autosave

---

## 1. Purpose

This document outlines the Autosave subsystem within the Notes module. It defines how volatile changes in an Editing Session are automatically flushed to persistent storage, protecting user data from unexpected loss.

## 2. Scope

**This document covers:**
- Autosave triggers (Idle, Periodic, Shutdown, Manual).
- Crash protection mechanisms.
- Interaction with the Recovery subsystem.

**This document does NOT cover:**
- Implementation-specific timer intervals (e.g., exactly "5 seconds").
- Synchronization implementation.

## 3. Autosave Philosophy

- **Never Destroy User Work:** Autosave must prioritize saving changes safely. It must never silently overwrite a newer persistent state with an older volatile state.
- **Transparent:** Autosave should run entirely in the background without interrupting the user's editing flow.
- **Pragmatic Versioning:** Autosave commits data to the database but does NOT create a formal "Version History" snapshot on every single save to prevent database bloat.
- **Decoupled:** Autosave does not depend on Synchronization. It saves locally.

## 4. Trigger Conditions

### 4.1 Idle Save
- Triggered when the user pauses typing for a predefined threshold.
- Ensures the user's latest thought is captured without waiting for a rigid timer.

### 4.2 Periodic Save
- A fallback mechanism that forcefully saves the document after a maximum elapsed time, even if the user has not stopped typing.
- Protects against data loss during long, continuous typing sessions.

### 4.3 Application Shutdown / Session End
- Triggered immediately when the application is requested to close or the Editing Session is terminated.
- **Rule:** The application MUST block shutdown until this final save is successfully completed or a timeout is reached.

### 4.4 Manual Save
- Triggered explicitly by the user (e.g., `Ctrl+S`).
- Conceptually different from Autosave: Manual saves often serve as explicit user checkpoints, potentially triggering a formal Version History snapshot, whereas Autosave is just implicit persistence.

## 5. Conceptual Save Pipeline

When any of the above triggers fire, the system executes the following conceptual business workflow:

`Edit` &rarr; `Validation` &rarr; `Persistence` &rarr; `Version Creation (if applicable)` &rarr; `Publish Business Events` &rarr; `Clear Dirty State`

- **Conceptual Workflow:** This defines the business expectations, not the exact programmatic implementation.
- **Separation of Concerns:** Persistence (writing to the SQLite database) and Event Publication (broadcasting over the EventBus) remain distinct and separate responsibilities within this pipeline.

## 6. Business Rules

- **Identity Preservation:** Autosave operations NEVER change the Note UUID.
- **Atomic Writes:** The save operation MUST be atomic. A crash mid-autosave must not result in a corrupted database record. (Rely on SQLite WAL).
- **No Unnecessary Versions:** Autosave overwrites the current "Saved" state payload; it does not append thousands of micro-revisions.
- **Validation:** If the volatile payload is structurally invalid, Autosave MUST abort and log an error rather than corrupting the database.

## 6. Interaction with Crash Protection & Recovery

If the application crashes, the volatile memory is lost. The Autosave subsystem minimizes this loss window. 
- *Future Enhancement:* A local, unencrypted temporary WAL/Cache file could be used to write every keystroke, but the core Autosave relies on frequent SQLite commits.

## 7. Failure Handling and Edge Cases

- **Disk Full:** If an Autosave fails due to insufficient disk space, the subsystem MUST pause further autosaves and immediately alert the user to prevent them from typing into a void.
- **Database Locked:** If the SQLite database is temporarily locked by another process (e.g., a massive search index build), the Autosave should quietly retry with exponential backoff.

## 8. Performance Considerations

- Autosave must be fully asynchronous off the main UI thread. 
- Debouncing must be strictly enforced so rapid keystrokes do not flood the database with write requests.

## 9. Acceptance Criteria

- Changes made to a Note are persisted automatically without explicit user action.
- Force-quitting the application results in a maximum data loss equivalent only to the periodic save threshold.
- A Manual Save resets the Idle and Periodic Autosave timers.
