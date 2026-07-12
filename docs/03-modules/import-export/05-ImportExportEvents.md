# 05 — Import/Export Events

> **Module:** Import / Export
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Events document outlines how the Import / Export module communicates its asynchronous operations to the rest of the application without tightly coupling to the UI or Domain.

---

## 2. Event Philosophy

- Events communicate state and progress.
- Events never pass live canonical entities, only metadata (like identifiers or paths).

---

## 3. Published Events

The module broadcasts these conceptual events:

### 3.1 Import Events
- `ImportStarted`: Fired when an Import Session begins.
- `ImportCompleted`: Fired when validation and domain persistence succeed.
- `ImportCancelled`: Fired if the user aborts.
- `ImportFailed`: Fired if validation or processing fails.

### 3.2 Export Events
- `ExportStarted`: Fired when an Export Session begins.
- `ExportCompleted`: Fired when the derived artifact is fully written.
- `ExportCancelled`: Fired if the user aborts.
- `ExportFailed`: Fired if IO or validation errors occur.

---

## 4. Consumed Events

- The module does not typically consume Domain events, as Import and Export are user-initiated imperative actions.

---

## 5. Business Rules

- Events decouple the long-running I/O of import/export from the UI thread.
- Events never execute business operations directly.

---

## 6. Acceptance Criteria

- When an import takes longer than 1 second, `ImportStarted` allows the UI to render a progress indicator, followed by `ImportCompleted` to refresh the file tree.

---

## 7. Cross References

- [01-ImportOverview.md](./01-ImportOverview.md)
- [02-ExportOverview.md](./02-ExportOverview.md)
