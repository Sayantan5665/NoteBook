# 03 — Development Environment

> **Module:** Implementation Playbook
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Development Environment document defines the conceptual requirements for a developer's local machine, ensuring consistency, security, and offline capability during the engineering process.

---

## 2. Conceptual Environment

### 2.1 Required Tooling
- Developers must use standardized, pinned versions of the core compilers and package managers.
- A local SQLite viewing tool is highly recommended for inspecting synthetic databases during development.

### 2.2 Environment Preparation
- The environment setup process must be completely scripted or containerized where possible, allowing a new developer to go from `git clone` to running the application in a single conceptual step.

### 2.3 Configuration Philosophy
- The application must boot immediately using sensible defaults without requiring complex local `.env` files.
- Local development databases must be ephemeral or easily resettable via a single script.

### 2.4 Secrets Management
- Developer API keys (e.g., for testing remote AI inference) must be injected securely at runtime via local `.env` files that are strictly excluded from version control (`.gitignore`).
- No production secrets or certificates are ever present in the development environment.

### 2.5 Offline Development
- The development environment must not rely on constant internet access. Tests, builds, and local execution must succeed even if the developer disables their Wi-Fi adapter.

---

## 3. Responsibilities

- **DevOps / Release Engineering:** Maintain the scripts that orchestrate the local development environment setup.

---

## 4. Business Rules

- **No Remote Dependencies:** Developers must not rely on remote staging databases or remote mock servers for core application development. Everything runs locally.

---

## 5. Acceptance Criteria

- A developer on an airplane without Wi-Fi can successfully run the entire test suite and build the application from source.

---

## 6. Cross References

- [02-RepositorySetup.md](./02-RepositorySetup.md)
