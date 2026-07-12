# 05 — Backup Operations

> **Module:** Operations, Maintenance & Evolution
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

Backup Operations define the processes required to ensure that the automated backup mechanisms built into the application remain reliable over time.

---

## 2. Backup Maintenance Strategy

### 2.1 Integrity Verification
- The application must routinely (and quietly) verify that the ZIP archives it creates are valid and that the SQLite database inside is not corrupted.

### 2.2 Backup Rotation Philosophy
- To prevent infinite disk usage, the application must manage a rotation strategy (e.g., keep the last 5 daily backups, 4 weekly backups, 1 monthly backup).
- Older backups are systematically pruned.

### 2.3 Restore Validation
- The restoration process must be tested across major OS versions to ensure file permission issues do not prevent a user from recovering their data.

### 2.4 Compatibility
- Maintainers must ensure that backups taken in v1.0 can be seamlessly restored in v2.0, invoking database migrations automatically upon restore.

---

## 3. Responsibilities

- **Core Engineering:** Maintain the background backup jobs and rotation logic.

---

## 4. Business Rules

- **Non-Destructive Restoration:** Restoring a backup must never silently overwrite the current workspace. It should either restore to a new folder or explicitly require user confirmation of the overwrite.

---

## 5. Acceptance Criteria

- QA routinely tests restoring 2-year-old synthetic backups into the current application version.

---

## 6. Cross References

- [06-DataRecovery.md](./06-DataRecovery.md)
