# 08 — Extension Points

> **Module:** Synchronization (Sync)
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Extension Points document defines how the Synchronization module can be safely enhanced and extended. By establishing clear extension boundaries, Notebook ensures that the core sync engine remains stable while accommodating a diverse ecosystem of storage, security, and networking capabilities.

---

## 2. Extension Philosophy

- **Extensions enhance synchronization capabilities.** They provide the "how" (how to connect, how to encrypt, how to transfer) while the core engine dictates the "when" and "what".
- **Extensions never own Notebook entities.** An extension receives opaque payloads or buffers; it never accesses Domain entities like Notes or Folders directly.
- **Synchronization remains provider-independent.** The core module treats all extensions through standard interfaces.
- **Maintain backward compatibility.** Extension points are strictly versioned.

---

## 3. Current Extension Points

The V1 architecture provides the foundational extension point for synchronization transport.

### 3.1 Custom Storage Providers (`ISyncProvider`)
The core interface that allows any storage medium to act as a synchronization target.

**Examples:**
- **Cloud synchronization providers:** Google Drive, OneDrive, Dropbox.
- **Local synchronization providers:** USB drives, local network folders.
- **Enterprise synchronization providers:** WebDAV, S3-compatible object storage.
- **Custom storage providers:** Third-party plugins written by the community.

---

## 4. Future Extension Points

The architecture anticipates the need for further customization. These extension points are planned for future phases.

### 4.1 Encryption Providers
An extension point allowing data to be encrypted *before* it is handed to the `ISyncProvider`. 
- **Example:** A provider that encrypts the SQLite database using AES-GCM with a user-provided passphrase before it uploads to Google Drive.

### 4.2 Compression Providers
An extension point for reducing payload size over metered networks.
- **Example:** A provider that uses Zstandard (zstd) to compress the database and attachments prior to upload.

### 4.3 Conflict Resolution Providers
An extension point allowing advanced, domain-aware merge strategies.
- **Example:** An extension that implements CRDT (Conflict-free Replicated Data Type) merging at the SQLite row level, enabling automatic resolution instead of manual user prompts.

---

## 5. Integration Opportunities

Plugins integrate with the Synchronization module exclusively through these published extension interfaces. A third-party plugin cannot directly modify the sync orchestration logic. It registers its provider implementation with the Application, which the Synchronization module then invokes when that provider is selected by the user.

---

## 6. Business Rules

- **Extensions enhance synchronization capabilities** but never alter the fundamental lifecycle or business rules of the application.
- **Extensions never own Notebook entities.** They operate purely on byte streams, files, or generalized data structures.
- **Synchronization remains provider-independent.** The core module orchestrates the workflow blindly via the interface contract.
- **Maintain backward compatibility.** Changes to the `ISyncProvider` interface must be handled via versioning to prevent breaking existing third-party plugins.

---

## 7. Acceptance Criteria

- A developer can write a custom `ISyncProvider` for an internal corporate SFTP server and register it with the application without modifying any core Notebook code.
- The Synchronization module successfully executes a full sync lifecycle against a custom provider plugin just as it would against the native Google Drive provider.
- Extension point capabilities never grant a plugin direct access to the SQLite connection instance.

---

## 8. Cross References

- [05-SynchronizationProviders.md](./05-SynchronizationProviders.md)
- [Architecture: 10-PluginArchitecture](../../01-architecture/10-PluginArchitecture.md)
