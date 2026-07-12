# 02 — RAG Pipeline

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The RAG Pipeline document describes the conceptual phases of Retrieval-Augmented Generation within the Notebook. It outlines how knowledge is ingested, retrieved, and utilized to ground AI responses in factual, user-owned data.

---

## 2. Pipeline Phases

### 2.1 Document Ingestion
When Notes or Attachments are created or modified, their text is conceptually broken down and indexed by the Search and Embeddings modules. The RAG pipeline relies on this pre-existing infrastructure to prepare knowledge.

### 2.2 Chunk Retrieval
Upon receiving a user query, the pipeline queries the Search module to retrieve relevant fragments of information, known as chunks. This retrieval may conceptually span lexical (keyword) and semantic (vector) boundaries.

### 2.3 Ranking
The retrieved chunks are evaluated and ordered based on their relevance to the current user prompt and conversational context. 

### 2.4 Context Assembly
The top-ranked chunks are aggregated into a standardized format designed for the AI model to easily digest. 

### 2.5 Prompt Construction
The assembled context is merged with system instructions and the user's active conversation to form the final, immutable payload sent to the model.

### 2.6 Generation
The AI model processes the constructed prompt and generates a natural language response, typically streamed token-by-token back to the application.

### 2.7 Citation Attachment
The generated response is post-processed (or generation is constrained) to ensure that factual claims are explicitly linked back to the specific chunks provided during Context Assembly.

### 2.8 Response Delivery
The final, cited output is rendered for the user.

---

## 3. Business Rules

- **The RAG pipeline coordinates existing modules.** It does not duplicate the responsibilities of the Search or Embeddings modules.
- **No algorithmic lock-in.** The conceptual pipeline must accommodate future changes to chunking strategies or ranking algorithms without structural redesign.

---

## 4. Acceptance Criteria

- The RAG pipeline remains entirely functional regardless of whether a local or remote model is utilized for the Generation phase.
- The pipeline clearly segregates the retrieval of information from the generation of responses.

---

## 5. Cross References

- [03-ContextAssembly.md](./03-ContextAssembly.md)
- [10-CitationStrategy.md](./10-CitationStrategy.md)
