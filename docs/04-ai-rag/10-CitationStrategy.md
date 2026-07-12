# 10 — Citation Strategy

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Citation Strategy ensures that users can verify the claims made by the AI Assistant. It defines how generated responses are transparently linked back to the canonical Notebook entities that informed them.

---

## 2. Conceptual Strategy

- **Source Attribution:** When the AI generates a response based on Retrieved Context, it must indicate which Candidate Chunk provided the factual basis.
- **Citation Generation:** This may be achieved by prompting the model to output specific footnote markers (e.g., `[1]`), or through post-processing heuristics that map output text back to the input Context Package.
- **Chunk References:** A citation in the UI must ultimately resolve to a specific Note or Attachment, allowing the user to click and navigate directly to the source.
- **Transparency:** The system must clearly display to the user exactly which chunks were provided to the model, regardless of whether the model chose to cite them.
- **Citation Philosophy:** Citations are derived artifacts. They provide transparency by tracing AI logic back to source knowledge. They never become Notebook entities, and they may be regenerated whenever responses are regenerated.

---

## 3. Limitations

- **Hallucination Risk:** LLMs may generate citations that do not exist or misattribute facts. The UI must treat citations as probabilistic suggestions, not guaranteed truths.
- **Fuzzy Matching:** Because models paraphrase, strict string matching for post-processing citations is often insufficient.

---

## 4. Business Rules

- **Citations must link to canonical Notebook entities.**
- **The system must never silently alter a canonical Note to match a hallucinated citation.** Notebook entities remain the canonical source of truth at all times.

---

## 5. Acceptance Criteria

- The AI response UI contains clickable footnote links.
- Clicking a footnote opens the specific Note and highlights the approximate Candidate Chunk that was supplied during Context Assembly.

---

## 6. Cross References

- [03-ContextAssembly.md](./03-ContextAssembly.md)
- [02-RAGPipeline.md](./02-RAGPipeline.md)
