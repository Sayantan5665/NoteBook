# 06 — Logging Standards

> **Module:** Development Standards
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Logging Standards ensure that application logs provide maximum visibility for debugging and auditing, while strictly adhering to privacy constraints.

---

## 2. Core Concepts

### 2.1 Logging Levels
- **FATAL / CRITICAL:** Application cannot continue (e.g., database corruption). Requires immediate attention.
- **ERROR:** A specific operation failed, but the app can continue (e.g., sync failed).
- **WARN:** Unexpected state or degraded performance, but successful operation (e.g., falling back to a slower search algorithm).
- **INFO:** Significant lifecycle events (e.g., Application started, Sync completed).
- **DEBUG:** Detailed flow information used for troubleshooting.
- **TRACE:** Highly verbose execution steps (e.g., specific SQL queries). Disabled by default.

### 2.2 Structured Logging
- Logs must be structured (e.g., JSON) to allow easy parsing by log viewers or ingestion tools. A log entry must separate the `message` from `metadata` (e.g., `userId`, `moduleId`, `durationMs`).

### 2.3 Correlation Identifiers
- Operations that span multiple asynchronous steps or modules should attach a `correlationId` to trace the entire workflow through the logs.

---

## 3. Privacy and Protection

### 3.1 Sensitive Data Protection
- **Never Log PII/Private Data:** The text of Notes, passwords, API keys, and secure tokens must *never* appear in the logs.
- Scrubbing mechanisms should be employed to strip sensitive fields before serialization.

---

## 4. Specialized Logging

- **Audit Logging:** For high-security environments, critical actions (e.g., Workspace deletion, Plugin installation) are logged to a separate, tamper-evident audit trail.
- **Performance Logging:** Tracking execution times of expensive operations (e.g., vector embeddings) at the `DEBUG` or `INFO` level to identify bottlenecks.

---

## 5. Business Rules

- **Local logs remain local.** Logs are written to the local disk and are never uploaded to a centralized server without explicit, per-incident user consent.

---

## 6. Acceptance Criteria

- Code reviews flag any `console.log` or generic logging statements that include raw user input.

---

## 7. Cross References

- [05-ErrorHandling.md](./05-ErrorHandling.md)
- [10-SecurityGuidelines.md](./10-SecurityGuidelines.md)
