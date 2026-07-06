> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 15 — Import and Export Behaviour

---

## 1. Purpose

This document defines the conceptual behavior of moving Note data into and out of the Notebook application. It focuses on ownership, identity transition, and boundaries during Import and Export operations.

## 2. Scope

**This document covers:**
- Conceptual behaviors for Import, Export, Bulk Import, and Bulk Export.
- Identity assignment for imported data.
- The derived nature of exported data.

**This document does NOT cover:**
- Specific file format definitions (e.g., Evernote ENEX, Markdown, PDF). Format specifications belong to the Import/Export module.
- Network-level sync protocols.

## 3. Import Behaviour

### 3.1 Single and Bulk Import
- The system supports ingesting single files or bulk directories/archives.
- The Import module maps external data into the Notebook semantic content model and calls the Notes module to instantiate new records.

### 3.2 Import Validation and Recovery
- All imported payloads MUST pass schema validation before being committed.
- **Recovery Interaction:** If a Bulk Import fails halfway (e.g., due to corruption in the source file), the system should cleanly log the failures and commit the successful Notes, rather than crashing or rolling back the entire batch, prioritizing user data preservation.

### 3.3 Imported Note Identity and Ownership
- **Rule:** Imported Notes become native Notebook Notes.
- Upon successful ingestion, the Note sheds its external identity (e.g., an external GUID or file path) and is assigned a brand new, permanent Notebook UUID.
- Once imported, the Notes module assumes complete ownership of the Canonical Note.

### 3.4 Import Provenance
- The system may store provenance metadata during import to support auditing and troubleshooting.
- **Examples:** Original Source, Import Timestamp, Import Method, Original File Name (when applicable).
- **Rule:** Provenance metadata is supplementary; it does NOT affect or define the Note's permanent Notebook identity.

## 4. Export Behaviour

### 4.1 Single and Bulk Export
- The system supports exporting a single Note or a bulk directory of Notes into external formats (e.g., Markdown, PDF, HTML).

### 4.2 Export Philosophy
- **Rule:** Exports are point-in-time snapshots of the canonical Note.
- **Rule:** Exported files are strictly derived artifacts and independent copies.
- **Rule:** Exports NEVER become authoritative copies. The Canonical Note residing in the database remains the single source of truth.
- Modifying exported files on the filesystem does not modify the original Note in the database.
- Changes made to exported files only become Notebook content through a future, explicit import process.
- Once an export file is generated on the user's filesystem, Notebook relinquishes all ownership of that file. Edits made to an exported Markdown file on the desktop are not automatically tracked or synced back to Notebook (unless re-imported).

## 5. Business Rules

- **Identity Isolation:** The Notes module does not permanently store external file paths or external system IDs as primary identifiers.
- **Derived Exports:** Exporting a Note does not mutate the Canonical Note's state or metadata.

## 6. Error Handling

- **Malformed Source Data:** During import, if specific formatting in an external file cannot be parsed, the system should degrade gracefully (e.g., importing it as plain text) rather than discarding the content entirely.

## 7. Acceptance Criteria

- Importing a directory of Markdown files results in native Note records with valid Notebook UUIDs.
- Exporting a Note creates a file on disk that does not affect the persistence state of the Canonical Note.
