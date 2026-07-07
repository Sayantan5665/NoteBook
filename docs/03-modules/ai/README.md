> **Document Type:** Module Specification
> **Status:** Frozen
> **Version:** 1.0
> **Depends On:** Embeddings & Retrieval, Search, Notes, Attachments, OCR, Tags, Wiki Links
> **Document Owner:** Core Architecture Team

# AI Assistant / RAG Module

---

## 1. Purpose

The AI Assistant module is the user-facing intelligence layer of the Notebook ecosystem. It orchestrates Retrieval-Augmented Generation (RAG) workflows — consuming grounded semantic context from the Embeddings & Retrieval module and Search — to produce AI Responses that are relevant to the user's actual Notebook content, without inventing or modifying it.

## 2. Scope

**This document covers:**
- AI Conversation and Chat Session concepts and lifecycle.
- The module's ownership and boundary definitions.
- Event models for AI request and response flows.
- Extension points for future AI providers and capabilities.

**This document does NOT cover:**
- Specific LLM implementations or model names.
- Prompt template design or engineering.
- Ollama, OpenAI, or any specific provider implementation.
- Embedding algorithms or vector similarity functions.
- Database schema or source code.
- API endpoint definitions.

## 3. Responsibilities

- **Conversation Management:** Owning the lifecycle of AI Conversations, including creation, continuation, archival, and deletion.
- **Session Orchestration:** Managing Chat Sessions that organize AI interactions within a Conversation.
- **RAG Orchestration:** Coordinating Retrieval Requests to the Embeddings & Retrieval module and composing the resulting Context Package into an AI Request.
- **Response Lifecycle:** Owning the AI Response from generation through archival, clearly marking it as a derived artifact.
- **User Transparency:** Ensuring users understand that AI Responses are generated from their Notebook content and may be imperfect.

## 4. Ownership and Boundaries

- **Ownership:** This module owns Conversations, Chat Sessions, Messages, AI Requests, AI Responses, and the Conversation Lifecycle.
- **Boundaries:**
  - The AI Assistant NEVER owns Notes, Attachments, OCR Results, Search Indexes, Embeddings, or Retrieval pipelines.
  - AI Responses are derived artifacts. They NEVER become canonical Notebook data.
  - The AI Assistant NEVER modifies Notes, Attachments, or any canonical Notebook content automatically.
  - The AI Assistant consumes semantic context; it does not create it.

### 4.1 Canonical Intelligence Pipeline
A conceptual workflow illustrating the complete intelligence pipeline within the Notebook:

`Notebook Content` &rarr; `OCR` &rarr; `Search` &rarr; `Embeddings` &rarr; `Retrieval` &rarr; `Context Package` &rarr; `Prompt Assembly` &rarr; `AI Request` &rarr; `AI Response` &rarr; `User Decision` &rarr; `Optional Notebook Update`

- Every stage has a single owner.
- Ownership transfers only through well-defined interfaces.
- The AI Assistant consumes context prepared by Retrieval.
- The AI Assistant never directly modifies Notebook content.
- Users always remain in control of Notebook changes. Any Optional Notebook Update requires an explicit, deliberate user action.

## 5. AI Capabilities

The AI Assistant exposes capabilities to the user and to other modules. These capabilities are owned by the AI Assistant module. They consume, but do not own, the underlying modules they depend on.
- **Conversational Q&A:** Answering questions grounded in the user's Notebook content.
- **Summarization:** Producing derived summaries of Notes or collections of content.
- **Semantic Discovery Assistance:** Helping users explore related concepts across their Notebook.
- **Future: Autonomous Agents:** AI-driven background tasks (e.g., "Find all meeting notes from Q1 and summarize action items") — always subject to explicit user authorization.
- **Future: AI Writing Assistance:** Suggesting completions or refinements within the Editor context, subject to explicit user acceptance before any Note is modified.

## 6. Dependencies

- **Embeddings & Retrieval Module:** Supplies the grounded Context Package for each AI Request.
- **Search Module:** Supplies keyword-matched candidates that may augment retrieval context.
- **Notes Module:** Canonical source of the text content surfaced via retrieval.
- **Attachments Module:** Canonical source of file metadata surfaced via retrieval.
- **OCR Module:** Supplies derived text from images and documents surfaced via retrieval.
- **Tags Module:** Tag names may be present within retrieved context fragments.
- **Wiki Links Module:** Link structures may inform retrieval scope.

## 7. Interfaces and Events

### 7.1 Consumed Interfaces
- Accepts user-submitted messages to initiate or continue a Conversation.
- Accepts Retrieval Results and Context Packages from the Embeddings & Retrieval module.

### 7.2 Published Events
- `ConversationCreated` — Emitted when a new Conversation is initiated by the user.
- `ConversationUpdated` — Emitted when Conversation metadata (e.g., title) is modified.
- `ConversationArchived` — Emitted when a Conversation is moved to the archive state.
- `ConversationDeleted` — Emitted when a Conversation is permanently removed.
- `ChatSessionStarted` — Emitted when an active Chat Session begins.
- `ChatSessionEnded` — Emitted when a Chat Session concludes.
- `MessageSubmitted` — Emitted when the user submits a Message, activating the RAG Pipeline.
- `AIRequestStarted` — Emitted when the AI Request is dispatched to the provider.
- `AIResponseGenerated` — Emitted when the AI Response is successfully received and stored.
- `AIResponseCancelled` — Emitted when the user cancels an in-progress generation.
- `AIResponseFailed` — Emitted when the AI provider returns an error or times out.

### 7.3 Consumed Events
- `RetrievalCompleted` *(from Embeddings & Retrieval)*
- `ContextAssembled` *(from Embeddings & Retrieval)*
- `SearchResultsGenerated` *(from Search, optionally)*
- `NotePermanentDeleted` *(to detect invalidated context sources)*

## 8. Extension Points

- **Multiple AI Providers:** Alternative local or cloud AI providers may be registered without altering the RAG Pipeline or Conversation ownership rules.
- **Local AI Models:** On-device model execution preserves privacy and enables fully offline AI interactions.
- **Cloud AI Models:** External provider APIs may supplement or replace local models, subject to user configuration.
- **Streaming Delivery:** Progressive, token-by-token response delivery improves perceived responsiveness. Streaming is a delivery mechanism — it does not change ownership or retrieval.
- **AI Plugins:** Third-party plugins may register AI Tool capabilities that participate in the standard Tool invocation lifecycle.
- **Custom Prompt Strategies:** Users or plugins may define preferred context selection or composition strategies without altering the core pipeline.
- **Multi-modal AI:** Future extensions may support image, audio, or video context alongside text retrieval.
- **AI Agents:** Multi-step autonomous task orchestration, always subject to explicit user authorization per action.
- **Future Collaboration:** Shared Conversations within a multi-user Workspace, subject to access control rules defined by the Workspace module.

All extensions are additive. Existing Conversation, Session, and Response ownership rules remain unchanged.

## 9. Settings

- Preferred AI Provider (local vs cloud).
- Automatic context retrieval on message submission vs manual context pinning.
- Conversation retention policy preferences.
- AI Response language and style preferences.

## 10. Business Rules

- **Consumer Only:** The AI Assistant consumes Retrieval and Search outputs. It NEVER owns them.
- **Non-Destructive:** The AI Assistant NEVER modifies Notes, Attachments, OCR Results, Tags, or Wiki Links automatically.
- **Derived Responses:** AI Responses are derived artifacts. They NEVER become canonical Notebook data.
- **Conversation Independence:** Conversations are independent from Notes. Deleting a Conversation NEVER deletes Notebook content.
- **Grounded Generation:** The AI Assistant assembles AI Requests using retrieved Notebook context. It does not generate responses from memory alone when user content is available.
- **Safe Failures:** A failure in the AI module (e.g., provider unavailable) MUST NOT prevent the user from editing Notes or accessing Attachments.

## 11. Acceptance Criteria

- The user asks "What did I write about the Q3 budget?" and the AI Assistant surfaces an AI Response grounded in retrieved Note fragments, without modifying the source Notes.
- Deleting an AI Conversation removes all associated Messages and AI Responses without deleting any canonical Note, Attachment, or Tag.
- A failed AI Response (e.g., provider timeout) is clearly reported to the user. The user can continue editing their Notes without interruption.

## 12. Cross References

- [01-AIAssistantOverview.md](./01-AIAssistantOverview.md)
- [02-ConversationLifecycle.md](./02-ConversationLifecycle.md)
- [03-ChatSessions.md](./03-ChatSessions.md)
- [04-RAGPipeline.md](./04-RAGPipeline.md)
- [05-PromptAssembly.md](./05-PromptAssembly.md)
- [06-ResponseGeneration.md](./06-ResponseGeneration.md)
- [07-AITools.md](./07-AITools.md)
- [08-WritingAssistance.md](./08-WritingAssistance.md)
- [09-DocumentAnalysis.md](./09-DocumentAnalysis.md)
- [10-AIEvents.md](./10-AIEvents.md)
- [11-ExtensionPoints.md](./11-ExtensionPoints.md)
- [12-AIGovernance.md](./12-AIGovernance.md)
