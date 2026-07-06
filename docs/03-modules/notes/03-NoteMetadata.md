> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 03 — Note Metadata

---

## 1. Purpose

This document defines the metadata structure associated with a Note. It categorizes the attributes that describe the Note, govern its state, and connect it to the broader Workspace, cleanly separating these attributes from the Note's actual text content.

## 2. Scope

**This document covers:**
- Definition of specific metadata fields.
- Categorization of metadata (Immutable, Mutable, Derived, System, User-controlled).

**This document does NOT cover:**
- Schema definitions for the database (see `02-database/`).
- Indexing strategies for search.

## 3. Metadata Categories

Metadata is classified into distinct categories based on who controls it and how it behaves over the Note's lifecycle.

### 3.1 Immutable Metadata
Values generated once at creation and strictly read-only thereafter.
- **UUID:** The globally unique, permanent identifier for the Note.
- **Workspace ID:** The ID of the container workspace. (A Note cannot jump between Workspaces).
- **Created Date (`createdAt`):** The exact system timestamp of creation.

### 3.2 System Metadata (Mutable)
Values managed by the system as side-effects of operations.
- **Updated Date (`updatedAt`):** Modified automatically upon any content or user-metadata change.
- **Created By / Modified By (Local Profile):** References to the local user profile that authored or edited the Note (critical for future sync or audit trails).
- **Source / Template Origin:** Identifies if the Note was generated from a specific template or imported from an external source tool.
- **Deleted Flag (`deletedAt`):** Managed by the Trash/Restore lifecycle operations.

### 3.3 User-Controlled Metadata (Mutable)
Attributes directly manipulated by the user to organize or prioritize the Note.
- **Title:** The display name of the Note. (Distinct from content).
- **Folder ID:** The UUID of the parent Folder.
- **Pinned:** A boolean flag indicating the Note should be pinned to the top of views.
- **Favorite:** A boolean flag for user-curated shortcuts.
- **Archived:** A boolean flag hiding the Note from active workflows.

### 3.4 Derived Metadata
Attributes calculated dynamically from the Content payload. These may be cached for performance but are explicitly NOT considered authoritative sources of truth. They do not define the Note identity.
- **Reading Time:** Estimated minutes based on Word Count.
- **Estimated Reading Time:** Formatted string (e.g., "5 min read").
- **Word Count:** The total number of words in the text payload.
- **Character Count:** The total character length of the text payload.
- **Heading Count:** Number of structural headings.
- **Attachment Count (future):** Number of embedded binary files.
- **Outgoing Wiki Link Count (future):** Number of links pointing to other Notes.
- **Incoming Backlink Count (future):** Number of links pointing to this Note.

## 4. Business Rules

- **Metadata does not define identity:** A Note can have its Title, Folder, and Pinned status changed simultaneously without losing its core identity (UUID).
- **Derived recalculation:** Derived metadata MUST be recalculated or invalidated whenever the Note Content is successfully saved.
- **Separation:** Metadata is explicitly excluded from the main document Content payload to allow lightweight querying (e.g., fetching a list of titles and dates without loading megabytes of rich text).

## 5. Acceptance Criteria

- A query can retrieve a list of Notes containing only their Metadata (Title, Folder, Dates) without loading the Content payload.
- Updating a Note's Content automatically updates the `updatedAt` system metadata.
- A user can toggle `Pinned` or `Favorite` statuses without triggering a Content-level conflict.
