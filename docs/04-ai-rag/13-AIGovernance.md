# 13 — AI Governance

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The AI Governance document establishes the strict boundaries that protect Notebook's canonical data from being corrupted or compromised by the AI subsystem.

---

## 2. Ownership Boundaries

### 2.1 AI Owns:
- **Conversation orchestration:** Managing the lifecycle of a chat session.
- **Prompt construction:** Assembling the final string sent to the model.
- **Inference coordination:** Managing the network/local calls to the Model Provider.
- **Citation coordination:** Resolving model outputs back to candidate chunks.

### 2.2 AI Does NOT Own:
- **Notes:** The AI cannot autonomously create, edit, or delete notes.
- **Workspace:** The AI does not manage folders or files.
- **Search:** The AI queries search, it does not index or execute algorithms.
- **Embeddings:** The AI consumes vectors, it does not manage the vector DB.
- **Synchronization, Backup, Import, Export, Plugins.**

---

## 3. Privacy and Security

- **Offline-first philosophy:** The architecture natively supports local models, guaranteeing zero data leakage.
- **Security:** When remote models are used, the system must clearly indicate to the user that Context Packages (containing chunks of their private Notes) are being transmitted over the network.
- **Validation:** All responses from the model are treated as untrusted and must be sanitized before rendering in the UI to prevent injection attacks (e.g., malicious markdown or scripts hallucinated by the model).

---

## 4. Business Rules

- **Notebook entities remain the canonical source of truth at all times.**
- **AI responses never silently overwrite canonical data.** If an AI action modifies a Note, it must be via an explicit user confirmation interacting with the Domain service, not the AI directly bypassing the Domain.

---

## 5. Acceptance Criteria

- Architectural reviews confirm that the AI module has no direct dependencies on the SQLite database layer. It only interacts with the Workspace via abstract public interfaces.
- Switching to a remote provider explicitly surfaces a privacy warning in the Settings module.

---

## 6. Cross References

- [01-AIArchitecture.md](./01-AIArchitecture.md)
- [02-RAGPipeline.md](./02-RAGPipeline.md)
