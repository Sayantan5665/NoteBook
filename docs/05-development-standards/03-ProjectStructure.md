# 03 — Project Structure

> **Module:** Development Standards
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Project Structure document outlines the conceptual organization of directories, modules, and assets to ensure the codebase remains navigable and logically grouped as it scales.

---

## 2. Conceptual Organization

### 2.1 Folder and Module Organization
- **Bounded Contexts:** Code is organized by domain module (e.g., `workspace/`, `notes/`, `search/`) rather than strictly by technical role (e.g., avoiding monolithic `controllers/` or `services/` folders at the root).
- **Internal Cohesion:** Inside a module folder, structure can be separated by layers (e.g., `api`, `domain`, `infrastructure`).

### 2.2 Shared Libraries
- **Core / Shared:** Functionality used universally across multiple bounded contexts (e.g., generic utilities, base event buses, UI components) resides in a clearly defined `shared/` or `core/` directory.

### 2.3 Assets
- **Static Assets:** Images, icons, and static stylesheets are isolated in an `assets/` directory, organized by component or feature.

### 2.4 Configuration
- **Environment & App Config:** Configuration schemas and environment variable mappings reside in a dedicated `config/` directory at the project root.

### 2.5 Testing
- **Test Proximity:** Unit tests should reside alongside the code they test (e.g., `NoteService.ts` and `NoteService.test.ts`).
- **Integration/E2E:** Broad-scope tests spanning multiple modules reside in a separate `tests/` directory at the project root.

### 2.6 Documentation
- **Architecture Documentation:** All high-level documentation remains in `docs/`. 
- **Code-Level Documentation:** Specific implementation readmes can reside inside the specific module folders.

### 2.7 Code Ownership Philosophy
- Each module should have clearly defined ownership.
- Explicit ownership improves consistency and reduces conflicting changes across bounded contexts.

---

## 3. Future Extensibility

- The folder structure must inherently support the extraction of modules into standalone packages or micro-frontends if required in the future, by minimizing cross-folder tangled dependencies.

---

## 4. Business Rules

- **Module Isolation:** A module cannot import directly from the internal files of another module; it must use the other module's public `index` or API export file.

---

## 5. Acceptance Criteria

- Code reviews reject PRs that place domain-specific logic in the global `shared/` folder or place shared utilities deep inside a domain folder.

---

## 6. Cross References

- [01-ArchitecturePrinciples.md](./01-ArchitecturePrinciples.md)
