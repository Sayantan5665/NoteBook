# 11 — Implementation Readiness Checklist

> **Module:** Implementation Playbook
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

The Implementation Readiness Checklist defines the criteria that must be met before an engineering team begins writing code for a new major feature or module.

---

## 2. Pre-Implementation Checklist

- [ ] **Architecture Understood:** The team has read and discussed the relevant `docs/01-architecture/` and `docs/03-modules/` specifications.
- [ ] **Dependencies Reviewed:** The team understands the `04-DependencyGraph.md` and knows exactly which modules their new feature is allowed to import.
- [ ] **Tests Planned:** The team has a conceptual plan for how the feature will be tested (e.g., mocking the DB vs. using an in-memory DB).
- [ ] **Data Structures Frozen:** If the feature requires database schema changes, the schema design has been reviewed and approved by the core maintainers.
- [ ] **Documentation Reviewed:** The team has reviewed the Definition of Done in the `docs/05-development-standards/`.

---

## 3. Business Rules

- **No Code Hacking:** Large features must not begin as "experimental hacks" that accidentally become production code. They must start with deliberate readiness planning.

---

## 4. Acceptance Criteria

- Project managers or technical leads verify this checklist before moving a ticket from the "Backlog" into "In Progress."

---

## 5. Cross References

- [04-ImplementationWorkflow.md](./04-ImplementationWorkflow.md)
