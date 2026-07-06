# Architecture Decision Records (ADR)

> **Document Type:** Navigation / Guidelines
> **Status:** Active
> **Applies To:** Notebook Project Architecture

---

## 1. Purpose of ADRs

Architecture Decision Records (ADRs) capture important architectural decisions made during the development of the Notebook project. They document the context, reasoning, trade-offs, and final decision, providing historical context for *why* the system is designed the way it is.

## 2. ADR Numbering Convention

ADRs are numbered sequentially using a three-digit format prefixed by `ADR-`. 
Example: `ADR-001-LocalFirst.md`, `ADR-009-WorkspaceIsolation.md`.

## 3. ADR Lifecycle

- **Draft:** The decision is being discussed or researched.
- **Proposed:** The decision is formalized and ready for review.
- **Accepted:** The decision is approved and will be implemented.
- **Deprecated/Superseded:** A newer ADR has replaced or modified this decision.

## 4. Relationship with Architecture Documents

ADRs are specific, atomic records of decisions made at a point in time. 
Architecture documents (in `docs/01-architecture/`) reflect the *current state* of the system. Once an ADR is accepted, the relevant architecture documents are patched to reflect the new decision.

## 5. Relationship with Frozen Documentation

Baseline specifications (e.g., core database schemas, foundational module specifications) are considered "frozen". Once frozen, they cannot be modified casually. 
Any structural or fundamental change to a frozen document must be accompanied by an accepted ADR. 

## 6. When an ADR is Required

An ADR is required when a decision:
- Introduces a new foundational technology or framework.
- Changes the approved physical database schema significantly.
- Modifies inter-module communication boundaries.
- Alters cross-cutting concerns (security, sync, deployment).
- Reverses a previously accepted ADR.

## 7. How ADRs Supersede Previous Decisions

ADRs are immutable records of a point in time. When a decision is changed, a *new* ADR is created. The new ADR explicitly references the older ADR it supersedes, and the older ADR's status is updated to "Superseded". The new ADR becomes the active architectural mandate.
