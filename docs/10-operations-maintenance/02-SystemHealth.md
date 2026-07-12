# 02 — System Health

> **Module:** Operations, Maintenance & Evolution
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The System Health document defines the conceptual indicators that demonstrate whether the various subsystems of the application are operating normally.

---

## 2. Health Indicators

### 2.1 Healthy Workspace & Database
- The SQLite database passes `PRAGMA integrity_check`.
- Workspace metadata matches the physical directory structure.

### 2.2 Healthy Search Index
- The FTS index matches the row count of the canonical Notes table.
- Query latency remains within acceptable thresholds (<100ms).

### 2.3 Healthy Embeddings
- The background embedding queue is empty or processing at a stable rate.
- No orphan vectors exist in the vector store.

### 2.4 Healthy Synchronization
- The background sync engine connects successfully (if online).
- The conflict queue is empty, and the `last_synced_cursor` is progressing.

### 2.5 Healthy Plugins
- All installed plugins are active and responding to lifecycle events within timeout thresholds.
- No plugins are silently throwing unhandled exceptions in the sandbox.

### 2.6 Healthy AI Subsystem
- The application successfully binds to the local LLM runtime (e.g., Llama.cpp) on boot.
- Context assembly executes without exceeding token budgets.

---

## 3. Recovery Indicators

- If a subsystem is marked as "Unhealthy" (e.g., FTS index corruption), the system should expose a manual or automatic recovery path (e.g., a "Rebuild Search Index" button).

---

## 4. Business Rules

- **Isolated Degradation:** If the Plugin subsystem is unhealthy, it must be disabled, but the Core Workspace must remain healthy and accessible.

---

## 5. Acceptance Criteria

- The application exposes a "Diagnostic Screen" to the user, visually representing the conceptual health of these subsystems.

---

## 6. Cross References

- [03-MonitoringStrategy.md](./03-MonitoringStrategy.md)
