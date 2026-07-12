# 05 — Conversation Memory

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Conversation Memory document outlines how the application tracks the ongoing dialogue between the user and the AI Assistant, enabling multi-turn interactions.

---

## 2. Conceptual Structure

- **Conversation:** A logical container representing a single, contiguous chat session. A Conversation manages the overall lifecycle of user and assistant interactions.
- **Message:** A single utterance within a Conversation (either from the `user`, `assistant`, or `system`).
- **Conversation Window:** The specific subset of recent Messages dynamically selected to be included in the Prompt Construction phase, governed by token budgets.
- **Conversation Context:** The holistic semantic meaning derived from the Conversation Window that grounds the AI's response.
- **Context Window:** The theoretical maximum length (in tokens) that an AI model can process in a single request.

---

## 3. Memory Strategy

- **History Trimming:** As conversations grow long, older messages must be systematically pruned (or summarized) from the Conversation Window to ensure the prompt remains within the Token Budget and leaves room for Retrieved Context.
- **Relevance over Recency:** Future enhancements may introduce vector-based retrieval of past conversation turns rather than strictly chronological trimming.

---

## 4. Ownership and Boundaries

- **Conversation history supports AI continuity.** It provides context for the LLM across multi-turn interactions.
- **Conversation never replaces Notebook knowledge.** A chat log is an ephemeral or secondary interaction trace. It is not a canonical Note. If a user wishes to preserve insights from a chat, they must explicitly extract or save it into the Workspace.
- **Notebook entities remain the canonical source of truth.**

---

## 5. Business Rules

- **AI does not own Notes.** The memory is strictly limited to the Chat interface.
- **Trimming is mandatory.** Conversations must not break the inference pipeline via context overflow.

---

## 6. Acceptance Criteria

- The application successfully drops the oldest messages in a long conversation loop to prioritize the newest user prompt and the required RAG context.
- Deleting a Conversation history does not result in the deletion of any canonical Notes or Attachments.

---

## 7. Cross References

- [09-TokenBudgeting.md](./09-TokenBudgeting.md)
