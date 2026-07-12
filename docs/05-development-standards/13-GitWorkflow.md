# 13 — Git Workflow

> **Module:** Development Standards
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

The Git Workflow document establishes the conceptual approach for branching, committing, and releasing code to maintain a clean, traceable history.

---

## 2. Conceptual Workflow

### 2.1 Branch Strategy
- **Main Branch:** Represents the stable, production-ready state of the application.
- **Feature Branches:** Created for new features, bug fixes, or architectural changes. They branch off `main` and are merged back via Pull Requests.

### 2.2 Commit Philosophy
- **Logical Units:** Commits should represent small, logical units of work.
- **Descriptive Messages:** Commit messages must explain the "why" behind the change, not just the "what". Prefixing commits with standard types (e.g., `feat:`, `fix:`, `docs:`) is highly encouraged.

### 2.3 Code Review & Pull Requests
- All changes must go through a Pull Request.
- PRs should be kept as small as possible to facilitate thorough reviews.

### 2.4 Release Branches & Hotfixes
- When preparing for a public release, a release branch may be created to freeze feature additions while allowing bug fixes.
- Urgent production issues are addressed via hotfix branches branching directly from the affected release tag or `main`.

---

## 3. Business Rules

- **No direct commits to `main`:** All changes must be merged via PR.
- **Clean History:** Feature branches should be rebased or squash-merged into `main` to maintain a linear, readable history.

---

## 4. Acceptance Criteria

- Continuous Integration (CI) blocks merging any PR that does not pass automated tests and linters.

---

## 5. Cross References

- [12-CodeReviewGuidelines.md](./12-CodeReviewGuidelines.md)
