# Plugin SDK & Extension System

> **Module:** Plugins
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Plugin SDK & Extension System provides a secure, governed framework for extending the capabilities of the Notebook application without altering its core architecture. It enables third-party developers and advanced users to integrate custom behaviors, formats, and providers.

---

## 2. Scope

**In Scope:**
- Defining the lifecycle of a Plugin (Discovery, Validation, Activation).
- Defining the permissions and capability model.
- Managing the registration and exposure of stable Extension Points.
- Broadcasting plugin-related lifecycle events.

**Out of Scope:**
- Implementation details of a plugin marketplace or package manager.
- Low-level sandboxing technologies (e.g., IPC, V8 Isolates).
- Actual execution of domain logic—the Plugin SDK coordinates the *integration* of plugins, but the Domain handles the *data*.

---

## 3. Ownership and Responsibilities

- **The module owns:** Plugin lifecycle, Plugin validation, Extension point registration, Plugin permissions, and SDK compatibility.
- **The module does NOT own:** Workspace, Notes, Editor, Attachments, OCR, Search, Embeddings, AI Assistant, Synchronization, Backup, Import/Export, Settings, Notifications, or Todos.
- **Plugins extend Notebook capabilities.** They never become owners of Notebook entities.

---

## 4. Dependencies

- **Event Bus:** For notifying the core application about new extension points being registered or plugins failing.
- **Settings Module:** For storing user preferences related to installed plugins (e.g., enabling/disabling a plugin).

---

## 5. Interfaces

### 5.1 Consumed Interfaces
- Module APIs exposing Extension Points (e.g., `ISyncProviderRegistry`).

### 5.2 Published Interfaces
- The `Plugin SDK` API itself, consumed by the actual Plugin Packages.

---

## 6. Business Rules

- **Plugins are optional.** Notebook Core remains fully functional without plugins.
- **Plugins never own Notebook entities.** Notebook Core always remains the canonical owner.
- **Plugins communicate only through approved extension points.** They never bypass module ownership boundaries.
- **Plugin failures never corrupt Notebook data.**
- **Permissions are user controlled.**

---

## 7. Acceptance Criteria

- A user can launch the Notebook application in "Safe Mode" where the Plugin SDK bypasses initialization, proving that the core application functions independently.
- A plugin attempting to write directly to the SQLite database without using the Domain Service Extension Points is structurally blocked or rejected.

---

## 8. Cross References

- [01-PluginOverview.md](./01-PluginOverview.md)
- [03-ExtensionPoints.md](./03-ExtensionPoints.md)
- [04-PermissionsAndSecurity.md](./04-PermissionsAndSecurity.md)
- [07-PluginGovernance.md](./07-PluginGovernance.md)
