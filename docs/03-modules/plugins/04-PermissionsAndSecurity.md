# 04 — Permissions and Security

> **Module:** Plugins
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Permissions and Security document defines the conceptual model that restricts what a Plugin can do. It ensures that user privacy and data integrity are preserved, even if a plugin is malicious or buggy.

---

## 2. Security Philosophy

- **Permissions define what plugins may request.** A plugin manifest must explicitly declare its operational needs.
- **Notebook users retain control over granted permissions.** No capability is granted implicitly; the user is the final arbiter.
- **Plugins operate only through approved extension points.**
- **Plugins never gain unrestricted access.** There is no "root" or "admin" level permission for a plugin.
- **Isolation:** Each plugin operates within boundaries defined by the SDK.
- **Trust boundaries:** The core application does not trust plugins. All data crossing the boundary is validated.

---

## 3. Permission Model

Permissions are conceptual rights granted to a Plugin Instance. Examples include:

- **Read Notes:** Allows the plugin to query the active Workspace for Note content.
- **Write Notes:** Allows the plugin to request the Domain Service to create or modify Notes.
- **Read Attachments:** Access to the file paths/streams of workspace attachments.
- **Write Attachments:** Ability to add new media to the Workspace.
- **Editor Access:** Ability to interact with the active text editor buffer (e.g., for grammar checking).
- **Workspace Access:** Ability to read folder structures and tags.
- **AI Access:** Ability to utilize the configured AI endpoints (preventing rogue plugins from racking up API costs).
- **Search Access:** Ability to execute programmatic searches.
- **Import / Export / Sync / Backup / Settings / Notifications:** Access to trigger these specific infrastructure modules.

---

## 4. Failure Handling & Validation

- If a plugin attempts to access an SDK endpoint for which it lacks the corresponding permission, the SDK immediately throws a security exception.
- Repeated violations may result in the plugin being forcibly deactivated to protect the system.

---

## 5. Business Rules

- **Permissions are user controlled.**
- **Plugins never gain unrestricted access.**

---

## 6. Acceptance Criteria

- A plugin with only "Read Notes" permission that attempts to call `sdk.notes.update()` receives an immediate rejection from the SDK without the Domain ever being aware of the attempt.
- The UI presents a clear "Permission Review" screen when a plugin is installed, detailing exactly what scopes it requests.

---

## 7. Cross References

- [02-PluginLifecycle.md](./02-PluginLifecycle.md)
