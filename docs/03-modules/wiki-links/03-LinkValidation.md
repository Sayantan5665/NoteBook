> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 03 — Link Validation

---

## 1. Purpose

This document outlines the principles and workflows for validating Wiki Links. Validation ensures that the conceptual knowledge graph remains accurate and that users are informed when relationships decay.

## 2. Validation Philosophy

- **Protection of Integrity:** Validation protects relationship integrity. It ensures the graph accurately reflects the current state of the database.
- **Non-Destructive:** Validation NEVER modifies the source Note's content payload. If a link breaks, the graph index is updated, but the text typed by the user remains intact.

## 3. Link States

### 3.1 Valid Links
- The Source Note contains a reference to a Target Note UUID that currently exists in an `Active` or `Archived` state within the Workspace.

### 3.2 Broken Links
- **Missing Notes:** The Target Note UUID does not exist in the database. (e.g., an export/import failed to copy the target note).
- **Deleted Notes:** The Target Note has been permanently deleted.
- **Trashed Notes:** The Target Note is in the Trash. Conceptually, links to Trashed Notes are treated as broken until restored.

### 3.3 Archived Notes
- Links pointing to Archived Notes are considered **Valid**, though the UI may render them distinctly (e.g., dimmed) to indicate the target's organizational state.

### 3.4 Future External Links
- Cross-workspace or cross-domain links. Validation mechanisms for these will differ (e.g., HTTP status checks).

## 4. Validation Workflow

1. A Note is saved, or a bulk validation job runs.
2. The Wiki Links module extracts all UUIDs referenced in the Note's payload.
3. The module queries the Notes module database to verify existence and state of each UUID.
4. The module updates the internal graph registry, flagging each edge as `Valid` or `Broken`.
5. The Editor consumes this status to render the links appropriately (e.g., red text for broken links).

## 5. Business Rules

- **Visibility:** Broken links remain visible in the Editor. The user must decide how to handle them (delete the text, or create a new target note).
- **Graceful Degradation:** A broken link degrades to plain text conceptually (though it may retain link styling in the UI to encourage the user to fix it).

## 6. Error Handling

- **Database Unreachable:** If the module cannot query the Notes database during validation, it must temporarily assume links are Valid rather than spuriously flagging the entire graph as Broken.

## 7. Acceptance Criteria

- When a target Note is moved to the Trash, all incoming links to that Note are immediately flagged as broken.
- When the target Note is restored from the Trash, all incoming links are instantly re-validated as functional without any edits required in the source Notes.
