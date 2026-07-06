> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 12 — Templates

---

## 1. Purpose

This document defines the concept of Templates within the Notes module. Templates provide reusable blueprints for common Note structures, ensuring consistency and saving time when scaffolding new Notes.

## 2. Scope

**This document covers:**
- The Template lifecycle and usage workflows.
- Ownership and operational boundaries between Templates and Notes.

**This document does NOT cover:**
- UI components for selecting templates.
- Markdown or rich-text parsing logic for variables inside templates.

## 3. Ownership and Responsibilities

- **Ownership:** The Notes module owns the structural definition of what a Note is, but Templates act as an extension point. Depending on system architecture, Templates may be stored in a dedicated repository or flagged as special Notes.
- **Responsibilities:** Provide a baseline payload and metadata schema to instantiate a new Note.

## 4. Conceptual Workflows

### 4.1 Use Template (Instantiation)
When a user creates a new Note from a Template:
- The system copies the content payload and applicable metadata from the Template into a brand new `Draft` Note.
- **Critical Boundary:** The new Note receives its own completely unique `UUID`.
- The new Note operates completely independently from the Template.

### 4.2 Lifecycle Operations
- **Create Template:** Saving a specific content structure as a reusable blueprint.
- **Update Template:** Modifying the blueprint payload. (Does NOT retroactively update Notes previously created from this template).
- **Delete Template:** Removes the blueprint. (Does NOT delete Notes previously created from this template).
- **Duplicate Template:** Clones an existing blueprint to modify into a new one.

### 4.3 Default Templates (Future)
- **Concept:** Workspaces may define default templates for common workflows.
- **Examples:** Blank Note, Meeting Notes, Daily Journal, Research Note, Project Notes.
- **Rules:** 
  - These are future extension points.
  - Users may customize or replace these default templates.
  - Just like user-created templates, Notes created from defaults remain completely independent after creation.

### 4.4 Template Categories (Future)
- Organizing templates for easier discovery.

## 5. Business Rules

- **Templates are starting points:** Templates are merely starting points for new Notes.
- **No Reverse Inheritance:** Creating a Note from a Template creates a normal, independent Note. Editing the instantiated Note NEVER modifies its originating Template. 
- **Templates are NEVER authoritative:** Once the Note is created, the Template has no authoritative control over the Note's lifecycle, content, or identity.

## 6. Error Handling and Edge Cases

- **Missing Template:** If a user attempts to create a Note using a Template ID that has been deleted, the system should gracefully fall back to creating a blank Note and alert the user.

## 7. Acceptance Criteria

- Creating a Note from a Template successfully copies the content payload into a new Note with a distinct UUID.
- Editing the new Note does not mutate the source Template.
- Deleting the source Template does not affect the instantiated Note.
