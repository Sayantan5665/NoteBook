> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 04 — Note Identity

---

## 1. Purpose

This document strictly defines what constitutes the identity of a Note within the system. It clarifies the distinction between a Note's permanent technical identifier, its mutable business identifiers, and its physical path location.

## 2. Scope

**This document covers:**
- Technical Identity (UUID).
- Business Identity (Title).
- Relational Locators (Workspace, Folder, Path).
- Import behavior regarding identity.

## 3. Core Identity Concepts

### 3.1 Technical Identity (The UUID)
The ultimate, unchanging identity of a Note is its `UUID` (Universally Unique Identifier). 
- **Rule:** A Note's UUID NEVER changes for the entire lifespan of the Note.
- **Purpose:** All internal system relationships (Attachments mapping to a Note, Wiki Links pointing to a Note, Tags applied to a Note) must rely EXCLUSIVELY on this UUID.

### 3.2 Business Identity
The "Business Identity" is how the user recognizes the Note, primarily through its `Title`.
- **Rule:** The Title MAY change at any time.
- **Rule:** The Title is NOT unique. Multiple notes with the exact same Title can exist (even within the same Folder, depending on UI strictness).
- **Purpose:** Human readability.

### 3.3 Relational Locators (Folder and Path)
A Note is organized via a `folderId`, which dynamically generates a physical or virtual `Path` (e.g., `Work/Projects/Q3.md`).
- **Rule:** The Folder MAY change (Moving the Note).
- **Rule:** The Path MAY change (Moving the Note or renaming a parent Folder).
- **Purpose:** Organization and export structuring. Paths must never be used as a primary key or permanent identifier for a Note inside the database.

### 3.4 Note Slug Philosophy
Unlike traditional web-based CMS systems, Notebook Notes do **NOT** require or rely on slugs (e.g., `my-awesome-note-title`).
- **Rule:** UUID is the only permanent identity.
- **Rule:** Titles may change freely without needing to maintain or update a URL-friendly slug.
- **Rule:** Slugs are NEVER used internally as Note identifiers.
- **Future Context:** Future web exports or HTML publishing features may generate temporary slugs for routing purposes, but these are transient export artifacts, not internal data models.

*Example: If a note is titled "Meeting Notes 2026", a slug-based system would create `meeting-notes-2026`. If the user renames the note to "Q1 Planning 2026", the slug must either change (breaking existing links) or stay the same (becoming confusing). By relying exclusively on UUIDs, Notebook avoids this brittleness entirely.*

## 4. Identity During System Operations

- **Editing:** Content may change completely; the Identity never changes.
- **Renaming:** Metadata (Title) may change; the Identity never changes.
- **Moving:** Relationships (Folder) may change; the Identity never changes.
- **Synchronization:** Sync engines resolve conflicts and match records based on the UUID, rather than attempting to match by Title or Path. This allows a Note to be renamed on Device A and moved on Device B without causing a duplication.

## 5. Import and External Identities

When a Note is imported from an external system (e.g., Evernote, Notion, or raw Markdown files):
- The external system's identity (e.g., an Evernote GUID or a file path) is strictly temporary.
- **Rule:** Imported Notes receive brand new, native Notebook UUID identities upon successful ingestion into the system.
- The external ID may be stored in a temporary metadata mapping table during the import phase to resolve cross-links, but the Note itself becomes a first-class Notebook entity governed exclusively by its new UUID.

## 6. Stable References

Stable identity is critical for a decoupled, local-first application. By enforcing that the UUID is the single source of identity, the Notes module guarantees stable references across all subsystems.

Documenting that immutable UUIDs ensure:
- **Wiki Links** remain perfectly valid even if the target Note is renamed or moved.
- **Attachments** remain strongly associated regardless of where the Note is moved within the Folder hierarchy.
- **Search Indexes** continue referencing the exact same Note, merely updating the indexed text payload.
- **AI Embeddings** continue referencing the same Note without needing vector re-mapping.
- **Synchronization** identifies the exact same Note across devices, preventing duplication during conflict resolution.
- **Future Extensions** (via the Plugin SDK) can safely store references to Notes in their own local storage without fear of broken links.

## 7. Acceptance Criteria

- Renaming a Note's title does not break any existing Wiki Links pointing to it.
- Moving a Note to a different Folder does not break any existing Wiki Links pointing to it.
- Sync operations rely entirely on the UUID to determine if an incoming Note is an update to an existing record or a new creation.
