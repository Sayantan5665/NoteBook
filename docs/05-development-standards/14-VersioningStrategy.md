# 14 — Versioning Strategy

> **Module:** Development Standards
> **Status:** Draft
> **Applies To:** Notebook Application

---

## 1. Purpose

The Versioning Strategy document defines how changes to the application, documentation, and specific modules are communicated to users and developers.

---

## 2. Semantic Versioning

The project adheres to Semantic Versioning (`MAJOR.MINOR.PATCH`) concepts.

### 2.1 Application Versioning
- **MAJOR:** Incompatible, breaking changes (e.g., massive database schema overhauls without direct migration paths).
- **MINOR:** Backward-compatible new features (e.g., adding a new local AI model provider).
- **PATCH:** Backward-compatible bug fixes.

### 2.2 Documentation Versioning
- Major project phases (e.g., Phase 3 - Module Specifications) are explicitly versioned and frozen (e.g., `v1.0`).
- Minor typos or formatting fixes do not require a version bump, but structural changes require an ADR and a minor version bump.

### 2.3 Module Versioning
- If the Plugin SDK or specific extension points are extracted as independent libraries, they must be strictly versioned to ensure third-party plugins do not break unexpectedly.

---

## 3. Backward Compatibility

- **Data Integrity:** A new version of the application must always be capable of cleanly migrating a user's SQLite database from the previous version. Data loss during upgrades is unacceptable.

---

## 4. Business Rules

- **Release Milestones:** Explicit version tags (e.g., `v1.2.0`) must be created in the repository for every public release.

---

## 5. Acceptance Criteria

- The Plugin SDK specifically enforces semantic version checking to reject incompatible plugins.

---

## 6. Cross References

- [15-DeprecationPolicy.md](./15-DeprecationPolicy.md)
