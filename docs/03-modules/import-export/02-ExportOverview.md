# 02 — Export Overview

> **Module:** Import / Export
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Export Overview details how canonical Notebook entities are safely extracted and converted into portable, derived artifacts for external use.

---

## 2. Export Philosophy

- **Export converts Notebook entities into external artifacts.** It translates the native Notebook schema into formats like Markdown or PDF.
- **Export artifacts are derived artifacts.** They are a snapshot of the data at the time of export.
- **Export never becomes the owner of Notebook entities.** It acts in a read-only capacity against the Domain.

---

## 3. Conceptual Identities

- **Export Request:** Initiates the export process, specifying the target format and scope (e.g., single Note vs. entire Folder).
- **Export Session:** Coordinates a single export operation.
- **Notebook Entity:** The canonical source from which the export is derived.
- **Export Artifact:** Immutable point-in-time snapshots derived from Notebook entities. Export Artifacts never become Notebook entities.
- **Export Result:** The final status (Success, Failure, Cancelled).

---

## 4. Export Lifecycle

### 4.1 Preparation
The system receives an Export Request, queries the Domain for the requested entities, and initializes an Export Session.

### 4.2 Validation
The requested entities are validated for exportability (e.g., ensuring attachments exist).

### 4.3 Conversion & Execution
Notebook entities are translated into the requested external format via extension providers.

### 4.4 Completion
The Export Artifact is written to the destination. An `ExportCompleted` event is published.

### 4.5 Failure Handling
If writing to the destination fails (e.g., permissions error), the Export Session aborts safely. The active Notebook remains entirely unaffected.

---

## 5. Export Strategies

- **Single Entity Export:** Exporting a specific Note.
- **Bulk Export:** Exporting a Folder or entire Workspace.
- **Format Strategies:** Markdown, HTML, PDF, or custom plugin formats.

---

## 6. Business Rules

- **Invalid exports are cancelled safely.**
- **Export never modifies Notebook data.**
- **Notebook entities remain the canonical source of truth.**
- **Infrastructure modules coordinate processing.**
- **Derived artifacts never replace Notebook entities.**
- **Ownership never transfers.**

---

## 7. Acceptance Criteria

- Exporting a Note with images successfully packages the text and attachments into a derived artifact without locking or altering the original Note.
- A failed export (e.g., disk full) cleans up temporary files and emits an `ExportFailed` event.

---

## 8. Cross References

- [04-ExportValidation.md](./04-ExportValidation.md)
- [05-ImportExportEvents.md](./05-ImportExportEvents.md)
