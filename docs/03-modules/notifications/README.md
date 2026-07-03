# Notifications Module

> **Document Type:** Module README
> **Module:** notifications
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [../../01-architecture/01-SystemOverview.md §16](../../01-architecture/01-SystemOverview.md) · [../../01-architecture/09-EventBus.md](../../01-architecture/09-EventBus.md) · [../backup/README.md](../backup/README.md) · [../sync/README.md](../sync/README.md) · [../ai/README.md](../ai/README.md) · [../todos/README.md](../todos/README.md) · [../00-ModuleOverview.md](../00-ModuleOverview.md)

---

## Purpose

The Notifications module defines how Notebook communicates system events, background job status, and time-sensitive alerts to the user — without interrupting the user's primary workflow.

Notebook is an application with significant background processing: OCR runs after attachments are added, embeddings are generated asynchronously, sync transfers data in the background, and backups execute on a schedule. The Notifications module ensures that the user is informed about the state of these background processes, errors that require attention, and time-sensitive reminders (such as approaching todo due dates) — in a non-intrusive, consistent way.

---

## Scope

**This module covers:**
- In-app notification toasts (ephemeral status messages)
- Persistent notification center (a browsable log of recent notifications)
- Background job status indicators (embedding progress, OCR progress, sync status, backup status)
- Error notifications: surfacing actionable errors with recovery guidance
- Success notifications: confirming completed operations (backup complete, sync complete)
- Warning notifications: drawing attention to degraded states (Ollama unavailable, low disk space)
- Todo due date reminder notifications (in-app; OS-level notifications are a future consideration)

**This module does NOT cover:**
- OS-level push notifications (future consideration — requires Electron notification API integration)
- Email or external notification delivery
- The underlying background job execution (see `ai/`, `attachments/`, `sync/`, `backup/`)

---

## Responsibilities

This module is responsible for:

- Listening to domain events from all modules and producing appropriate notification messages
- Displaying ephemeral toast notifications for time-bound messages
- Persisting significant notifications in the notification center for later review
- Providing a background job progress panel showing active job status
- Dismissing and clearing notifications
- Routing user actions from notifications (e.g., "View backup" button in a backup-complete notification)

---

## Planned Specification Documents

| File | Status | Content |
|---|---|---|
| `01-NotificationTypes.md` | Planned | Taxonomy of notification types (toast, persistent, progress, error, warning) |
| `02-NotificationCenter.md` | Planned | Notification center panel: browsable log, dismiss, clear, navigate |
| `03-BackgroundJobStatus.md` | Planned | Progress indicators for OCR, embedding, sync, backup |
| `04-ErrorNotifications.md` | Planned | Error notification format, severity levels, recovery actions |

---

## Key Business Rules (Summary)

- Notifications shall not interrupt the user's active editing session. Toasts appear in a non-blocking overlay.
- Error notifications persist until explicitly dismissed by the user or resolved by the system.
- Success and informational toasts auto-dismiss after a configurable duration (default: 4 seconds).
- The notification center retains the last N notifications (configurable; default: 100).
- A notification for a background job failure includes a specific, actionable recovery step — not just a generic error message.
- Notification content never includes raw note content, attachment filenames, or other private data in any externally transmitted format. Notifications are local-only.

---

## Event Sources (Summary)

| Source Module | Events That Produce Notifications |
|---|---|
| `ai/` | Embedding complete, embedding failed, re-indexing started/completed, Ollama unavailable |
| `attachments/` | OCR complete, OCR failed, attachment added |
| `sync/` | Sync started, sync complete, sync failed, conflict detected |
| `backup/` | Backup complete, backup failed, pre-migration backup complete |
| `workspace/` | Migration complete, migration failed, integrity check failed |
| `todos/` | Due date reminder (approaching due date) |

---

## Future Considerations

- **OS-level notifications:** Using the Electron `Notification` API to surface important alerts (sync errors, backup failures) even when the application window is not in focus.
- **Notification preferences:** Allowing users to opt out of specific notification categories (e.g., "Don't notify me when embeddings are generated").
- **Notification grouping:** Collapsing multiple similar notifications (e.g., "10 embeddings generated") into a single grouped notification.
- **Webhook notifications (plugin):** A plugin extension point allowing notifications to be forwarded to external services (Slack, Discord, webhooks).
