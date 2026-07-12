# 06 — Update Strategy

> **Module:** Build, Packaging & Release
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Update Strategy document defines how users receive and apply updates, ensuring that the offline-first philosophy is maintained and updates do not force breaking changes unexpectedly.

---

## 2. Scope

Covers manual updates, automatic updates, migration, compatibility, and failure recovery.

---

## 3. Conceptual Strategy

### 3.1 Upgrade Philosophy
Application upgrades should preserve, where possible:
- Workspaces
- Notes
- Attachments
- Settings
- AI Conversations
- Plugins
- Backups

Data migrations should preserve canonical Notebook entities. Upgrades should never unnecessarily invalidate user data.

### 3.2 Offline-First Philosophy
- **No Forced Updates:** Because the app is offline-first, updates are inherently optional. The application will never refuse to launch simply because it is out of date.

### 3.2 Manual Updates
- Users can download the latest installer from the official release channels and run it over their existing installation (Upgrade Installation).

### 3.3 Future Automatic Updates
- If the user opts-in to network connectivity, the app can periodically check for updates.
- Updates can be downloaded in the background and applied cleanly upon the next restart.

### 3.4 Migration and Compatibility
- Updates triggering a MAJOR version bump (requiring schema migrations) must prompt the user to create a backup of their workspace before proceeding.

### 3.5 Failure Recovery
- If an update fails mid-installation, the installer must leave the previous application binaries intact or roll back cleanly, ensuring the app remains usable.

---

## 4. Responsibilities

- **Core Engineering:** Implement the internal schema migration logic that runs post-update.
- **Release Engineering:** Ensure the update server provides cryptographically signed binaries.

---

## 5. Business Rules

- **Consent for Network:** Update checking requires network access and must respect the global network opt-in/opt-out configuration.

---

## 6. Acceptance Criteria

- The application successfully migrates an older database schema to the latest version on the first launch after a manual update.

---

## 7. Future Enhancements

- Differential updates (downloading only the changed bytes) for users on metered connections.

---

## 8. Cross References

- [05-InstallerStrategy.md](./05-InstallerStrategy.md)
