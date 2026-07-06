# Documentation Naming Convention

> **Document Type:** Standard
> **Status:** Approved

---

## 1. Purpose

This document outlines the standard naming and numbering conventions used across the Notebook documentation suite. Consistent naming ensures sorting order in file explorers and provides immediate context to the reader.

## 2. Folder Numbering

Top-level documentation directories are numbered sequentially (starting at `00`) to enforce a logical reading order. 
Example:
- `00-overview/`
- `01-architecture/`
- `02-database/`
- `03-modules/`

## 3. README Usage

A `README.md` file should be placed at the root of the project and at the root of every major subsystem directory (e.g., `03-modules/folder/README.md`). 
- **Purpose:** To provide a high-level summary, scope, and entry point for that specific directory context.
- **Naming:** Always uppercase `README.md`.

## 4. Ordered Specification Documents

Within a directory, specification documents that outline sequential workflows or hierarchical concepts should be prefixed with a two-digit number.
Example:
- `01-FolderLifecycle.md`
- `02-FolderHierarchy.md`
- `03-FolderOperations.md`

## 5. Templates

Reusable templates are stored in `docs/templates/`. They use PascalCase without numbering to denote they are class-like structures rather than sequential chapters.
Example: `ModuleSpecification.md`, `ADR.md`.

## 6. Management Documents

Root-level project management documents use uppercase snake_case to stand out from technical specifications.
Example: `PROJECT_PROGRESS.md`, `INDEX.md`, `GOVERNANCE.md`.

## 7. ADR Numbering

Architecture Decision Records use a strict `ADR-XXX-[Topic].md` format.
- `XXX`: Sequential three-digit number (e.g., `001`).
- `[Topic]`: PascalCase short description (e.g., `WorkspaceIsolation`).
- Example: `ADR-009-WorkspaceIsolation.md`.
