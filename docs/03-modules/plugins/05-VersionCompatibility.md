# 05 — Version Compatibility

> **Module:** Plugins
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Version Compatibility document establishes the rules governing how the Plugin SDK and individual Plugins evolve over time without breaking existing integrations.

---

## 2. Compatibility Philosophy

- **Plugins target SDK versions.** A plugin manifest explicitly declares which version of the Notebook SDK it was built for.
- **Notebook evolves independently.** The core application can update its internal architecture without breaking plugins, provided the public Extension Points remain stable.
- **Extension points may evolve over time.**
- **Backward compatibility is preferred whenever practical.**
- **Deprecated extension points follow a managed lifecycle before removal.** Features are not removed overnight.

---

## 3. Compatibility Rules

### 3.1 Plugin Versions
Plugins use Semantic Versioning (SemVer) to communicate their own updates.

### 3.2 SDK Versions
The core application exposes a versioned SDK (e.g., `v1.2.0`).

### 3.3 The Contract
When a Plugin is validated during the Lifecycle, the system checks the plugin's requested SDK version against the application's actual SDK version.
- If the application SDK is older than the requested SDK, the plugin is rejected.
- If the application SDK is newer, but within a compatible major version threshold, the plugin is accepted.

### 3.4 Deprecation Philosophy
If an SDK method must be removed:
1. It is marked as `@deprecated` in the SDK documentation.
2. It remains functional for a defined transition period (e.g., one major release).
3. Plugins using it trigger a `Warning` notification in the developer console.
4. It is eventually removed, at which point incompatible plugins will fail validation.

---

## 4. Business Rules

- **Extension points remain stable public contracts.**
- **Notebook Core remains fully functional without plugins.**

---

## 5. Acceptance Criteria

- A plugin declaring compatibility with SDK `^1.0.0` successfully loads on Notebook application version `1.5.0` but fails Validation gracefully on application version `2.0.0` if breaking changes were introduced.

---

## 6. Cross References

- [02-PluginLifecycle.md](./02-PluginLifecycle.md)
