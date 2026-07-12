# Import / Export Module

> **Module:** Import / Export
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Import / Export module bridges the gap between the isolated Notebook ecosystem and the external world. It ensures that users can bring existing data into their Workspace and extract their Notebook data into portable formats, preventing vendor lock-in.

---

## 2. Scope

**In Scope:**
- Orchestration of data conversion into Notebook entities (Import).
- Orchestration of data conversion from Notebook entities to derived artifacts (Export).
- Rigorous validation of inbound and outbound data.
- Management of Import/Export sessions and extension points for various file formats.

**Out of Scope:**
- Live synchronization of data (handled by Sync module).
- Direct mutation of canonical data without Domain Service validation.
- Implementation details of specific format parsers (e.g., Markdown vs. HTML parsing).

---

## 3. Ownership and Responsibilities

- **The module owns:** Import coordination, Export coordination, Validation, and Artifact generation.
- **The module does NOT own:** Workspace, Notes, Attachments, OCR, Search, Embeddings, AI, Synchronization, or Backup.
- **Notebook entities remain canonical.** The module serves as a translator, never an owner.

---

## 4. Dependencies

- **Domain Services:** For creating imported notes and retrieving notes to export.
- **Event Bus:** For broadcasting lifecycle events.
- **Extension Providers:** For actual format conversion (e.g., Markdown to internal TipTap JSON).

---

## 5. Business Rules

- **Import converts external data into Notebook entities.** Imported data becomes Notebook data only after successful validation.
- **Export converts Notebook entities into external artifacts.** Export artifacts are derived artifacts.
- **Import and Export never become owners of Notebook entities.**
- **Notebook remains the canonical source of truth.**

---

## 6. Acceptance Criteria

- Importing a directory of Markdown files successfully creates corresponding Note entities via Domain Services.
- Exporting a Note successfully generates a standalone artifact without altering the original Note.
- The system safely rejects and aborts imports of corrupted or unsupported files.

---

## 7. Cross References

- [01-ImportOverview.md](./01-ImportOverview.md)
- [02-ExportOverview.md](./02-ExportOverview.md)
- [07-ImportExportGovernance.md](./07-ImportExportGovernance.md)
