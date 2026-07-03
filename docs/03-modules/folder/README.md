# Folder Module

> **Document Type:** Module README
> **Module:** folder
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §4](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §3.1](../../02-database/04-Schema.md) · [../../02-database/11-EntityLifecycle.md §4](../../02-database/11-EntityLifecycle.md) · [../workspace/README.md](../workspace/README.md) · [../notes/README.md](../notes/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Folder module defines how folders are created, named, nested, moved, deleted, and displayed within a Workspace. Folders are organizational containers — they group notes into a navigable hierarchy. They are not content themselves; they provide structure for content.

Folders in Notebook are optional. Notes may exist at the root level of a Workspace without being assigned to a folder. When folders exist, they form a tree of arbitrary depth. The sidebar displays this tree, allowing users to navigate their knowledge structure.

---

## Scope

**This module covers:**
- Creating folders at the root level or within an existing folder
- Renaming folders
- Moving folders (changing parent) including recursive content movement
- Reordering folders within the same parent
- Soft-deleting folders and their contents (moving to Trash)
- Restoring folders from Trash
- Permanently deleting folders from Trash
- Displaying the folder tree in the navigation sidebar
- Expanding and collapsing folder nodes in the sidebar

**This module does NOT cover:**
- Note management within folders (see `notes/`)
- Trash browsing and management (shared concern documented within `notes/` and `attachments/` for their respective entity types)
- Attachment management (see `attachments/`)

---

## Responsibilities

This module is responsible for:

- Creating `folders` table rows with correct parent relationships
- Enforcing the self-referential hierarchy (a folder may have one parent; root folders have no parent)
- Cascading soft deletes: soft-deleting a folder soft-deletes all descendant folders and all notes within them
- Ensuring folder moves maintain referential integrity (a folder cannot be moved into one of its own descendants)
- Maintaining `display_order` for user-defined sort positions within a parent
- Providing the folder tree data to the UI sidebar

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-FolderLifecycle.md` | Planned | Create, rename, move, delete, restore workflows and state diagram |
| `02-FolderHierarchy.md` | Planned | Tree structure rules, depth limits, ordering, and sidebar rendering |
| `03-FolderTrash.md` | Planned | Soft delete cascade, Trash behavior, restore behavior, permanent delete |

---

## Key Business Rules (Summary)

- Folder names within the same parent are not required to be unique — duplicate names are permitted.
- A folder cannot be its own ancestor (no circular parent references).
- Deleting a folder soft-deletes all descendant folders and their notes in a single atomic operation.
- A note within a deleted folder inherits the folder's `deleted_at` timestamp for restore coordination.
- Permanently deleting a folder does not permanently delete notes — notes become root-level (folder-less), per the `ON DELETE SET NULL` cascade rule.
- Folder `display_order` is maintained per parent and used for sidebar ordering.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-FL-01 | Create folders within a Workspace |
| FR-FL-02 | Support nested folder hierarchies of arbitrary depth |
| FR-FL-03 | Rename folders |
| FR-FL-04 | Move folders and their contents |
| FR-FL-05 | Delete folders; contents move to Trash |
| FR-FL-06 | Display folder hierarchy in navigational sidebar |

---

## Future Considerations

- **Folder icons and colors:** Allow users to assign a custom icon or color to a folder for visual differentiation in the sidebar.
- **Folder sorting modes:** Allow per-folder sorting of child notes by title, creation date, or update date, in addition to the current manual `display_order`.
- **Folder-level tags:** Allow tags to be applied to an entire folder, automatically applying them to all notes within.
- **Smart folders (saved searches):** Virtual folders that dynamically display notes matching a saved search query, without containing notes physically.
