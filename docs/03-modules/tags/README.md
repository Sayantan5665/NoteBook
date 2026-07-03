# Tags Module

> **Document Type:** Module README
> **Module:** tags
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §13](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §3.4](../../02-database/04-Schema.md) · [../notes/README.md](../notes/README.md) · [../attachments/README.md](../attachments/README.md) · [../search/README.md](../search/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Tags module defines how users create, assign, browse, filter by, rename, and delete tags within a Workspace. Tags are user-defined labels that can be applied to notes and attachments, providing a flexible, flat (non-hierarchical) classification system that complements the folder hierarchy.

Tags are Workspace-scoped — a tag defined in one Workspace is not visible in any other Workspace. Tags are a lightweight cross-cutting concern: the same tag can apply to notes in any folder, and multiple tags can apply to a single note.

---

## Scope

**This module covers:**
- Creating tags (inline during note editing or via the tag manager)
- Applying tags to notes
- Applying tags to attachments
- Removing a tag from a note or attachment
- Browsing all tags in the Workspace (tag browser/sidebar)
- Filtering the note list by one or more tags
- Renaming a tag Workspace-wide (all associations are updated automatically)
- Deleting a tag Workspace-wide (all associations are removed)
- Displaying the tag badge list on a note or attachment
- Autocomplete suggestions when entering tag names

**This module does NOT cover:**
- Tag-based full-text search ranking (see `search/`)
- Tag-based AI filtering (see `ai/`)

---

## Responsibilities

This module is responsible for:

- Creating `tags` table rows (enforcing case-insensitive uniqueness within a Workspace)
- Creating and deleting `note_tags` and `attachment_tags` junction rows
- Providing tag autocomplete data to the editor and note panel
- Providing the complete tag list to the tag browser UI
- Performing Workspace-wide tag rename (updating `tags.name`)
- Performing Workspace-wide tag deletion (deleting `tags` row; cascade removes all junction rows)
- Filtering note list queries by tag (joining through `note_tags`)

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-TagLifecycle.md` | Planned | Create, rename, delete workflows and constraints |
| `02-TagAssignment.md` | Planned | Assigning and removing tags from notes and attachments |
| `03-TagBrowser.md` | Planned | Tag browser/sidebar, tag counts, click-to-filter behavior |
| `04-TagFiltering.md` | Planned | Multi-tag filter semantics (AND vs OR), combined with folder and search filters |

---

## Key Business Rules (Summary)

- Tag names are case-insensitive. "Work" and "work" are the same tag.
- Tag names are stored in a normalized form (lowercase) before saving, regardless of input casing.
- A tag name must be unique within a Workspace. Attempting to create a duplicate tag name is resolved by reusing the existing tag.
- Tags do not have a soft-delete state. Deleting a tag immediately removes it and all its associations.
- Renaming a tag immediately renames it across all associated notes and attachments — there is no batch confirmation required.
- Tags are Workspace-scoped. A tag in Workspace A cannot be applied to content in Workspace B.
- A note or attachment may have any number of tags, including zero.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-TAG-01 | Apply one or more tags to any note or attachment |
| FR-TAG-02 | Tags are user-defined strings, Workspace-scoped |
| FR-TAG-03 | Tag browser listing all Workspace tags |
| FR-TAG-04 | Selecting a tag displays all associated notes and attachments |
| FR-TAG-05 | Tags included in full-text search results |
| FR-TAG-06 | Rename and delete tags Workspace-wide |

---

## Future Considerations

- **Hierarchical tags:** Allowing tags to have parent-child relationships (e.g., `work/project-x`). This would require a schema change and an ADR.
- **Tag colors:** Assigning a color to a tag for visual differentiation. The schema already includes a `color` column; this is a UI feature pending specification.
- **Tag-based note creation:** Creating a new note with a pre-applied tag from the tag browser context.
- **Tag statistics:** Displaying the number of notes and attachments per tag in the tag browser, with trend indicators.
