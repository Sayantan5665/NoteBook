> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Notes Module
> **Document Owner:** Core Architecture Team

# 02 — Backlinks

---

## 1. Purpose

This document defines the Backlink concept. Backlinks are the automatic inverse of Wiki Links, allowing users to discover which Notes are referencing the Note they are currently viewing.

## 2. Concept

If Note A contains a Wiki Link to Note B, then Note B automatically possesses a Backlink from Note A.

## 3. Ownership and Derivation

- **Ownership:** The Wiki Links module owns the calculation and aggregation of Backlinks.
- **Derived Data:** Backlinks are strictly derived relationships. They are computed dynamically or via an index based on the primary Wiki Links (forward links).
- **No Manual Editing:** Users NEVER manually create, edit, or delete a Backlink directly. A Backlink can only be removed by deleting the corresponding forward Wiki Link in the Source Note.

## 4. Discovery and Visibility

- **Automatic Generation:** The system automatically surfaces Backlinks whenever a Note is viewed.
- **Visibility:** Backlinks are typically displayed at the bottom of the Target Note or in a dedicated side pane.
- **Filtering:** The UI may allow users to filter Backlinks (e.g., sorting by creation date, filtering by folder, or hiding Backlinks from Archived Notes).

## 5. Future Enhancements

- **Unlinked Mentions:** The ability to scan the Workspace for text that matches a Note's title but isn't explicitly linked, suggesting them as potential new Wiki Links.
- **Contextual Snippets:** Displaying the surrounding text (the paragraph) where the Wiki Link was used in the Source Note, rather than just listing the Source Note's title.

## 6. Business Rules

- **Asymmetric Persistence:** Forward links are persisted as part of the Note content; Backlinks are NOT persisted in the Target Note's content. They reside in a relational index or graph database layer.
- **Instant Updating:** When a forward link is removed, the corresponding Backlink must be immediately removed from the graph index.
- **Duplicate Links:** A Note may contain multiple references to the same target Note. Multiple references remain valid. Backlinks represent the *existence* of a relationship rather than duplicating identical relationship entries. The presentation of duplicate backlinks is implementation dependent.

## 7. Acceptance Criteria

- Creating a Wiki Link in Note A pointing to Note B automatically populates a Backlink on Note B pointing back to Note A.
- Deleting the Wiki Link in Note A instantly removes the Backlink from Note B.
- Attempting to manually edit the content of Note B does not expose any Backlink syntax for modification.
