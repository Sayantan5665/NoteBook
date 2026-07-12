# Synchronization Module

> **Module:** Synchronization (Sync)
> **Status:** Approved
> **Applies To:** Notebook Application (Workspace-Level)

---

## 1. Purpose

The Synchronization module is responsible for coordinating the exchange of Notebook data between the local authoritative storage and one or more remote storage locations (e.g., Google Drive, local network folders, or user-defined targets). 

It provides the infrastructure to keep a Workspace backed up and synchronized across multiple devices without tying the application to any single cloud provider or network topology.

---

## 2. Scope

**In Scope:**
- Orchestration of data synchronization workflows.
- Detection of local and remote changes via the Workspace Manifest.
- Preparation and validation of data payloads prior to exchange.
- Coordination with pluggable synchronization providers.
- Tracking of sync state, timestamps, and device synchronization versions.
- Graceful handling of network failures, cancellations, and interruptions.

**Out of Scope:**
- Ownership or storage of Notebook domain entities.
- Direct manipulation of SQLite databases or file system files (handled by repositories).
- Specific provider implementations (e.g., Google Drive REST API details).
- Resolution of content-level merge conflicts (handled by conflict resolution subsystem - future).

---

## 3. Ownership

The Synchronization module **does NOT own any Notebook entities**. 

- Notes, Folders, Attachments, Tags, Todos, and AI Chats are owned by their respective modules.
- The local SQLite database and local filesystem are the canonical sources of truth.
- Synchronization never becomes the source of truth; it acts solely as a broker to move data between the canonical local store and external replicas.

---

## 4. Responsibilities

- **Detect:** Identify when local or remote changes have occurred by inspecting the Workspace Manifest.
- **Prepare:** Coordinate with application services to gather the necessary data payloads for export.
- **Validate:** Ensure data integrity before sending to or integrating from a remote provider.
- **Coordinate:** Delegate actual data transmission to the active `ISyncProvider`.
- **Record:** Update the Workspace Manifest with new sync versions and timestamps upon successful completion.

---

## 5. Dependencies

The Synchronization module depends on:

- **Workspace Module:** For identifying the active Workspace and accessing the Workspace Manifest.
- **Configuration Module:** For determining sync preferences (manual vs. automatic, selected provider).
- **Event Bus:** For publishing sync status events to the UI and listening to network state changes.
- **Domain Repositories:** For reading and writing data (via Application Services) when integrating changes.

---

## 6. Interfaces

### 6.1 Consumed Interfaces

- `IWorkspaceSession`: To get the current Workspace context.
- `IWorkspaceManifestManager`: To read/write sync versions and timestamps.
- `INetworkMonitor`: To detect online/offline status.

### 6.2 Extension Points

- `ISyncProvider`: The core extension point. Any class implementing this interface can act as a synchronization target. The module coordinates with this interface without knowing if the provider is cloud-based, local-network, or a third-party plugin.

---

## 7. Events

### 7.1 Published Events

| Event | Trigger | Payload |
|---|---|---|
| `SyncStartedEvent` | A sync operation begins | `workspaceId`, `strategy` |
| `SyncProgressEvent` | The provider reports progress | `workspaceId`, `percentage`, `statusText` |
| `SyncCompletedEvent` | A sync operation finishes successfully | `workspaceId`, `durationMs`, `bytesTransferred` |
| `SyncFailedEvent` | A sync operation fails | `workspaceId`, `errorType`, `message` |
| `SyncCancelledEvent` | The user aborts a running sync | `workspaceId` |

### 7.2 Consumed Events

| Event | Response |
|---|---|
| `WorkspaceOpenedEvent` | Initialize sync state for the Workspace; trigger auto-sync if configured. |
| `NetworkStatusChangedEvent` | Pause or resume background sync queues based on connectivity. |
| `NoteSavedEvent` | Flag the Workspace as dirty to trigger debounce-based automatic sync. |

---

## 8. Settings

The module consumes the following Workspace-level configurations:

- `syncEnabled` (boolean): Whether sync is active for the Workspace.
- `syncProviderId` (string): The registered ID of the active `ISyncProvider`.
- `syncStrategy` (enum): Manual, On-Change, or Scheduled.

---

## 9. Acceptance Criteria

- Synchronization can be completely disabled for a Workspace without affecting local functionality.
- The module never modifies local data without explicit coordination through Application Services.
- The module gracefully aborts if the network is disconnected, emitting a `SyncFailedEvent` without corrupting local state.
- Synchronization providers can be swapped (e.g., from Google Drive to Local Folder) without changing the core Synchronization module logic.

---

## 10. Cross References

- [01-SynchronizationOverview.md](./01-SynchronizationOverview.md)
- [02-SynchronizationLifecycle.md](./02-SynchronizationLifecycle.md)
- [03-SynchronizationStrategies.md](./03-SynchronizationStrategies.md)
- [Architecture: 12-SynchronizationArchitecture](../../01-architecture/12-SynchronizationArchitecture.md)
- [Architecture: 15-WorkspaceManifest](../../01-architecture/15-WorkspaceManifest.md)
