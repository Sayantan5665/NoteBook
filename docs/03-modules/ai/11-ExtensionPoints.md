> **Document Type:** Module Specification
> **Status:** Frozen
> **Version:** 1.0
> **Depends On:** AI Assistant Module
> **Document Owner:** Core Architecture Team

# 11 — Extension Points

---

## 1. Purpose

This document defines the extensibility surfaces of the AI Assistant module. It establishes the conceptual integration points where future capabilities, alternative providers, and advanced AI paradigms can be introduced without violating existing architectural contracts or ownership boundaries.

## 2. Provider Extensions

### 2.1 Multiple AI Providers
The architecture conceptually supports multiple, interchangeable AI Providers. The module abstracts over provider specifics, ensuring the rest of the system (RAG Pipeline, Conversation lifecycle, Prompt Assembly) remains provider-agnostic.

### 2.2 Local AI Models
- A local provider operates entirely on-device, requiring no network connectivity.
- This extension preserves user privacy by ensuring no user content is transmitted externally during generation.
- Local model execution enables fully offline AI interactions consistent with the Notebook's offline-first philosophy.

### 2.3 Cloud AI Models
- A cloud provider dispatches the assembled AI Request to an external API and returns the generated response.
- This extension supports users who prefer higher-quality generation over strict local processing.
- Cloud providers are subject to explicit user opt-in, consistent with the Privacy First principle.

## 3. Capability Extensions

### 3.1 Streaming Delivery
- Progressive, token-by-token response delivery improves perceived responsiveness.
- Streaming is a delivery mechanism — it does not alter Conversation ownership, retrieval logic, or response derivation status.
- A streamed response is architecturally identical to a fully-buffered response: it is a derived artifact owned by the AI Assistant module.

### 3.2 AI Plugins
- Third-party plugins may register AI Tool capabilities that participate in the standard Tool invocation lifecycle defined in `07-AITools.md`.
- Plugin-registered tools follow the same ownership rules as native tools: they consume retrieval context and NEVER modify Notebook content automatically.

### 3.3 Custom Prompt Strategies
- Users or plugins may define preferred context selection or composition strategies (e.g., prioritising Tags, preferring recent Notes, increasing history depth).
- Custom strategies are applied within the Prompt Assembly stage only. They do not alter the Retrieval Pipeline or Response ownership rules.

### 3.4 Multi-modal AI
- Future extensions may support image, audio, or video content as inputs alongside text retrieval.
- Multi-modal providers extend the type of context that can be assembled — they do not change who owns the source Attachments.

### 3.5 AI Agents
- AI Agents are autonomous, multi-step task orchestration capabilities (e.g., "Find all meeting notes from Q1 and summarise action items").
- Every Agent action that would modify Notebook content requires an explicit, deliberate user authorization.
- Agents consume retrieval outputs and produce derived results. They do not bypass the User Decision gate.

### 3.6 Future Collaboration
- Shared Conversations within a multi-user Workspace allow multiple users to view and contribute to a shared AI dialogue.
- Access control rules are defined by the Workspace module, not the AI Assistant module.

## 4. Business Rules

- **Additive Extensions:** All extension points augment existing AI Assistant capabilities. They NEVER replace the foundational RAG pipeline, Conversation lifecycle, or Response ownership rules.
- **Backward Compatibility:** Every extension must be introduced as an additive capability. Existing consumers (Chat UI, Command Palette) must not require changes to continue functioning after a new extension is added.
- **Ownership Unchanged:** Regardless of the provider (local, cloud) or capability (agent, plugin), ownership boundaries remain stable. Extended capabilities consume Notebook data on a read-only basis. They NEVER assert ownership over Notes, Attachments, or Retrieval infrastructure.
- **User Control Preserved:** Every extension that could result in Notebook modification must preserve the User Decision gate. Automatic Notebook modification is never permitted, regardless of the extension.

## 5. Acceptance Criteria

- Switching from a local AI provider to a cloud AI provider does not alter the Conversation lifecycle, Prompt Assembly logic, or the derivation status of AI Responses.
- A Plugin AI Tool can inject additional capabilities into the Tool invocation flow without requiring modifications to the RAG Pipeline or the Conversation ownership model.
- An AI Agent completes a multi-step task and presents its results as a derived output. No Notebook entity is modified without explicit user authorization, confirming the User Decision gate is preserved.
