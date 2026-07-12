# 07 — Plugin Governance

> **Module:** Plugins
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Plugin Governance document establishes the strict ownership boundaries that protect the Notebook application from being compromised or destabilized by third-party extensions.

---

## 2. Ownership Boundaries

### 2.1 Plugin SDK Owns:
- **Plugin lifecycle:** State machine from discovery to removal.
- **Plugin validation:** Ensuring manifests and versions match.
- **Extension point registration:** Managing the registry of available hooks.
- **Plugin permissions:** Enforcing the security model.
- **SDK compatibility:** Managing versioning.

### 2.2 Plugin SDK Does NOT Own:
- Workspace, Notes, Editor, Attachments, OCR, Search, Embeddings, AI Assistant, Synchronization, Backup, Import / Export, Settings, Notifications, Todos.

---

## 3. Consistency Rules

- **Plugins extend Notebook.** They add features via public contracts.
- **They never replace Notebook modules.** A plugin cannot "become" the Domain layer.
- **Notebook modules remain authoritative.** The Domain dictates what a Note is, not the plugin.

---

## 4. Dependency Rules

- Core modules **must never** depend on a specific Plugin.
- Core modules expose Extension Points. The Plugin SDK registers Plugins against those points. The interaction is completely decoupled via Inversion of Control.

---

## 5. Business Rules

- **Plugins are optional.**
- **Notebook Core remains fully functional without plugins.**
- **Plugins never own Notebook entities.**
- **Plugins communicate only through approved extension points.**
- **Plugin failures remain isolated to the affected plugin.** Notebook Core continues operating normally. Plugin failures never corrupt Notebook entities.
- **Permissions are user controlled.**
- **Extension points remain stable public contracts.**

---

## 6. Acceptance Criteria

- Code reviews confirm that no core module (like `NoteService`) contains logic checking for the existence of `SpecificPluginX`. The core module only loops through registered `IProviders`.

---

## 7. Future Enhancements

- **Plugin discovery, Plugin catalog, Plugin distribution:** Future capabilities may extend the plugin ecosystem to support centralized discovery and distribution. These are ecosystem extensions and are not responsibilities of the Plugin SDK itself.

---

## 8. Cross References

- [01-PluginOverview.md](./01-PluginOverview.md)
- [04-PermissionsAndSecurity.md](./04-PermissionsAndSecurity.md)
