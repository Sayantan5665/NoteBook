# 04 — Version Management

> **Module:** Build, Packaging & Release
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Version Management document defines the policies for tagging artifacts to convey compatibility, features, and migration requirements to end-users and plugin developers.

---

## 2. Scope

Covers application versioning, documentation versioning, module versioning, and database migration compatibility.

---

## 3. Conceptual Strategy

### 3.1 Application Versions
- The application uses Semantic Versioning (`MAJOR.MINOR.PATCH`).
- **MAJOR:** Breaks backward compatibility (e.g., SQLite schema changes requiring one-way migration).
- **MINOR:** Adds functionality without breaking existing databases or core Plugin APIs.
- **PATCH:** Security and bug fixes.

### 3.2 Documentation Versions
- Documentation versions track major architectural phases (e.g., `v1.0`). Updates during active development phases are `Drafts`.

### 3.3 Module Versions
- If internal modules (e.g., the Plugin SDK) are published as standalone artifacts to package registries (like npm or Maven), they must maintain their own Semantic Versioning independent of the main application version.

### 3.4 Migration Compatibility
- The application binary must embed migration scripts capable of transforming the local SQLite database from any prior `MAJOR.MINOR` version to the current version.

---

## 4. Responsibilities

- **Release Engineering:** Ensure version numbers are incremented correctly in manifests and configuration files before build.

---

## 5. Business Rules

- **Zero-Loss Migrations:** A major version upgrade must never drop user data. If a feature is removed, its data must be gracefully archived or exported prior to migration.

---

## 6. Acceptance Criteria

- The Plugin SDK successfully rejects plugins targeting an incompatible MAJOR version of the application.

---

## 7. Future Enhancements

- Exposing specific feature flags tied to minor versions to enable gradual rollouts.

---

## 8. Cross References

- [05-development-standards/14-VersioningStrategy.md](../05-development-standards/14-VersioningStrategy.md)
