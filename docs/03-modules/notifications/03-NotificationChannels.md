# 03 — Notification Channels

> **Module:** Notifications
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Channels document defines the various UI and OS integration points used to surface information to the user.

---

## 2. Channel Philosophy

- **Channels deliver notifications.** They are the final physical presentation layer.
- **Channels remain interchangeable.** The core Notification logic does not care if an alert is delivered via a Web DOM Toast or a Windows OS notification.

---

## 3. Supported Channels

### 3.1 In-app (Toast)
Small, non-intrusive popups rendered within the Notebook application window. Used for standard application feedback (e.g., "Settings Saved").

### 3.2 Desktop / System Notification
Native OS-level notifications (Windows/macOS/Linux). Used for critical background events when the application might be minimized (e.g., "Sync Failed").

### 3.3 Future Channels
- **Email:** For enterprise or server-hosted deployments.
- **Mobile Push:** For future mobile companions.
- **Web Push:** For browser-based clients.

---

## 4. Business Rules

- **Channels deliver notifications.**
- **Channels remain interchangeable.**

---

## 5. Acceptance Criteria

- If the Desktop Notification API is unavailable or denied by the user, the module gracefully falls back to the In-app Toast channel.
- Sending a Notification Request allows the originating module to specify a *preferred* channel, but the Notification module makes the final routing decision based on user Settings.

---

## 6. Cross References

- [02-NotificationLifecycle.md](./02-NotificationLifecycle.md)
