# 05 — Error Handling

> **Module:** Development Standards
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Error Handling document defines a consistent philosophy for managing failures, ensuring the application fails gracefully without corrupting user data or providing a poor user experience.

---

## 2. Error Philosophy

- **Fail-Fast Internally, Recover Gracefully Externally:** Catch errors as close to the source as possible, but only handle them if a meaningful recovery is possible. Otherwise, propagate them to a centralized boundary handler.
- **Never Corrupt Data:** The most critical rule. If a complex operation fails halfway, the system must rollback to a consistent state.

---

## 3. Error Categories

### 3.1 Recoverable vs. Non-Recoverable Errors
- **Recoverable:** Network timeouts, locked files, missing configuration defaults. The system should retry or fallback.
- **Non-Recoverable:** Corrupted SQLite database, out of memory, missing critical binaries. The system should safely abort the operation, alert the user, and shut down gracefully if necessary.

### 3.2 Internal vs. User-Facing Errors
- **Internal Errors:** Exceptions containing stack traces, raw SQL queries, and system paths. These must *never* be shown to the user.
- **User-Facing Errors:** Clean, translated, actionable messages (e.g., "The note could not be saved because the disk is full.").

---

## 4. Validation and Degradation

- **Input Validation:** All input at module boundaries (and especially from the UI or Plugins) must be strictly validated before processing. Invalid input yields a specific `ValidationError`.
- **Graceful Degradation:** If an optional subsystem fails (e.g., the AI provider times out, or the search indexer crashes), the core Notebook must continue to function.

---

## 5. Logging Expectations

- **Contextual Logging:** When throwing or handling an error, log enough context (e.g., Entity IDs, state) to reproduce the issue, without logging sensitive user data (like the contents of a Note).

---

## 6. Business Rules

- **Strict Separation:** Internal exception strings must never propagate directly to UI components.

---

## 7. Acceptance Criteria

- All expected failure modes in a given service have explicit error classes/types.
- Catch blocks do not silently swallow exceptions without logging them.

---

## 8. Cross References

- [06-LoggingStandards.md](./06-LoggingStandards.md)
