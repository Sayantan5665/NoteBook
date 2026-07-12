# 11 — Documentation Standards

> **Module:** Development Standards
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Documentation Standards ensure that all architectural and technical documentation remains highly readable, consistent, and up-to-date, serving as the definitive guide for contributors.

---

## 2. Expectations

- **Documentation Lifecycle:** Documentation evolves together with the project and is considered part of the final deliverable. It should remain synchronized with architecture and implementation at all times.
- **Documentation is Code:** Documentation updates are required as part of the pull request process for any architectural or significant functional changes.
- **Canonical Source:** The `docs/` folder is the single source of truth for the system's design.

---

## 3. Document Structure

All module specifications must include (where appropriate):
- Purpose
- Scope
- Responsibilities
- Business Rules
- Acceptance Criteria
- Cross References

### 3.1 Formatting
- **Markdown:** Use standard GitHub Flavored Markdown.
- **Mermaid:** Use Mermaid.js for all architectural, sequence, and state diagrams. Do not use static image files for diagrams to ensure they remain easily editable.

---

## 4. Versioning and ADRs

- **Versioning:** Documentation follows the Phase and Versioning lifecycle. Significant freezes are marked as versions (e.g., v1.0).
- **Architecture Decision Records (ADRs):** If a "frozen" document needs to be structurally changed, an ADR must be written, proposed, and approved first. Once approved, the main documentation is patched to reflect the ADR.

---

## 5. Business Rules

- **No Duplication:** Do not repeat the same architectural rule in multiple places. Use Cross References (links) instead.

---

## 6. Acceptance Criteria

- A new feature PR is rejected if the corresponding module documentation is not updated to reflect the new behavior or events.

---

## 7. Cross References

- [14-VersioningStrategy.md](./14-VersioningStrategy.md)
