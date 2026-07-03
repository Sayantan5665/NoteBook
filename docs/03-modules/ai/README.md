# AI Module

> **Document Type:** Module README
> **Module:** ai
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../00-overview/04-FunctionalRequirements.md §10](../../00-overview/04-FunctionalRequirements.md) · [../../00-overview/04-FunctionalRequirements.md §9](../../00-overview/04-FunctionalRequirements.md) · [../../01-architecture/13-AIArchitecture.md](../../01-architecture/13-AIArchitecture.md) · [../../02-database/06-sqlite-vec.md](../../02-database/06-sqlite-vec.md) · [../../02-database/04-Schema.md §3.9](../../02-database/04-Schema.md) · [../search/README.md](../search/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The AI module defines the behavior of Notebook's local AI capabilities: the AI chat interface, the RAG (Retrieval-Augmented Generation) pipeline, embedding generation, and the context assembly process.

Notebook's AI is local-first and offline-capable. The default provider is Ollama, running entirely on the user's machine. No user data — no note content, no queries, no chat history — is sent to any remote service unless the user explicitly configures a remote provider via the plugin system.

The AI module transforms the user's note collection into a queryable knowledge base: ask a question, retrieve the most relevant notes, generate a grounded answer, and cite the sources.

---

## Scope

**This module covers:**
- AI chat: creating sessions, sending messages, receiving streamed responses
- RAG pipeline: query embedding → vector retrieval → context assembly → LLM inference → response with citations
- Embedding generation: triggering, queuing, storing, and invalidating embeddings for notes and attachments
- Embedding granularity: chunk-level embedding strategy
- Model selection: choosing and changing the Ollama chat model and embedding model
- Context building: selecting and preparing retrieved content for the LLM prompt
- Citation: identifying and linking the source notes used in a response
- Chat history: persisting conversations within the Workspace
- Re-indexing: triggering and tracking full Workspace re-embedding

**This module does NOT cover:**
- Semantic search UX (see `search/`)
- Attachment OCR (see `attachments/`)
- Plugin-contributed AI providers (see `plugins/`)
- Settings UI for model selection (see `settings/`)

---

## Responsibilities

This module is responsible for:

- Managing `ai_chats` and `chat_messages` table rows
- Routing user messages through the RAG pipeline
- Calling the `IEmbeddingProvider` to embed user queries and note/attachment content
- Maintaining the `embeddings` and `vec_embeddings` records
- Managing the embedding background job queue (`background_jobs` table, type `embedding`)
- Marking embeddings stale on note/attachment update and triggering re-embedding
- Building the LLM prompt from retrieved context chunks (within the model's token budget)
- Streaming LLM responses to the UI via IPC events
- Populating `chat_messages.citations` with source references from the retrieved context
- Handling Ollama unavailability gracefully (queueing embedding jobs, degrading chat to offline state)

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-AIChatLifecycle.md` | Planned | Chat session creation, message flow, streaming, history, delete |
| `02-RAGPipeline.md` | Planned | Full RAG flow: query → embed → retrieve → context build → infer → cite |
| `03-EmbeddingPipeline.md` | Planned | Embedding trigger events, queue management, staleness, retry |
| `04-ContextBuilder.md` | Planned | Context assembly: chunk selection, token budget management, backlink weighting |
| `05-ModelConfiguration.md` | Planned | Ollama model selection, embedding model selection, model change re-indexing |
| `06-Citations.md` | Planned | Citation format, source note linking, citation display in chat |
| `07-ReIndexing.md` | Planned | Full Workspace re-index: trigger conditions, progress tracking, resumable |

---

## Key Business Rules (Summary)

- All AI inference uses the local Ollama instance by default. No query or content is sent to a remote server unless the user has installed and configured a remote AI plugin.
- The AI shall only answer from retrieved Workspace content. It shall not use its pre-trained knowledge to fill gaps — unsupported answers are prefaced with an explicit "I don't have information about this in your notes."
- Every AI response that uses retrieved content shall cite the source notes by title and UUID.
- Embedding generation is asynchronous and non-blocking — the user may continue working while embeddings are being generated.
- When the user changes the embedding model, all existing embeddings are invalidated before the new model is used for any retrieval operation.
- Chat history is Workspace-scoped and persisted in `database.db`. It is not global.
- Streaming AI responses are delivered via IPC events, not polling.

---

## Requirements Traced

| Requirement | Description |
|---|---|
| FR-AI-01 | AI chat interface within each Workspace |
| FR-AI-02 | Retrieve semantically relevant content on query |
| FR-AI-03 | Retrieved content used as RAG context |
| FR-AI-04 | AI does not use knowledge outside indexed Workspace content |
| FR-AI-05 | AI cites source notes/attachments used in response |
| FR-AI-06 | Default provider: Ollama |
| FR-AI-07 | User selects Ollama model in Workspace settings |
| FR-AI-08 | Responses streamed incrementally |
| FR-AI-09 | Chat history persisted and available across sessions |
| FR-AI-10 | Users can clear chat history |
| FR-AI-11 | All inference local; no remote calls without explicit user configuration |
| FR-SEM-01 through FR-SEM-08 | Embedding generation and semantic search |

---

## Future Considerations

- **Remote AI provider plugin:** A plugin extension point that allows users to substitute Ollama with an OpenAI-compatible API (e.g., OpenAI, Anthropic, Mistral). The plugin declares the provider; the AI module calls through the `IAiProvider` interface.
- **AI-assisted writing:** Inline AI suggestions within the editor for grammar, summarization, tone adjustment, and content generation.
- **AI-generated note summaries:** Automatically generating a one-paragraph summary of a note on demand, stored as a metadata field.
- **Multi-turn context window management:** Sophisticated context window pruning that retains important earlier turns while fitting within the token budget.
- **Agent mode:** Allowing the AI to take actions (create notes, update todos, search) in response to natural language instructions.
