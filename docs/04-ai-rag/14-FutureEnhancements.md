# 14 — Future Enhancements

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Future Enhancements document conceptualizes how the AI & RAG architecture can evolve to support highly advanced workflows without breaking the established boundaries.

---

## 2. Future Concepts

### 2.1 Agent Workflows & Tool Calling
Future iterations may introduce **Planner models** and **Multi-agent systems**. 
Models with **Tool calling** capabilities could be granted access (via explicit user permission) to specific Notebook Domain services, allowing the AI to say, "I have created a new Note with that summary for you."

### 2.2 Multi-Model Orchestration
Dynamically routing tasks to different models. For instance, using a small, fast local model for history summarization, and a large **Reasoning model** for complex analytical queries.

### 2.3 Knowledge Graphs
Moving beyond simple vector similarity to construct semantic graphs of Notebook entities, allowing the RAG pipeline to traverse relationships (e.g., finding Notes linked to the current Note) during Context Assembly.

### 2.4 Local Fine-Tuning
Exploring on-device fine-tuning (e.g., LoRA) to adapt the local model to the user's specific writing style and vocabulary.

### 2.5 Memory Improvements
Implementing infinite **Adaptive retrieval** memory, where past conversation turns are embedded and retrieved just like Notes, allowing the AI to recall something discussed months ago.

### 2.6 Future RAG Evolution
Integrating hypothetical document embeddings (HyDE), self-querying retrievers, or cross-encoder rerankers to drastically improve precision and recall.

---

## 3. Architectural Constraints

Regardless of how advanced these future AI capabilities become (including agents, planners, reasoning models, multi-model orchestration, and adaptive retrieval), they must continue to rigidly respect:
- canonical Notebook ownership
- module boundaries
- provider abstraction
- offline-first philosophy
- privacy-first philosophy

*(Implementation details for these enhancements are strictly deferred to future architectural phases.)*

---

## 4. Cross References

- [08-RetrievalStrategy.md](./08-RetrievalStrategy.md)
- [01-AIArchitecture.md](./01-AIArchitecture.md)
