> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Tags Module Overview
> **Document Owner:** Core Architecture Team

# 01 — Tag Overview

---

## 1. Purpose

This document defines the core concept of a Tag within the Notebook architecture, clarifying its identity, ownership, and basic properties.

## 2. Concept

A Tag is a user-defined label (e.g., `#meeting`, `#urgent`) applied to Notes. Tags provide a non-hierarchical, multidimensional classification system, allowing a single Note to belong to many conceptual groups simultaneously.

## 3. Ownership

- The **Tags module** owns the Tag entity, its UUID, its textual name, and its lifecycle.
- The **Notes module** (and Editor) owns the text payload that references the Tag.
- **Rule:** Tags are independent entities. Notes reference Tags. Tags NEVER own Notes.

## 4. Tag Identity Philosophy

It is critical to distinguish between the identity, the presentation, and the relationship:
- **Tag Identity:** Every Tag has an immutable Tag UUID. This is the true, permanent identity of the Tag across the system.
- **Tag Display Name:** The user-visible text (e.g., "meeting") is merely a mutable presentation property attached to the UUID.
- **Tag Relationship:** Notes reference Tags using the immutable Tag UUID.

**Implications:**
- Renaming a Tag NEVER changes the Tag identity.
- Renaming a Tag NEVER breaks existing Note relationships, because the Note payload references the UUID, not the display name.

## 5. Future Capabilities (Reference)

- **Tag Categories:** Grouping Tags logically (e.g., "Status Tags" vs "Project Tags").
- **Tag Colors:** Assigning visual colors to specific Tags for quick UI scanning.

## 6. Business Rules

### 6.1 Orphan Tags
- **Definition:** Tags assigned to no Notes. This includes newly created unused Tags, or Tags remaining after a Note deletion.
- **Validity:** Orphan Tags are completely valid entities.
- **Availability:** They remain available for future assignment.
- **Capabilities:** They participate in Search, Synchronization, Import/Export, and Backup like any other Tag.

### 6.2 General Rules
- **Independence:** A Tag can exist in the system even if zero Notes currently reference it.
- **No Hierarchical Ownership:** A Tag does not "contain" Notes the way a Folder does. Deleting a Folder deletes its Notes. Deleting a Tag merely removes a label from its Notes.

## 7. Acceptance Criteria

- Creating a new tag string in the Editor requests a Tag UUID from the Tags module.
- Two notes referencing `#project-x` map to the exact same Tag UUID in the database.
