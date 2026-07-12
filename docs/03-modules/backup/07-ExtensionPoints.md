# 07 — Extension Points

> **Module:** Backup & Restore
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Extension Points document defines how the Backup & Restore module can be expanded using third-party plugins or future native additions, ensuring the core logic remains independent of specific technologies.

---

## 2. Extension Philosophy

- **Extensions enhance backup capabilities.** They provide specialized algorithms (like custom encryption) or specialized transport (like S3 uploads).
- **Extensions never own Notebook entities.** They operate entirely on the derived Backup Artifacts (e.g., a `.zip` byte stream).
- **Decoupled execution.** The Backup module orchestrates the workflow; extensions execute specific tasks within that workflow.

---

## 3. Current Extension Points

In V1, the backup module supports physical storage routing:

- **Local Storage Provider:** The default implementation that saves artifacts to the local `backups/` directory.

---

## 4. Future Extension Points

The architecture is designed to support the following plugins:

### 4.1 Compression Providers
Allows the payload to be compressed using different algorithms to save space.
- *Examples:* ZIP, Tar.gz, Zstandard.

### 4.2 Encryption Providers
Allows the artifact to be encrypted at rest before it is saved to disk or uploaded.
- *Examples:* AES-256-GCM, PGP/GPG plugins.

### 4.3 Custom Backup Providers
Allows artifacts to be routed directly to off-site locations.
- *Examples:* Cloud storage providers (Google Drive, AWS S3), Enterprise backup providers (WebDAV, internal NAS).

---

## 5. Business Rules

- **Extensions enhance backup capabilities.**
- **Extensions never own Notebook entities.** They process opaque payloads.
- **Restore operations must support symmetrical extensions.** If a backup was encrypted via an extension, the restore process must invoke the corresponding decryption extension.

---

## 6. Acceptance Criteria

- An extension implementing `ICompressionProvider` can be injected into the Backup module, successfully compressing the artifact without modifying the core lifecycle code.
- Extensions receive only the paths or streams of the artifact and never receive live SQLite database connection objects.

---

## 7. Cross References

- [01-BackupOverview.md](./01-BackupOverview.md)
- [Architecture: 10-PluginArchitecture](../../01-architecture/10-PluginArchitecture.md)
