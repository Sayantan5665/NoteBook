# 07 — Import/Export Governance

> **Module:** Import / Export
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Governance document defines the strict ownership boundaries and responsibilities for the Import / Export module, ensuring it acts solely as a translation layer.

---

## 2. Ownership Boundaries

### 2.1 Import / Export Owns:
- **Import coordination:** Managing the ingestion workflow.
- **Export coordination:** Managing the extraction workflow.
- **Validation:** Ensuring data safety at the perimeter.
- **Artifact generation:** Creating `.md`, `.zip`, etc.

### 2.2 Import / Export Does NOT Own:
- **Workspace**
- **Notes**
- **Attachments**
- **OCR**
- **Search**
- **Embeddings**
- **AI**
- **Synchronization**
- **Backup**

---

## 3. Consistency Rules

- **Notebook entities remain canonical.** Import / Export never owns them.
- **Delegation of Persistence:** The Import module relies entirely on Domain Services (e.g., `NoteService.createNote()`) to persist validated data. It never writes to the SQLite database itself.
- **Delegation of Retrieval:** The Export module relies entirely on Domain Services to retrieve data. It never reads the SQLite database directly.

---

## 4. Business Rules

- **Import converts external data into Notebook entities.**
- **Export converts Notebook entities into external artifacts.**
- **Notebook remains the canonical source of truth.**

---

## 5. Acceptance Criteria

- Code reviews confirm zero SQL statements exist within the Import/Export module. All data access occurs via Domain Service interfaces.

---

## 6. Cross References

- [01-ImportOverview.md](./01-ImportOverview.md)
- [02-ExportOverview.md](./02-ExportOverview.md)
