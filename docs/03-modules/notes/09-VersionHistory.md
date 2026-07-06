> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 09 — Version History

---

## 1. Purpose

This document defines the Version History subsystem for a Note. It establishes how historical snapshots of a Note are created, stored, and restored, ensuring users can safely recover previous states of their knowledge data.

## 2. Scope

**This document covers:**
- Version creation (Manual and Automatic).
- Version restoration and browsing.
- Version retention and lifecycle.

**This document does NOT cover:**
- Git-like branch merging or complex differencing algorithms.
- Storage optimization (like storing deltas instead of full payloads).

## 3. Ownership and Responsibilities

- **Owner:** Notes Module. Version history explicitly belongs to the Note.
- **Responsibilities:** Maintain a chronological log of distinct structural states of a Note's payload.

## 4. Version Lifecycle

### 4.1 Version Creation
Versions are explicitly created snapshots. They are not created on every keystroke or Autosave.
- **Automatic Versions:** Created by the system at major milestones (e.g., closing a session that had significant changes, before a major sync conflict overwrite).
- **Manual Versions:** Created explicitly by the user (e.g., triggering a "Save Version" command or Manual Save checkpoint).

### 4.2 Version Browsing and Comparison (Future)
- Users can retrieve a list of metadata for historical versions.
- A future enhancement will allow side-by-side comparison of payloads.

### 4.3 Version Restoration Philosophy
- Restoring a version takes the payload of a historical snapshot and overwrites the *current* Active/Saved payload.
- **Rule:** Restoring an older version does NOT erase history.
- Instead, the selected historical version becomes the current Note content, and a new version entry is created representing the restoration.
- Previous versions remain completely available. History remains continuous.
- **Rule:** Restoring a version DOES NOT change the Note identity (UUID). The Note remains the same entity; it simply reverts its content to an older state.

### 4.4 Version Retention Philosophy
- Version snapshots consume database space.
- Retention policies are configuration concerns rather than strict responsibilities of the Version History domain. The module defines the abstraction and ownership, while the application configures the parameters.
- Examples of retention strategies:
  - Unlimited
  - Keep Last N Versions
  - Time-based Retention (e.g., pruning versions older than 30 days)
- Deleted versions (due to retention pruning) are hard-deleted.

## 5. Business Rules

- **Identity Independence:** Version identifiers (e.g., a version UUID or integer sequence) are entirely separate from Note identifiers.
- **Ownership Bound:** When a Note is permanently deleted, all of its Version History must be permanently deleted in the same transaction.
- **Metadata Encapsulation:** A Version snapshot should capture both the Content payload and the Title metadata at that point in time, as titles often reflect the context of the content.

## 6. Edge Cases and Error Handling

- **Corrupted Version Snapshot:** If a historical version fails validation upon attempted restoration, the system MUST abort the restoration and alert the user, protecting the current active payload.

## 7. Performance Considerations

- Retrieving the list of versions should query only metadata (timestamp, user, size) and defer loading the actual text payloads until specifically requested by the user.

## 8. Acceptance Criteria

- A user can manually trigger a version snapshot.
- Restoring a version successfully replaces the current content without altering the Note's UUID or Folder location.
- Retention policies automatically prune old automatic versions without user intervention.
