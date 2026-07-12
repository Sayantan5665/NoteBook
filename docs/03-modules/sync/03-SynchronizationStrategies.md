# 03 — Synchronization Strategies

> **Module:** Synchronization (Sync)
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Synchronization Strategies document defines how and when synchronization operations are triggered and executed. While the Lifecycle defines *what* happens during a sync, the Strategy defines the *timing and volume* of the sync.

Strategies allow Notebook to balance data freshness against system resources, battery life, and network bandwidth.

---

## 2. Synchronization Concepts

A "Strategy" in the Synchronization module represents a specific orchestration pattern. Strategies are implementations of the Strategy Design Pattern, injected into the sync orchestration engine.

Strategies dictate:
- When a sync starts.
- What triggers the sync.
- Whether the sync attempts a full replacement or an incremental update.

**Crucially:** Strategies determine synchronization behavior, but Strategies never change Notebook ownership. The canonical data rules remain absolute regardless of the strategy employed.

---

## 3. Execution Strategies

### 3.1 Incremental Synchronization
The default execution strategy for active Workspaces.
- Compares local and remote manifests.
- Uploads or downloads only the delta (the `database.db` and only the specific attachments modified since the last `syncVersion`).
- Minimizes network payload and execution time.

### 3.2 Full Synchronization
Used for initial Workspace setup, disaster recovery, or manual override.
- Bypasses delta checks.
- Forces a complete download or upload of the entire Workspace directory, including all attachments and databases.
- Overwrites the destination entirely (subject to strict validation and user consent).

---

## 4. Trigger Strategies

### 4.1 Manual Synchronization
- **Trigger:** The user explicitly clicks the "Sync Now" button in the UI.
- **Behavior:** Bypasses debounce timers and initiates the sync lifecycle immediately. Useful for users forcing a backup before closing the application or moving to a different device.

### 4.2 Automatic Synchronization
Automatic synchronization operates transparently in the background, ensuring the offline-first experience is preserved without manual intervention.

#### 4.2.1 On-Change (Debounced)
- **Trigger:** The Event Bus emits domain events (e.g., `NoteSavedEvent`, `AttachmentAddedEvent`).
- **Behavior:** The module marks the Workspace as "dirty". A debounce timer (e.g., 30 seconds) begins. If no further changes occur, the sync fires. If a new change occurs, the timer resets. Prevents thrashing the network while the user is actively typing.

#### 4.2.2 Scheduled (Interval)
- **Trigger:** A background timer fires at a configured interval (e.g., every 15 minutes).
- **Behavior:** Ensures that even if no local changes are made, the local client checks for changes made by *other* devices.

#### 4.2.3 Lifecycle (Startup / Shutdown)
- **Trigger:** The application launches and opens a Workspace, or the application begins a graceful shutdown.
- **Behavior:** 
  - **Startup:** Fetches latest remote changes so the user starts with fresh data.
  - **Shutdown:** Attempts a final push of local changes to ensure the remote replica is up to date before the application exits.

---

## 5. Future Provider Synchronization

The strategy architecture guarantees that **synchronization providers remain interchangeable.**

Because strategies control *when* and *how much* to sync, and providers control *how* to talk to the network, they are entirely decoupled.

If a user installs a future "WebDAV Sync Provider" plugin:
- The WebDAV provider implements `ISyncProvider`.
- The Synchronization module applies the exact same Manual, Automatic, and Incremental strategies to it.
- No strategy logic needs to be rewritten to support new providers.

---

## 6. Business Rules

- **Strategies determine synchronization behavior.** They dictate timing and payload size, but never circumvent core architecture boundaries.
- **Strategies never change Notebook ownership.** The local database remains the authoritative source regardless of whether a manual or automatic strategy is used.
- **Synchronization providers remain interchangeable.** Strategies must rely entirely on the `ISyncProvider` interface and never cast to a concrete provider type (e.g., never cast to `GoogleDriveProvider` to access special features).

---

## 7. Acceptance Criteria

- Triggering a `NoteSavedEvent` starts a debounce timer, and the sync only initiates once the timer expires without further events.
- Clicking "Sync Now" immediately executes a Manual sync, even if a debounce timer is currently counting down (which it subsequently cancels).
- An Incremental sync only uploads attachments that have a modification date newer than the last recorded `syncVersion`.
- Strategies can be hot-swapped via user configuration (e.g., changing from Automatic to Manual) without requiring an application restart.

---

## 8. Cross References

- [01-SynchronizationOverview.md](./01-SynchronizationOverview.md)
- [02-SynchronizationLifecycle.md](./02-SynchronizationLifecycle.md)
