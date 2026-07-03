# Search Module

> **Document Type:** Module README
> **Module:** search
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §8](../../00-overview/04-FunctionalRequirements.md) · [../../00-overview/04-FunctionalRequirements.md §9](../../00-overview/04-FunctionalRequirements.md) · [../../02-database/04-Schema.md §8](../../02-database/04-Schema.md) · [../../02-database/05-SQLite.md](../../02-database/05-SQLite.md) · [../../02-database/06-sqlite-vec.md](../../02-database/06-sqlite-vec.md) · [../../02-database/08-Indexes.md §6](../../02-database/08-Indexes.md) · [../ai/README.md](../ai/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Search module defines the behavior of the unified search experience in Notebook: how users query their knowledge base, what content is found, how results are ranked, and how the three search modes — keyword (FTS5), semantic (sqlite-vec), and hybrid — work together.

Search is a core capability of any knowledge management tool. In Notebook, search is offline-first and Workspace-scoped: all search operations run entirely on the local machine against the active Workspace's database, with no external service.

---

## Scope

**This module covers:**
- The search input interface (query bar, mode selector)
- Full-text keyword search (FTS5): query parsing, tokenization, result ranking, snippet generation
- Semantic vector search (sqlite-vec): embedding the query, nearest-neighbor retrieval, similarity scoring
- Hybrid search: result merging, deduplication by entity UUID, score normalization, final ranking
- Search result display: title, excerpt, source type (note/attachment), relevance indicator
- Search scope: always limited to the active Workspace
- Filtering search results by type (notes only, attachments only, all)
- Navigating to a result (opening the note or attachment)
- Search history (recent queries within a session)

**This module does NOT cover:**
- Embedding generation for indexed content (see `ai/`)
- FTS5 index maintenance (maintained by `notes/` and `attachments/` modules transactionally)
- Vector index maintenance (maintained by `ai/`)
- Tag-based filtering UI (see `tags/`)

---

## Responsibilities

This module is responsible for:

- Accepting query input and routing it to the appropriate search backend (FTS5, sqlite-vec, or both)
- Executing FTS5 queries against `fts_notes` and `fts_attachments` virtual tables
- Embedding the user's query text using the active embedding model
- Executing nearest-neighbor queries against `vec_embeddings`
- Merging, deduplicating, and ranking results from both backends in hybrid mode
- Resolving result entity references to displayable metadata (note title, attachment filename)
- Generating highlighted snippets for keyword search results
- Excluding soft-deleted content from all result sets

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-KeywordSearch.md` | Planned | FTS5 query flow, tokenization, boolean operators, phrase matching, snippets, ranking |
| `02-SemanticSearch.md` | Planned | Query embedding, nearest-neighbor retrieval, staleness behavior, result scoring |
| `03-HybridSearch.md` | Planned | Result merging strategy, score normalization, deduplication, final ranking |
| `04-SearchResultDisplay.md` | Planned | Result item format, excerpt display, navigation, type filtering |
| `05-SearchIndexedContent.md` | Planned | Complete inventory of what content is and is not indexed for each search mode |

---

## Key Business Rules (Summary)

- All search results are scoped to the active Workspace by construction — there is no Workspace filter that can be bypassed.
- Soft-deleted notes and attachments are excluded from all search results.
- The FTS5 keyword search operates entirely offline and requires no AI model.
- Semantic search requires the Ollama embedding model to be available to embed the query. If Ollama is unavailable, semantic search degrades gracefully to keyword-only results with a user-visible warning.
- Hybrid search deduplicates results by entity UUID — a note that appears in both FTS5 and vector results is returned once, with a combined score.
- FTS5 phrase matching is supported using quoted terms: `"exact phrase"`.
- FTS5 boolean operators (AND, OR, NOT) are supported per the SQLite FTS5 query syntax.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-FTS-01 | Full-text search interface accessible from anywhere |
| FR-FTS-02 | Index note titles, body content, OCR text |
| FR-FTS-03 | Results ranked by relevance |
| FR-FTS-04 | Phrase matching with quotes |
| FR-FTS-05 | Boolean operators (AND, OR, NOT) |
| FR-FTS-06 | Highlighted snippet in results |
| FR-FTS-07 | Search scoped to active Workspace |
| FR-FTS-08 | Full-text search operates offline |
| FR-SEM-01 | Generate vector embeddings for notes and attachment text |
| FR-SEM-04 | Semantic search with natural language queries |
| FR-SEM-05 | Results ranked by vector similarity |
| FR-SEM-07 | Semantic search Workspace-scoped |
| FR-SEM-08 | Semantic search operates offline |

---

## Future Considerations

- **Search filters panel:** A sidebar panel for filtering results by date range, tags, folders, and content type simultaneously.
- **Search operators for metadata:** Searching by `tag:work`, `folder:Projects`, `type:attachment`, `before:2024-01-01` directly from the search input.
- **Saved searches:** Persisting a search query as a "smart folder" that dynamically shows matching notes.
- **Search result caching:** Caching recent search results for instant re-display while the full search executes in the background.
