> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Todos Module
> **Document Owner:** Core Architecture Team

# 08 — Extension Points

---

## 1. Purpose

This document outlines the extensibility surfaces of the Todos module. It establishes how internal integrations, plugins, and future capabilities can enhance task management without violating the core architectural rules or ownership boundaries of the Notebook.

## 2. Extension Philosophy

- **Enhance, Don't Replace:** Extensions augment Todo capabilities (e.g., adding reminders) but do not replace the fundamental entity schema or lifecycle.
- **Ownership Remains Static:** No extension, plugin, or external provider can assume ownership of the Todo dataset.
- **Backward Compatibility:** All extensions are strictly additive. If an extension is disabled, the core Todos module must continue to function perfectly.

## 3. Current & Future Extension Points

### 3.1 Reminder Providers (Future)
- **Concept:** Modules that consume Todo due dates and trigger local or push notifications.
- **Integration:** The provider subscribes to `TodoCreated` and `TodoUpdated` events to schedule notifications. It does not own the Todo.

### 3.2 Calendar Integration (Future)
- **Concept:** Exposing Todo due dates to external calendar applications (e.g., via a generated local CalDAV feed or iCal subscription).
- **Integration:** A read-only projection of the Todo dataset mapped to standard calendar schemas.

### 3.3 External Task Providers (Future)
- **Concept:** Syncing Todos with external platforms (e.g., GitHub Issues, Jira, Todoist).
- **Integration:** Plugins map external data into the local Notebook Todo schema. The local Todo remains the canonical representation within the Workspace.

### 3.4 AI-Assisted Task Management
- **Concept:** Permitting the AI Assistant to suggest new tasks (e.g., "Extract action items from this meeting note").
- **Integration:** The AI module generates a suggested task payload. The user must explicitly approve the creation. The AI does not bypass the Todos creation validation or assume ownership.

### 3.5 Automation Rules (Future)
- **Concept:** Simple 'If This Then That' workflows (e.g., "If Note moved to 'Archive' folder, mark linked Todos as Complete").
- **Integration:** Driven by the event bus. Rules consume events and emit commands subject to standard validation.

### 3.6 Custom Metadata & Views (Future)
- **Concept:** Allowing users to define custom fields (e.g., "Estimated Hours") or custom Kanban board configurations.
- **Integration:** Stored in an extensible JSON payload within the Todo schema, accessed via derived Custom Views.

## 4. Business Rules

- **Extensions Consume Capabilities:** Extensions consume Todo data and events; they NEVER bypass the module's validation layer.
- **Zero Ownership Transfer:** Using an external task provider extension does not transfer ownership of the Todo away from the Notebook Workspace.
- **Additive Only:** Removing an extension (like a Calendar Sync plugin) must leave the local Todos fully intact and operational.

## 5. Acceptance Criteria

- A Calendar Integration plugin successfully projects Todos with due dates onto a local calendar view without modifying the original Todo entities.
- The AI Assistant analyzes a Note and suggests a Todo. The Todo is only created after the user clicks "Approve", passing through standard module validation.
- An automation rule successfully marks a Todo as complete in response to an event, firing a `TodoCompleted` event just as if a human user had clicked the checkbox.
