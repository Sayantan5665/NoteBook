# 02 — Repository Setup

> **Module:** Implementation Playbook
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Repository Setup document conceptually describes the physical layout of the source code, ensuring that the directory structure reflects the bounded contexts of the architecture.

---

## 2. Conceptual Repository Layout

### 2.1 Workspace Organization
The repository is organized conceptually into distinct packages or workspaces to enforce architectural boundaries:
- **`core/`**: Contains the SQLite database engine, core domain entities, and platform-agnostic business logic.
- **`ui/`**: Contains all frontend components, strictly decoupled from `core`.
- **`plugins/`**: Contains the Plugin SDK and sandbox environment.
- **`desktop/`**: Contains the OS-level wrappers, tray icons, and native file-system integrations.

### 2.2 Configuration Locations
- Global configuration files for linting, formatting, and build tools reside at the root of the repository.
- Module-specific configurations reside within their respective workspaces.

### 2.3 Documentation Locations
- All architectural and specification documentation lives exclusively in the `/docs` folder at the root of the repository.

### 2.4 Testing Locations
- Unit tests live adjacent to the files they test.
- Integration and E2E tests live in a dedicated `tests/` directory at the root, simulating external consumers of the application.

---

## 3. Responsibilities

- **Core Maintainers:** Enforce the repository structure during code reviews. If a developer places UI code in the `core/` folder, the PR must be rejected.

---

## 4. Business Rules

- **Structural Integrity:** The folder structure must visually represent the architectural boundaries. Circular imports between root folders are strictly prohibited.

---

## 5. Acceptance Criteria

- A new developer can intuitively guess where the code for "Markdown Parsing" lives versus where the code for "Database Migrations" lives.

---

## 6. Future Enhancements

- Implementing strict build-tooling rules that physically prevent cross-boundary imports.

---

## 7. Cross References

- [03-DevelopmentEnvironment.md](./03-DevelopmentEnvironment.md)
