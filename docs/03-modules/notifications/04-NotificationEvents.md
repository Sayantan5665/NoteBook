# 04 — Notification Events

> **Module:** Notifications
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Events document outlines how the Notification module broadcasts the lifecycle states of alerts, allowing other modules to understand user interactions.

---

## 2. Event Philosophy

- Events communicate what happened to a notification.
- They allow the original caller to know if the user saw or interacted with the alert.

---

## 3. Published Events

- `NotificationCreated(id, payload)`: Fired when the request is accepted.
- `NotificationDelivered(id, channel)`: Fired when presented to the user.
- `NotificationDismissed(id, reason)`: Fired when closed (user action vs timeout).
- `NotificationExpired(id)`: Fired when the timeout is reached.
- `NotificationFailed(id, error)`: Fired if delivery completely fails.
- `NotificationActionClicked(id, actionId)`: Fired if the user clicks a specific button on the notification. The originating module listens for this to execute the business logic.

---

## 4. Consumed Events

- The Notification module listens to a generic `NotificationRequested` bus channel, allowing decoupled dispatching from anywhere in the app.

---

## 5. Business Rules

- **Notifications never own business logic.** Clicking an action button purely fires `NotificationActionClicked`; it is up to the consumer module to act on it.

---

## 6. Acceptance Criteria

- When a user clicks "Retry" on a Sync Error notification, the Notification module publishes `NotificationActionClicked`, which the Sync module intercepts to initiate a new Sync Request.

---

## 7. Cross References

- [01-NotificationOverview.md](./01-NotificationOverview.md)
