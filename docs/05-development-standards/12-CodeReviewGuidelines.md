# 12 — Code Review Guidelines

> **Module:** Development Standards
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Code Review Guidelines establish a consistent standard for evaluating proposed changes to the codebase, ensuring high quality and strict architectural compliance.

---

## 2. Review Checklist

Reviewers must evaluate Pull Requests (PRs) against the following conceptual criteria:

### 2.1 Architecture Compliance
- Does the change respect established module boundaries?
- Are dependencies inverted appropriately using abstractions?
- Does the code adhere to the offline-first and local-first philosophies?

### 2.2 Security Review
- Is user input validated at the boundaries?
- Is output properly sanitized?
- Does the change introduce new dependencies that require security auditing?

### 2.3 Performance Review
- Does the PR introduce synchronous blocking I/O on the main thread?
- Are large lists paginated or virtualized?
- Are expensive operations cached or moved to background threads?

### 2.4 Documentation Review
- Are all relevant module specifications in `docs/` updated to reflect the new behavior?
- Are complex internal mechanisms explained with "why" comments rather than "what" comments?

### 2.5 Testing Expectations
- Does the PR include adequate automated tests (unit/integration) covering both happy paths and edge cases?
- Are bug fixes accompanied by a regression test?

---

## 3. Definition of Done

A task or feature is conceptually considered "Done" when it passes all quality gates:
- Architecture compliance verified
- Documentation updated and reviewed
- Automated tests updated and passing
- Security review completed
- Performance review completed
- Code review completed and approved

## 4. Quality Gates

Reviewers act as the conceptual quality gates for the project. These gates include:
- **Build validation:** Ensuring the application compiles without errors.
- **Test validation:** Ensuring all automated tests pass.
- **Documentation review:** Ensuring specifications match implementation.
- **Architecture compliance:** Ensuring module boundaries are respected.
- **Security review:** Ensuring data protection and validation standards are met.

---

## 5. Business Rules

- **No Self-Approval:** Authors cannot approve their own PRs.
- **Constructive Feedback:** Reviews must be professional, constructive, and point to specific architectural or coding standards when requesting changes.

---

## 6. Acceptance Criteria

- A PR cannot be merged until it passes CI checks and receives approval confirming it meets this checklist.

---

## 7. Cross References

- [01-ArchitecturePrinciples.md](./01-ArchitecturePrinciples.md)
- [10-SecurityGuidelines.md](./10-SecurityGuidelines.md)
