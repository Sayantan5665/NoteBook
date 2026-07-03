# Wiki Links Module

> **Document Type:** Module README
> **Module:** wikilinks
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §5 FR-NT-03](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §3.8](../../02-database/04-Schema.md) · [../../02-database/11-EntityLifecycle.md](../../02-database/11-EntityLifecycle.md) · [../notes/README.md](../notes/README.md) · [../backlinks/README.md](../backlinks/README.md) · [../editor/README.md](../editor/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Wiki Links module defines the behavior of `[[Note Title]]` internal links — the syntax that allows users to create navigable connections between notes within the same Workspace.

When a user types `[[Note Title]]` in the editor, the application resolves the reference to the target note by title, creates a persistent link record, and enables navigation from the source note to the target note with a single click. The module also governs link maintenance: what happens when the linked note is renamed, moved, or deleted.

Wiki links are the primary mechanism for building a connected knowledge graph within a Workspace.

---

## Scope

**This module covers:**
- `[[Note Title]]` syntax recognition in the editor
- Autocomplete suggestions during `[[` input
- Link resolution: matching typed text to an existing note title
- Unresolved links: links that reference a note that does not exist
- Navigation: clicking a wiki link opens the referenced note
- Link record maintenance in `wiki_links` table
- Link updates when a referenced note is renamed
- Link behavior when the referenced note is soft-deleted
- Link behavior when the referenced note is permanently deleted

**This module does NOT cover:**
- Backlink maintenance (the reverse direction — see `backlinks/`)
- External hyperlinks (URLs starting with `https://` etc.)
- Editor syntax highlighting of wiki links (documented in `editor/`)

---

## Responsibilities

This module is responsible for:

- Detecting `[[...]]` patterns in note content during and after editing
- Providing a real-time autocomplete list of note titles matching the typed text
- Resolving wiki link text to a target note UUID at save time
- Inserting and replacing `wiki_links` table rows on every note save (the entire set of outgoing links is recomputed on each save)
- Updating `wiki_links.resolved` and `wiki_links.target_note_id` when a referenced note is renamed
- Setting `wiki_links.target_note_id = NULL` when a referenced note is deleted (marking the link as unresolved)
- Navigating the UI to the target note on link click

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-WikiLinkSyntax.md` | Planned | Syntax rules, autocomplete behavior, and display rendering |
| `02-WikiLinkResolution.md` | Planned | Resolution algorithm, case sensitivity, duplicate title handling |
| `03-WikiLinkMaintenance.md` | Planned | Link updates on note rename, soft delete, and permanent delete |
| `04-WikiLinkNavigation.md` | Planned | Click-to-navigate behavior, target note opening |

---

## Key Business Rules (Summary)

- Wiki link resolution is case-insensitive for matching purposes; the stored link text preserves the user's original casing.
- When a note has a duplicate title (multiple notes with the same name), the resolution is ambiguous. The application prompts the user to select the intended target during edit, or falls back to the most recently created note with that title.
- Wiki link records are deleted and recomputed on every note save — they are not incrementally updated.
- A wiki link with `resolved = 0` (unresolved) is still stored. The link text is preserved for display, and the UI indicates the link is broken.
- Wiki links are scoped to a single Workspace — a note in Workspace A cannot link to a note in Workspace B.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-NT-03 | `[[Note Title]]` links that navigate to the referenced note |
| FR-NT-04 | Bidirectional backlinks automatically maintained |
| FR-NT-05 | Backlinks updated when a note is renamed, moved, or deleted |

---

## Future Considerations

- **Alias support:** `[[Note Title|Display Text]]` syntax to allow a link to display different text from the note title.
- **Block references:** Link to a specific block or heading within a note, not just the note itself.
- **Cross-Workspace links:** Linking to notes in other Workspaces. This is architecturally significant and would require an ADR — the current Workspace isolation model prevents it.
- **Link preview on hover:** Displaying a content preview tooltip when hovering over a wiki link.
