# 03 — Backup Strategies

> **Module:** Backup & Restore
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Backup Strategies document defines the various behavioral patterns that determine *when* and *how* a backup is generated. It decouples the timing and scope of a backup from the underlying lifecycle mechanisms.

---

## 2. Strategy Concepts

Strategies dictate the triggers and payloads for a Backup Session. 

### 2.1 Manual Backup
- **Trigger:** The user explicitly requests a backup via the UI.
- **Behavior:** Executes immediately, bypassing timers. Usually configured as a Full Backup.

### 2.2 Automatic Backup
- **Trigger:** Driven by specific application events (e.g., application shutdown, or immediately after a successful synchronization).
- **Behavior:** Operates transparently in the background to ensure data is protected without user intervention.

### 2.3 Scheduled Backup (Future)
- **Trigger:** A cron-like timer fires (e.g., "Every day at 2 AM").
- **Behavior:** Ensures regular snapshots of the Workspace for point-in-time recovery.

### 2.4 Full Backup
- **Scope:** Derives an artifact containing the complete SQLite database and every attachment in the Workspace.
- **Advantage:** Self-contained and independently restorable.

### 2.5 Incremental Backup (Future)
- **Scope:** Derives an artifact containing only the database pages and attachments that have changed since the last backup.
- **Advantage:** Saves disk space and execution time for massive Workspaces.

---

## 3. Business Rules

- **Strategies determine backup behavior.** They control the timing (Manual vs. Automatic) and scope (Full vs. Incremental).
- **Strategies never change ownership.** Regardless of whether a backup is manual or automatic, the resulting backup artifact is always derived data and never the canonical source of truth.
- **Backup is optional.** Strategies can be disabled completely by the user.

---

## 4. Acceptance Criteria

- Triggering an Automatic Backup on application exit successfully generates an artifact without requiring the user to wait on a blocking UI prompt.
- Invoking a Manual Backup utilizes the exact same underlying Backup Lifecycle as an Automatic Backup, proving decoupling of strategy from execution.

---

## 5. Cross References

- [01-BackupOverview.md](./01-BackupOverview.md)
- [02-BackupLifecycle.md](./02-BackupLifecycle.md)
