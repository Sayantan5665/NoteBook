# Backlinks Module

> **Document Type:** Module README
> **Module:** backlinks
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §5 FR-NT-04](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §3.8](../../02-database/04-Schema.md) · [../../01-architecture/13-AIArchitecture.md](../../01-architecture/13-AIArchitecture.md) · [../wikilinks/README.md](../wikilinks/README.md) · [../notes/README.md](../notes/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Backlinks module defines how the application surfaces and maintains the reverse direction of wiki links — the list of notes that link *to* a given note.

When Note A contains `[[Note B]]`, Backlinks ensures that Note B automatically displays "Note A links here" without any action from the user. This automatic, bidirectional linking transforms a flat list of notes into a navigable knowledge graph.

Backlinks are also surfaced to the AI context builder as additional relevance signals: notes that many other notes link to are likely important and are weighted accordingly in RAG context assembly.

---

## Scope

**This module covers:**
- Computing the backlink list for a given note (all notes containing a resolved `[[This Note]]` link)
- Displaying backlinks in the note sidebar or panel
- Updating the displayed backlink list in real time when other notes are saved
- Providing backlink data to the AI context builder as relevance signals
- Displaying link context (the sentence or paragraph containing the link) alongside each backlink

**This module does NOT cover:**
- Creating or maintaining `wiki_links` records (see `wikilinks/`)
- The `[[...]]` editor syntax (see `wikilinks/`)
- AI context assembly (see `ai/`)

---

## Responsibilities

This module is responsible for:

- Querying `wiki_links` where `target_note_id = <current note>` and `resolved = 1`
- Joining backlink records with their source notes to provide title and context excerpt
- Refreshing the backlink list when a note save event is received
- Exposing backlink data to the AI module for context scoring
- Presenting unresolved incoming links (notes that previously linked here but the link is now broken) as a diagnostic information

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-BacklinkDisplay.md` | Planned | Panel layout, context excerpt, navigation, live refresh |
| `02-BacklinkAndAI.md` | Planned | How backlinks are weighted and provided to the AI context builder |

---

## Key Business Rules (Summary)

- Backlinks are always derived from `wiki_links` records — they are never stored as a separate data structure.
- Backlinks are scoped to the active Workspace; notes in other Workspaces are never surfaced as backlinks.
- A note with no incoming links has an empty backlink list. This is a valid state, not an error.
- Soft-deleted source notes are excluded from the backlink list.
- The backlink panel refreshes after any note save without requiring a manual refresh by the user.
- Backlinks provide a relevance signal to the AI but do not override semantic similarity scores.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-NT-04 | Automatically maintain bidirectional backlinks |
| FR-NT-05 | Backlinks updated when a note is renamed, moved, or deleted |
| FR-NT-11 | Backlinks surfaced to AI retrieval as context signals |

---

## Future Considerations

- **Backlink graph visualization:** A visual graph of note connections, where nodes are notes and edges are wiki links. Useful for understanding the knowledge structure at a glance.
- **Unlinked mentions:** Surface notes that mention the current note's title as plain text (not as a `[[link]]`), suggesting potential wiki links the user has not yet made explicit.
- **Backlink strength scoring:** Weight backlinks by the number of times a note is linked and by the source notes' own relevance, producing a PageRank-like relevance signal.
