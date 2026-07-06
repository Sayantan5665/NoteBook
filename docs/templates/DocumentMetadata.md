# Document Status Metadata

> **Document Type:** Template Guideline
> **Status:** Active

---

## 1. Purpose

This template defines a lightweight metadata standard to be included at the top of major specification documents (such as Architecture, Database, and Module documents). It ensures immediate visibility into the document's state and ownership without cluttering the technical content.

## 2. Metadata Standard

The following fields should be included in a markdown blockquote (`>`) at the top of major documents:

```markdown
> **Document Type:** [Module Specification | Architecture Overview | Database Schema | etc.]
> **Status:** [Draft | Proposed | Approved | Frozen | Deprecated]
> **Version:** [1.0, 1.1, etc.]
> **Last Reviewed:** [YYYY-MM-DD]
> **Depends On:** [Comma-separated list of dependencies, e.g., Workspace Module]
> **Related ADRs:** [ADR-001, ADR-009]
> **Document Owner:** [Role or Team, e.g., Core Architecture Team]
```

## 3. Usage Rules

- **Do NOT insert metadata into every existing document.** Only apply this standard to newly authored major specifications or when significantly refactoring an existing frozen document via an ADR.
- **Status Definitions:**
  - **Draft:** Being written, heavily fluctuating.
  - **Proposed:** Ready for peer review.
  - **Approved:** Review passed, ready for implementation.
  - **Frozen:** Implemented, stable, requires an ADR to change.
  - **Deprecated:** No longer applicable.
- **Last Reviewed:** Updated only when a formal review of the document's accuracy against the codebase is completed.
- **Related ADRs:** Ensures developers understand the historical reasoning behind the spec.
