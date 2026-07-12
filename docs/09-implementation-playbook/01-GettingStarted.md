# 01 — Getting Started

> **Module:** Implementation Playbook
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Getting Started guide defines the onboarding path for new developers, ensuring they understand the overarching philosophy and architecture before writing any code.

---

## 2. Developer Approach

A new developer joining the project must approach the codebase with the understanding that this is an **offline-first, privacy-first, local-first** application. All assumptions based on cloud-native or microservice architectures must be discarded. 

---

## 3. Mandatory Reading Order

Before making their first commit, developers must read the documentation in the following sequence:

1. **Understanding the Vision:** Read the root `README.md` and `docs/00-overview/` to grasp the core identity of the Notebook application.
2. **Understanding Architecture:** Read `docs/01-architecture/` and `docs/02-database/`. This provides the non-negotiable boundaries of the system.
3. **Understanding Standards:** Read `docs/05-development-standards/` to learn how code must be written, reviewed, and versioned.
4. **Understanding Modules:** Before touching a specific feature, the developer must read the corresponding specification in `docs/03-modules/`.
5. **Understanding Implementation Roadmap:** Review `docs/08-implementation-planning/` to understand where the current sprint fits into the larger picture.

---

## 4. Responsibilities

- **New Developers:** Complete the reading list and ask clarifying questions before writing code.
- **Onboarding Buddy / Lead:** Verify that the new developer understands the architecture, particularly the strict decoupling of the UI from the SQLite database.

---

## 5. Business Rules

- **No Code Before Context:** No developer is permitted to submit a Pull Request without demonstrating an understanding of the architectural boundaries related to their feature.

---

## 6. Acceptance Criteria

- Developers can accurately articulate the difference between a Note Entity, a Document Entity, and an AI Context Package.

---

## 7. Cross References

- [02-RepositorySetup.md](./02-RepositorySetup.md)
