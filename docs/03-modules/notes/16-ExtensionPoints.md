> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Workspace Module
> **Document Owner:** Core Architecture Team

# 16 — Extension Points

---

## 1. Purpose

This document outlines the extension points exposed by the Notes module. It defines how external systems, plugins, and future features can safely interact with and extend the capabilities of a Note without violating domain ownership boundaries.

## 2. Scope

**This document covers:**
- Current extension concepts (Templates, Metadata Extensions).
- Future integration points (Custom Properties, AI, Collaboration).
- The philosophy and boundaries of Note extensibility.

**This document does NOT cover:**
- Implementation details of the Plugin SDK.
- Specific APIs for third-party developers.

## 3. Extension Philosophy and Boundaries

- **Ownership Preservation:** Extensions must NOT violate Note ownership boundaries. The Notes module always retains ultimate authority over the Canonical Note payload and identity.
- **Graceful Degradation:** The core Notes module must function perfectly if an extension or plugin is disabled or crashes.
- **Version Compatibility:** Extension points should remain version-compatible whenever possible.
  - Future Plugin SDKs should preserve backward compatibility where practical.
  - Extension contracts (e.g., event schemas, metadata structures) should evolve without breaking existing Notes.
  - Extensions must interact with the Note via strictly versioned Event payloads or SDK wrappers to prevent data corruption during core upgrades.

## 4. Current Extension Points

### 4.1 Templates
- As defined in [12-Templates.md](./12-Templates.md), Templates serve as blueprint extensions to scaffold new Notes.

### 4.2 Metadata Extensions
- The database schema may allow for a JSON `meta` field or sidecar tables where plugins can store custom metadata (e.g., a "Kanban status" flag) linked to a Note's UUID.

## 5. Future Extension Points

### 5.1 Custom Properties (Frontmatter)
- User-defined key-value pairs (similar to YAML frontmatter) allowing users to extend Note metadata dynamically for personal workflows.

### 5.2 Plugin Hooks and Custom Commands
- Plugins registering custom actions that operate on a Note's payload (e.g., a "Format Table" command) by hooking into the Editor module, reading the Note, and submitting an updated payload back to the Notes module.

### 5.3 Future AI Integrations
- Advanced AI agents acting as extensions that read the Note payload to provide summaries, generate tags, or auto-complete text, operating strictly as consumers of the Canonical Note.

### 5.4 Future Collaboration (CRDTs)
- Real-time collaborative editing relies on extending the payload structure to support CRDTs (Conflict-free Replicated Data Types) while maintaining the core UUID identity.

### 5.5 Future Encryption
- Zero-knowledge encryption extensions that encrypt the text payload before it reaches the persistence layer, keeping the core metadata intact for organization.

### 5.6 Future Publishing
- Web publishing pipelines that treat the Canonical Note as a CMS backend, generating temporary slugs and HTML artifacts.

## 6. Business Rules

- **Safe Mutation:** Plugins modifying Note content must pass through the standard validation and editing session workflows; they cannot bypass the Notes module and write directly to the database.

## 7. Acceptance Criteria

- The Notes module architecture allows a hypothetical plugin to attach custom metadata to a Note UUID without modifying the core Note database schema.
- Disabling an extension does not corrupt or hide the underlying Canonical Note data.
