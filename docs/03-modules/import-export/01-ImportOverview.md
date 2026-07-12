# 01 — Import Overview

> **Module:** Import / Export
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Import Overview details how external data is safely ingested into the Notebook application. It ensures that foreign data is systematically translated, validated, and safely committed to the canonical store.

---

## 2. Import Philosophy

- **Import converts external data into Notebook entities.** It translates formats like Markdown or HTML into the native Notebook schema.
- **Imported data becomes Notebook data only after successful validation.** Raw external data is never trusted.
- **Import never becomes the owner of Notebook entities.** The Domain layer remains the owner.

---

## 3. Conceptual Identities

- **Import Source:** Represents external data coming into the ecosystem.
- **Import Request:** Initiates the import process, specifying the source data and format.
- **Import Session:** Coordinates a single import operation.
- **Imported Artifact:** The raw, temporary external data before it is converted. Imported Artifacts are transformed into Notebook entities only after successful validation.
- **Notebook Entity:** The canonical representation of the data within the system.
- **Import Result:** The final status (Success, Failure, Cancelled, Partial Success).

---

## 4. Import Lifecycle

### 4.1 Preparation
The system receives an Import Request, parses the source location, and initializes an Import Session.

### 4.2 Validation
The source files are checked for compatibility, size limits, and format correctness. 

### 4.3 Conversion & Execution
External data is parsed and mapped to Notebook entity models (e.g., creating a Note model).

### 4.4 Conflict Handling
If an imported file conflicts with an existing Note (e.g., same title/ID), the system may append, skip, or prompt the user, depending on the strategy. It never silently overwrites canonical data.

### 4.5 Completion
Converted entities are sent to Domain Services for persistence. An `ImportCompleted` event is published.

### 4.6 Failure Handling
If conversion or validation fails, the Import Session aborts safely. No corrupted entities are passed to the Domain.

---

## 5. Supported Conceptual Sources

- Local File System (Markdown, HTML, Text).
- Future: Roam Research, Notion, Obsidian export archives.

---

## 6. Business Rules

- **Invalid imports never become Notebook data.**
- **Notebook entities remain the canonical source of truth.**
- **Infrastructure modules coordinate processing.**
- **Derived artifacts never replace Notebook entities.**
- **Ownership never transfers.**

---

## 7. Acceptance Criteria

- Importing a structurally malformed JSON file triggers a validation failure without crashing the application.
- Successfully imported data appears in the Workspace exactly as if it were created natively.

---

## 8. Cross References

- [03-ImportValidation.md](./03-ImportValidation.md)
- [05-ImportExportEvents.md](./05-ImportExportEvents.md)
