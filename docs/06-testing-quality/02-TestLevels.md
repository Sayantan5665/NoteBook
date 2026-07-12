# 02 — Test Levels

> **Module:** Testing & Quality Assurance
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

This document defines the conceptual hierarchy of tests, ensuring that validation occurs at the appropriate layer of granularity.

---

## 2. Test Levels

### 2.1 Unit
- **Scope:** Individual classes, functions, or small cohesive units of logic (e.g., a Markdown parser, a URL validator).
- **Execution:** Highly isolated, extremely fast. External dependencies (like the database or filesystem) are mocked or stubbed.

### 2.2 Integration
- **Scope:** Interaction between two or more units, or between a unit and an external subsystem (e.g., a Domain Service interacting with an actual SQLite Repository).
- **Execution:** Verifies that boundaries and data contracts are respected. Uses real databases (temporary) or file systems.

### 2.3 Component
- **Scope:** A complete, bounded UI or logical component (e.g., the entire Note Editor, or the Search Engine module) tested in isolation from the rest of the application.
- **Execution:** Verifies the internal behavior of a module via its public API or UI surface.

### 2.4 System / End-to-End (E2E)
- **Scope:** The entire application stack running as a single, compiled artifact.
- **Execution:** Simulates real user interactions (e.g., clicking buttons, typing text) to verify complete workflows from the UI down to the local database and back.

### 2.5 Acceptance
- **Scope:** Business workflows defined in the requirements.
- **Execution:** Validates that the system meets the "Definition of Done" and behaves as the user expects.

### 2.6 Regression
- **Scope:** Previously tested functionality.
- **Execution:** Automated execution of existing test suites whenever new code is introduced to ensure prior functionality remains intact.

### 2.7 Exploratory
- **Scope:** Unscripted, manual testing.
- **Execution:** Testers explore the application dynamically to find edge cases, UX inconsistencies, and unexpected behaviors that automated tests might miss.

---

## 3. Business Rules

- **Test Pyramid:** The majority of tests must be Unit and Integration tests. Slow and brittle E2E tests should be reserved for critical user journeys.

---

## 4. Acceptance Criteria

- Code reviews ensure that tests are written at the correct level (e.g., complex business logic is tested via unit tests, not exclusively via UI E2E tests).

---

## 5. Cross References

- [01-TestingStrategy.md](./01-TestingStrategy.md)
