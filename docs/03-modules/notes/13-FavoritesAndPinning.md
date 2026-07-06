> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 13 — Favorites and Pinning

---

## 1. Purpose

This document outlines the user-controlled metadata flags for `Favorite` and `Pinned` Notes. It defines how users can prioritize and organize their most important Notes independently of the Folder hierarchy.

## 2. Scope

**This document covers:**
- The conceptual definitions and business rules for Favorites and Pinning.
- Sorting and filtering behaviors influenced by these flags.

**This document does NOT cover:**
- The specific UI design of the sidebar or folder tree.

## 3. Core Concepts

### 3.1 Favorites
- **Concept:** A user-curated list of highly important or frequently accessed Notes.
- **Interaction:** Users manually toggle the Favorite status.
- **Behavior:** Typically aggregated into a dedicated "Favorites" or "Bookmarks" view, spanning across all Folders in a Workspace.

### 3.2 Pinned Notes
- **Concept:** A mechanism to force specific Notes to the top of a list view, overriding default sorting (like alphabetical or chronological).
- **Interaction:** Users manually toggle the Pin status.
- **Behavior:** Pinned Notes appear at the absolute top of their respective Folder view or global list view.

## 4. Business Rules

- **Independent Concepts:** Favorite status and Pin status are completely independent. A Note can be Pinned but not a Favorite, a Favorite but not Pinned, or both simultaneously.
- **Presentation Only:** Pinned and Favorite statuses influence presentation (sorting and filtering) ONLY. 
- **Identity Preservation:** Toggling a Note's Favorite or Pin status mutates its metadata but NEVER affects the Note's permanent identity (UUID) or its content payload.

## 5. Sorting and Filtering Behavior

- **Sorting (Pinning):** In any list view that respects Pinning, Pinned Notes MUST be evaluated first. If multiple Notes are Pinned, the secondary sort (e.g., Alphabetical) applies among the Pinned group, followed by the unpinned Notes.
- **Filtering (Favorites):** The Favorites view acts as a global filter across the Workspace, returning all Notes where `isFavorite == true`.

### 5.1 Favorite Ordering Philosophy
- **No Inherent Order:** Favorite status does not imply any inherent ordering of the Notes. It is simply a user preference flag.
- **View Configuration:** Ordering within the Favorites list is determined entirely by user-selected view configurations (e.g., sort by modified date, sort alphabetically).
- **Presentation Layer:** Sorting behavior belongs strictly to the presentation/UI layer, rather than the core Note domain.

## 6. Future Enhancements

- **Manual Sorting of Favorites:** Allowing users to drag-and-drop the order of their Favorites list, stored as a specific order array in the Workspace configuration.
- **Pinning Folders:** Extending the pin logic to entire Folders.

## 7. Acceptance Criteria

- Toggling Favorite or Pin status updates the Note's metadata without triggering a content save payload.
- Pinned Notes successfully sort above unpinned Notes regardless of standard alphabetical/chronological sorting.
