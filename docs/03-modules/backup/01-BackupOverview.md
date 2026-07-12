# 01 — Backup Overview

> **Module:** Backup & Restore
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Backup Overview defines the conceptual foundation of the Backup & Restore module. It clarifies what a backup is within the context of the Notebook ecosystem, establishing strict boundaries between canonical data and backup artifacts.

---

## 2. Backup, Restore, and Recovery Philosophy

- **Backup creates recoverable snapshots.** A backup generates a point-in-time representation of a Workspace. It is a derived artifact, not the Workspace itself.
- **Restore recreates Notebook state.** It promotes a validated snapshot back into an active Workspace.
- **Recovery represents the overall process.** It is the overarching workflow of returning a Workspace to a usable state after data loss or corruption. Recovery coordinates restoration but never changes Notebook ownership.
- **Backups never replace Notebook entities.** Generating a backup has zero effect on the active Domain entities.
- **Notebook data remains canonical.** The local SQLite database and live attachment directory are the sole sources of truth.
- **Immutability.** Once a backup artifact is created and validated, it is treated as an immutable object.

---

## 3. Conceptual Identities

The backup process relies on distinct conceptual identities, each with a single responsibility.

### 3.1 Backup Request
A signal that initiates a backup operation. It can be triggered manually by the user or automatically by a system event (e.g., application exit).

### 3.2 Backup Session
An ephemeral coordination activity that manages a single backup operation from start to finish. It tracks progress and state but ceases to exist once the operation completes.

### 3.3 Backup Artifact (Snapshot Philosophy)
A Backup Artifact is an immutable snapshot representing Notebook state at one specific point in time. Snapshots never become live Notebook entities on their own. Furthermore, snapshots cannot be modified after successful creation; they are strictly derived artifacts, not canonical data.

### 3.4 Backup Strategy
The rules engine determining *how* and *when* a backup is performed (e.g., Full, Incremental, Scheduled).

### 3.5 Backup Result
The final status report (Success, Failure, Cancelled) of a Backup Session, often accompanied by metadata (duration, size, path).

---

## 4. Ownership and Responsibilities

- **The module owns** the coordination, generation, validation, and lifecycle of Backup Artifacts.
- **The module does NOT own** Notebook data. It cannot alter Notes, Tags, or Folders.

---

## 5. Business Rules

- **Backup artifacts never become Notebook entities.** They must go through the strict Restore Lifecycle to be promoted back to active data.
- **Restore requires successful validation.**
- **Failures never corrupt Notebook data.**

---

## 6. Acceptance Criteria

- Generating a Backup Artifact does not alter the modified timestamps or content of any live Notebook Note or Folder.
- A Backup Session tracks its own isolated lifecycle without interfering with ongoing Domain events (e.g., the user can continue typing while a backup runs).

---

## 7. Cross References

- [02-BackupLifecycle.md](./02-BackupLifecycle.md)
- [03-BackupStrategies.md](./03-BackupStrategies.md)
