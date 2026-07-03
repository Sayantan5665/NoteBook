# 04 — Workspace Storage

> **Document Type:** Module Specification
> **Module:** workspace
> **Status:** Draft
> **Version:** 1.0
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [README.md](./README.md) · [../../02-database/02-StorageLayout.md](../../02-database/02-StorageLayout.md)

---

## 1. Purpose

This document defines the physical directory structure of a Workspace. While the detailed database layout is covered in the Database architectural documents, this specification clarifies ownership boundaries: which module is responsible for which subdirectory, what can be safely deleted, and how caches are handled.

---

## 2. Scope

**This document covers:**
- The standard Workspace directory tree.
- Module ownership of specific files and folders.
- Cache management (deletion and rebuilding).

**This document does NOT cover:**
- Database table schemas (see `docs/02-database/`).
- External application data storage (e.g., global settings).

---

## 3. Directory Structure and Ownership

A standard Notebook Workspace is structured as follows:

```text
My Workspace/
├── manifest.json         # OWNED BY: Workspace Module
├── database.db           # OWNED BY: Workspace Module (schema), All Modules (data)
├── attachments/          # OWNED BY: Attachments Module
│   ├── uuid-1.pdf
│   └── uuid-2.png
├── backups/              # OWNED BY: Backup Module
│   ├── backup-20231001.zip
│   └── pre-migration-v2.zip
├── cache/                # OWNED BY: Various Modules (Volatile)
│   ├── ocr/              # OWNED BY: Attachments (OCR)
│   └── thumbnails/       # OWNED BY: Attachments (Thumbnails)
└── logs/                 # OWNED BY: Workspace Module (Diagnostic)
```

### 3.1 Ownership Details

- **`manifest.json`**: Managed exclusively by the Workspace Module.
- **`database.db`**: The SQLite file is initialized by the Workspace Module, but its contents are read/written by the respective domain modules (Notes, Tags, AI, etc.).
- **`attachments/`**: Managed by the Attachments Module. Files here are the authoritative binaries for attachment records in the database.
- **`backups/`**: Managed by the Backup Module. Contains ZIP archives of the Workspace state.
- **`cache/`**: Managed by various subsystem modules. Contains derivative data that speeds up application performance.
- **`logs/`**: (Optional) Diagnostic logs for the Workspace session.

---

## 4. Cache Management

The `cache/` directory contains data that can be strictly derived from authoritative sources (`database.db` and `attachments/`).

### 4.1 Safe Deletion
The entire `cache/` directory can be safely deleted at any time when the Workspace is closed. Doing so will not result in data loss. 

### 4.2 Cache Rebuilding
If a cache artifact is missing when requested:
- **Thumbnails:** Re-generated on the fly from the source attachment and saved back to `cache/thumbnails/`.
- **OCR:** Re-extracted from the source image. (Note: The text is also stored in the FTS index, so the raw txt file is primarily for re-embedding or diagnostic purposes).

---

## 5. Business Rules

- **Self-Containment:** No Workspace may store data outside its designated directory boundary. This ensures portability and clean deletion.
- **Attachment Supremacy:** Files in `attachments/` must never be modified by the application once written. If a user "updates" an attachment, the system creates a new file and updates the database reference.
- **Disk Space Checks:** The Workspace module should perform a basic disk space check before initiating a backup or a large attachment import.

---

## 6. Acceptance Criteria

- [ ] Deleting the `cache/` directory does not corrupt the Workspace or lose user data.
- [ ] Application functions normally (albeit with temporary performance degradation) while rebuilding deleted caches.
- [ ] Backups are correctly isolated in the `backups/` directory and ignored during Sync operations.
