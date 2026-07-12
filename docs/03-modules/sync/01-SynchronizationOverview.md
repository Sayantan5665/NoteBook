# 01 — Synchronization Overview

> **Module:** Synchronization (Sync)
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The purpose of the Synchronization module is to provide a robust, abstracted, and safe mechanism for coordinating data movement between the local Notebook installation and external storage locations. 

It ensures that a user's Workspace is continuously backed up and available across multiple devices, adhering strictly to the principle that Notebook remains an offline-first, privacy-first application.

---

## 2. Synchronization Philosophy

The architecture and design of this module are driven by a strict philosophy:

1. **Synchronization coordinates data movement.** It brokers the exchange of data payloads between the local machine and a remote target.
2. **Synchronization is infrastructure.** It operates purely as a background utility. It has no domain logic regarding what a Note or a Folder is.
3. **Synchronization never owns Notebook data.** Ownership of all data models resides strictly in the Domain layer.
4. **Notebook entities remain the canonical source of truth.** The local SQLite database and the local filesystem are authoritative. The remote storage is treated as a secondary replica.

---

## 3. Ownership

The Synchronization module has **zero ownership** of Notebook entities (Notes, Attachments, Tags, etc.). 

If a synchronization operation requires integrating a new Note from a remote device, the Synchronization module does not write to the SQLite database. Instead, it delegates the payload to the appropriate Application Service, which applies standard validation and business rules before saving.

---

## 4. Responsibilities

The module is explicitly responsible for:
- Orchestrating the synchronization lifecycle.
- Invoking `ISyncProvider` implementations.
- Comparing local and remote Workspace Manifests to detect divergence.
- Broadcasting sync state changes (Progress, Success, Failure) to the UI.
- Safeguarding against data loss during network interruptions.

It is explicitly **not** responsible for:
- Creating, modifying, or deleting Notes.
- Resolving complex data merges (delegated to application domain logic).
- Direct API communication with cloud providers (delegated to the provider).

---

## 5. Synchronization Concepts

### 5.1 Local Authoritative

In Notebook, the local device is always assumed to be correct. Synchronization is the process of making the remote replica match the local state, or deliberately integrating remote changes into the local state.

### 5.2 Workspace Manifest Philosophy

The Workspace Manifest is strictly synchronization metadata. It assists synchronization by acting as an anchor (containing `syncVersion` and timestamps). It never replaces Notebook content and never becomes the source of truth.

### 5.3 Synchronization Identity Philosophy

The synchronization process is composed of distinct conceptual identities, each with its own responsibility and lifecycle:

- **Synchronization Request:** Initiates synchronization.
- **Synchronization Session:** Coordinates a single synchronization operation.
- **Synchronization Provider:** Performs provider-specific data exchange.
- **Synchronization Strategy:** Determines how synchronization is performed.
- **Synchronization Result:** Records the conceptual outcome of the synchronization process.

### 5.4 Payload Independence

Synchronization treats the SQLite `database.db` and files in the `attachments/` directory as opaque payloads. It ensures these payloads are moved safely, but it does not query the database itself to determine sync state.

---

## 6. Synchronization Providers

The module uses the Dependency Inversion Principle to interact with external storage.

- **`ISyncProvider` Interface:** Defines the contract for all sync targets (e.g., `connect()`, `upload()`, `download()`, `getRemoteManifest()`).
- **Interchangeability:** Providers can be swapped seamlessly. Today it may be Google Drive; tomorrow it may be a local network NAS or a user-defined plugin provider.
- **Provider Isolation:** Providers know nothing about Notebook entities. They only know how to move files (like `database.db` and `manifest.json`) between the local disk and their specific storage medium.

---

## 7. Business Rules

The following rules dictate the behavior of the Synchronization module and **shall not** be violated:

- **Notebook remains offline-first.** Sync is a background enhancement, not a requirement. The application must launch and function instantly without waiting for a sync to complete.
- **Synchronization is optional.** The user can use Notebook indefinitely without ever enabling sync.
- **Synchronization never owns Notebook entities.** It cannot bypass Domain layer validation.
- **Synchronization never replaces canonical Notebook data** without explicit, rule-based validation and/or user consent. It must never silently overwrite local changes.
- **Synchronization providers remain replaceable.** No provider-specific logic (e.g., Google Drive OAuth tokens) may leak into the core Synchronization module.

---

## 8. Acceptance Criteria

- The Synchronization module can execute a full cycle using a mock `ISyncProvider` in a test environment without hitting a real network.
- Disabling the Synchronization module in configuration results in zero network calls being made.
- Attempting to sync while offline results in a graceful failure event, not an application crash.
- Integrating remote changes triggers standard Domain events (e.g., `NoteUpdatedEvent`), proving sync data passes through standard application channels.

---

## 9. Cross References

- [Architecture: 12-SynchronizationArchitecture](../../01-architecture/12-SynchronizationArchitecture.md)
- [Architecture: 15-WorkspaceManifest](../../01-architecture/15-WorkspaceManifest.md)
- [02-SynchronizationLifecycle.md](./02-SynchronizationLifecycle.md)
