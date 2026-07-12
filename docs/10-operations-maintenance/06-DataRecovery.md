# 06 — Data Recovery

> **Module:** Operations, Maintenance & Evolution
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Data Recovery document defines the conceptual approaches for salvaging user data in the event of catastrophic application failure, database corruption, or synchronization conflict.

---

## 2. Recovery Philosophy

### 2.1 Recovery Priorities
The absolute highest priority is preserving the canonical text of the Notes. Attachments, embeddings, and search indexes are secondary and can be regenerated or re-acquired if necessary.

### 2.2 Workspace Recovery
- If the application configuration is corrupted, the user should be able to point a fresh installation at their existing Workspace directory, and the application should instantly recognize and load the SQLite database.

### 2.3 Corruption Recovery
- If SQLite throws an `SQLITE_CORRUPT` error, the application must immediately freeze write operations.
- The UI should guide the user to a "Recovery Mode" that attempts to extract raw text data from the corrupted database or prompts them to restore the last automatic backup.

### 2.4 Failure Recovery (Sync)
- If a remote sync provider corrupts the local database, the CRDT/Timestamp history should ideally allow the application to "roll back" to a known good state prior to the malicious/corrupted sync event.

---

## 3. Responsibilities

- **Maintainers:** Ensure that recovery tools (like SQLite dumping scripts) are documented and accessible to advanced users if the application UI fails.

---

## 4. Business Rules

- **Do No Harm:** Automated recovery scripts must always duplicate the corrupted file before attempting surgery on it.

---

## 5. Acceptance Criteria

- The application gracefully handles `SQLITE_CORRUPT` without crashing to the desktop, providing the user with actionable next steps.

---

## 6. Cross References

- [05-BackupOperations.md](./05-BackupOperations.md)
