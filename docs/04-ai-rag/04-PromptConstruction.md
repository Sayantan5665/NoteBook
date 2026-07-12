# 04 — Prompt Construction

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Prompt Construction document defines how diverse inputs are combined into a final, structured payload designed to elicit the highest quality response from an abstracted AI model.

---

## 2. Components of a Prompt

A complete prompt is constructed from the following modular elements:

1. **System Instructions:** The foundational rules and persona guidelines that dictate how the AI should behave (e.g., "You are a helpful assistant. Use only the provided context.").
2. **Conversation History:** A tailored, budget-constrained window of previous user and assistant messages to maintain conversational continuity.
3. **Retrieved Context:** The Context Package (from Context Assembly) containing the relevant facts from the Notebook.
4. **Current User Prompt:** The immediate question or command issued by the user.

---

## 3. Assembly and Validation

- **Prompt Template:** The abstract blueprint or structural definition (e.g., system instructions and role bindings) used to guide prompt assembly.
- **Prompt Construction:** The active process of weaving the components together into a provider-agnostic format using a Prompt Template.
- **Final Prompt:** The finalized, structured object that is dispatched to the model.

**Identity Clarification:** The Final Prompt is a temporary orchestration artifact. It never becomes Notebook knowledge. Before dispatching to the model, the assembled Final Prompt is validated against the active Token Budget to ensure it does not exceed the model's context window.

---

## 4. Business Rules

- **Prompt construction remains modular.** Different tasks (e.g., standard chat vs. summarization) may use different assembly strategies without redesigning the architecture.
- **No hardcoded model specifics.** The construction phase builds an abstract prompt structure. The specific Model Provider adapter is responsible for translating this into the provider's exact API format.

---

## 5. Acceptance Criteria

- The prompt construction logic successfully builds a complete prompt structure regardless of whether Retrieved Context is present or empty.
- The prompt assembly strictly enforces the Token Budget and trims Conversation History before it drops Retrieved Context.

---

## 6. Cross References

- [03-ContextAssembly.md](./03-ContextAssembly.md)
- [09-TokenBudgeting.md](./09-TokenBudgeting.md)
