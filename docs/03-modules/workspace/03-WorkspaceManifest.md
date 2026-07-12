# 03 — Workspace Manifest

> **Document Type:** Module Specification
> **Module:** workspace
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

This document details the structure, purpose, and lifecycle of the `manifest.json` file. The manifest is the authoritative identity document for a Workspace. It defines what a directory is, providing the application with essential metadata before any database connection is attempted.

---

## 2. Scope

**This document covers:**
- The JSON schema of `manifest.json`.
- The semantic meaning of each field.
- Validation rules and version compatibility checks.
- Upgrade strategies for the manifest format.

**This document does NOT cover:**
- Database schema versioning (stored in the database).
- File storage layout (see `04-WorkspaceStorage.md`).

---

## 3. The Role of the Manifest

Per [ADR-010-WorkspaceManifest.md](../../01-architecture/ADR-010-WorkspaceManifest.md), `manifest.json` exists to decouple Workspace identity and versioning from SQLite. 
- It allows the application to quickly read Workspace metadata (e.g., to populate the launch screen) without the overhead of opening multiple SQLite databases.
- It acts as a safety gate, preventing the application from opening databases built with newer, incompatible schemas.
- It provides a stable identity (`id`) that survives directory renames and synchronization.

---

## 4. Manifest Fields

The `manifest.json` must adhere to the following structure:

```json
{
  "id": "uuid-v4-string",
  "name": "User Defined Name",
  "formatVersion": 1,
  "schemaVersion": 1,
  "createdAt": "2023-10-01T12:00:00Z",
  "syncConfig": {
    "provider": "google-drive",
    "lastSyncAt": "2023-10-02T15:30:00Z",
    "remoteId": "google-drive-folder-id"
  }
}
```

### 4.1 Field Definitions

| Field | Type | Description | Mutable |
|---|---|---|---|
| `id` | String (UUIDv4) | The immutable, globally unique identifier for this Workspace. | No |
| `name` | String | The user-facing display name of the Workspace. | Yes |
| `formatVersion` | Integer | The structural version of this JSON file itself. | Yes (via App upgrade) |
| `schemaVersion` | Integer | The Prisma schema version applied to the `database.db`. | Yes (via Migration) |
| `createdAt` | ISO 8601 String | The UTC timestamp of Workspace creation. | No |
| `syncConfig` | Object (Optional) | Metadata for the sync module. Maintained exclusively by the sync module. | Yes |

---

## 5. Versioning and Compatibility

The manifest handles two dimensions of versioning:

### 5.1 `formatVersion`
This tracks changes to the `manifest.json` schema itself. 
- The application ships with a `SUPPORTED_MANIFEST_FORMAT` constant.
- If a manifest has a `formatVersion` < `SUPPORTED_MANIFEST_FORMAT`, the Workspace module transparently upgrades the JSON structure upon open.
- If a manifest has a `formatVersion` > `SUPPORTED_MANIFEST_FORMAT`, the application refuses to open the Workspace and prompts the user to update their Notebook application.

### 5.2 `schemaVersion`
This tracks the state of the SQLite database.
- It mirrors the highest applied migration in the database.
- It allows the application to know *before connecting* if a database migration is required.
- If `schemaVersion` > Application's bundled schema, the application refuses to open the Workspace (to prevent a downgrade from corrupting data).

---

## 6. Business Rules

- **Existence:** A directory without a valid `manifest.json` is not recognized as a Workspace.
- **Write Atomicity:** Updates to `manifest.json` (like renaming) must be written atomically to avoid corruption (e.g., write to `manifest.tmp.json` then rename).
- **Extensibility:** Modules (like Sync) may request the Workspace module to store module-specific configurations in the manifest, but the schema must be predefined in the Application Layer.

---

## 7. Acceptance Criteria

- [ ] Reading a manifest with an unsupported higher `formatVersion` or `schemaVersion` surfaces an explicit compatibility error.
- [ ] Renaming the Workspace updates the `name` field without altering the `id`.
- [ ] The manifest parses successfully even if optional fields (like `syncConfig`) are omitted.
