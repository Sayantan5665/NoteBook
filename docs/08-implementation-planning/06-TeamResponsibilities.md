# 06 — Team Responsibilities

> **Module:** Implementation Planning & Roadmap
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

The Team Responsibilities document conceptually maps domains of work to distinct functional roles, ensuring clear ownership during implementation.

---

## 2. Conceptual Roles

### 2.1 Architecture
- Owns the `docs/` folder. Resolves architectural disputes, writes ADRs, and ensures the implementation aligns with the offline-first philosophy.

### 2.2 Backend (Core Logic)
- Owns the SQLite database, domain services, event bus, and internal business logic (e.g., Note saving, indexing).

### 2.3 Frontend (UI/UX)
- Owns the UI components, markdown rendering, editor performance, and accessibility. Communicates with the backend exclusively through defined APIs.

### 2.4 Desktop (Packaging)
- Owns the OS-level integration (e.g., Electron/Tauri wrappers), filesystem access, installers, and auto-update mechanisms.

### 2.5 AI (Machine Learning)
- Owns the vectorization logic, RAG prompt orchestration, and LLM provider abstractions.

### 2.6 QA (Quality Assurance)
- Owns the testing strategy, synthetic data generation, and acts as the final Quality Gate before a Release Candidate is approved.

### 2.7 Documentation
- Owns user manuals, API documentation for the Plugin SDK, and release notes.

### 2.8 Release (Governance)
- Owns the deployment validation, version tagging, and publishing of binaries.

---

## 3. Business Rules

- **Clear Boundaries:** If a UI component requires complex data transformation, the Frontend team must request the Backend team to expose it via the API; they must not bypass the API to query SQLite directly.

---

## 4. Acceptance Criteria

- Every code change in a Pull Request clearly maps to an owning team, preventing "orphaned" code.

---

## 5. Cross References

- [01-ImplementationStrategy.md](./01-ImplementationStrategy.md)
