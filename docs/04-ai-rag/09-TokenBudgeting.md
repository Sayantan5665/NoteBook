# 09 — Token Budgeting

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Token Budgeting document defines how the application manages the finite context window of an LLM. It establishes rules for prioritizing different prompt components to prevent inference failures due to context overflow.

---

## 2. Budget Allocation

Token budgeting is provider-independent. Budget allocation is conceptual, as future AI providers may use different accounting strategies (e.g., character counts, bytes, or varying tokenization schemes). The total Context Window of a model must be strictly partitioned into theoretical buckets:

- **System Instructions:** High priority. A fixed allocation for the persona, constraints, and foundational rules.
- **Current User Prompt:** High priority. A dynamic but protected allocation for the immediate question.
- **Retrieved Context:** Medium priority. A large allocation dedicated to the factual Candidate Chunks required for RAG.
- **Conversation History:** Low priority. The remaining budget used to maintain dialogue continuity.
- **Response Buffer:** A reserved, untouched allocation to ensure the model has sufficient space to stream its reply.

---

## 3. History Trimming

Because conversations grow indefinitely and Context Windows are fixed, the system must enforce strict limits.
- When the total constructed prompt exceeds the budget, Conversation History is trimmed first (typically by dropping the oldest messages).
- If trimming history is insufficient, Retrieved Context must be truncated.
- System Instructions and the Current User Prompt are never trimmed.

---

## 4. Future Strategies

- **Dynamic Summarization:** Instead of outright dropping old conversation messages, the system may employ a secondary, cheaper model to summarize the history into a dense contextual block.
- **Dynamic Context Expansion:** Supporting future models with progressively larger context windows without hardcoded limits.

---

## 5. Business Rules

- **Token budgeting prevents inference failures.**
- **System Instructions are immutable during budgeting.**

---

## 6. Acceptance Criteria

- A user pasting a massive block of text into the chat interface triggers a graceful truncation of the Conversation History to accommodate the text, ensuring the request to the Model Provider does not fail with a `Context Length Exceeded` error.

---

## 7. Cross References

- [04-PromptConstruction.md](./04-PromptConstruction.md)
- [05-ConversationMemory.md](./05-ConversationMemory.md)
