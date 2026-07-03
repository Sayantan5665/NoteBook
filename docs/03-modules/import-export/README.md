# Import / Export Module

> **Document Type:** Module README
> **Module:** import-export
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §15](../../00-overview/04-FunctionalRequirements.md) · [../../00-overview/04-FunctionalRequirements.md §16](../../00-overview/04-FunctionalRequirements.md) · [../../00-overview/03-Scope.md](../../00-overview/03-Scope.md) · [../notes/README.md](../notes/README.md) · [../attachments/README.md](../attachments/README.md) · [../plugins/README.md](../plugins/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Import / Export module defines how content is moved into and out of Notebook in standard, open formats. It ensures that user data is never locked inside Notebook — notes can always be exported to Markdown, and Markdown files from other tools can always be imported.

Import and export are the user's guarantee of data portability. Unlike sync (which replicates the Workspace) and backup (which archives the Workspace), import/export translates between Notebook's internal format and open standards.

---

## Scope

**This module covers:**
- Importing individual Markdown files (`.md`) as notes
- Importing individual plain text files (`.txt`) as notes
- Bulk importing a directory of Markdown or text files
- Title extraction from file name or YAML front matter
- Exporting individual notes as Markdown files
- Exporting individual notes as plain text files
- Exporting an entire Workspace as a directory of Markdown files, preserving folder hierarchy
- Formatting preservation on export (headings, lists, tables, bold, italic, code blocks)
- Plugin extension points for additional import/export formats

**This module does NOT cover:**
- Workspace archive backup/restore (see `backup/`)
- Google Drive sync (see `sync/`)
- PDF export (plugin-provided)
- HTML export (plugin-provided)
- Notion, Evernote, Obsidian import (plugin-provided)

---

## Responsibilities

This module is responsible for:

- Reading source files from the local filesystem for import
- Converting Markdown and plain text input to Tiptap JSON for storage
- Creating `notes` rows for each imported file with correct title and content
- Serializing Tiptap JSON to standard Markdown for export
- Writing exported files to a user-selected local directory
- Preserving the Workspace folder hierarchy as subdirectory structure in exports
- Providing extension points for plugin-contributed import and export format handlers

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-MarkdownImport.md` | Planned | Single file and bulk directory import, title extraction, content conversion |
| `02-WorkspaceExport.md` | Planned | Full Workspace Markdown export, folder hierarchy preservation, file naming |
| `03-NoteExport.md` | Planned | Single note export to Markdown and plain text |
| `04-PluginFormats.md` | Planned | Extension point API for plugin-contributed import/export formats |
| `05-ImportConflictHandling.md` | Planned | Duplicate title handling, conflict options on bulk import |

---

## Key Business Rules (Summary)

- Import always creates new notes — it never overwrites existing notes without user confirmation.
- A note title is derived from YAML front matter `title:` field if present; otherwise from the filename (without extension).
- Export preserves all formatting elements that have a standard Markdown representation. Elements without a Markdown equivalent (e.g., custom editor nodes) are serialized as their closest Markdown approximation or omitted with a comment.
- Exported Markdown files use the note UUID as part of the filename to prevent collisions when two notes have the same title.
- Import does not automatically trigger embedding generation — the embedding pipeline handles newly created notes through the standard `NoteCreatedEvent`.
- Import progress is shown for bulk directory imports; the user is informed of any files that could not be parsed.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-IMP-01 | Import Markdown files as notes |
| FR-IMP-02 | Import plain text files as notes |
| FR-IMP-03 | Preserve note titles from file name or front matter |
| FR-IMP-04 | Bulk import a directory of files |
| FR-IMP-05 | Plugin system may add additional import formats |
| FR-EXP-01 | Export notes as Markdown |
| FR-EXP-02 | Export notes as plain text |
| FR-EXP-03 | Export entire Workspace as Markdown, preserving folder hierarchy |
| FR-EXP-04 | Exported Markdown preserves formatting |
| FR-EXP-05 | Plugin system may add additional export formats |

---

## Future Considerations

- **Notion import plugin:** Importing from a Notion export ZIP (which produces Markdown + HTML). This is a plugin concern per FR-IMP-05.
- **Obsidian vault import plugin:** Importing an Obsidian vault (Markdown with `[[wiki links]]`). Wiki link format compatibility is a key consideration.
- **PDF export plugin:** Exporting individual notes as styled PDFs. Platform-specific rendering (Chromium print-to-PDF via Electron) makes this a natural plugin candidate.
- **Roam Research, Logseq import plugins:** Community-requested import formats from competing tools.
- **Re-import and merge:** Importing a previously exported Notebook Markdown export back into Notebook, detecting already-existing notes by UUID embedded in the filename and merging changes.
