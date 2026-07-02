# 11 — Security Architecture

> **Document Type:** Architecture Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [04-Electron.md](./04-Electron.md) · [06-IPC.md](./06-IPC.md) · [10-PluginArchitecture.md](./10-PluginArchitecture.md) · [12-SynchronizationArchitecture.md](./12-SynchronizationArchitecture.md) · [../00-overview/05-NonFunctionalRequirements.md](../00-overview/05-NonFunctionalRequirements.md)

---

## 1. Purpose

This document specifies the security architecture for Notebook. It defines the threat model, security controls, secrets management strategy, and the principles that govern all security-sensitive decisions in the application.

Notebook's security posture is shaped by two facts:
1. There is no developer-owned backend — there is no server to attack, no database to breach, no credentials to steal from a central store.
2. All user data is local — security means protecting the user's local machine and preventing data from leaving without consent.

---

## 2. Threat Model

| Threat | Likelihood | Controls |
|---|---|---|
| Malicious website loaded in the app window gaining Node.js access | Medium | `contextIsolation: true`, `nodeIntegration: false`, navigation restrictions |
| Renderer process exploited via malicious note content (XSS/injection) | Medium | Content sanitization in the editor, strict CSP |
| Plugin accessing data beyond its declared permissions | Medium | Declared-permission model, `PluginHostApi` capability restrictions |
| OAuth tokens for Google Drive stolen from disk | Low | Stored in OS native credential store, not in plain files |
| Google Drive sync accidentally overwriting local data | Low | Local-authoritative principle, no auto-overwrite without user confirmation |
| Passive data exfiltration (telemetry, analytics) | Low (prevented by design) | No telemetry code exists; no network requests in non-sync paths |
| Malicious plugin installed by user | Medium | User confirmation at install, permission display, permission enforcement at runtime |
| Compromised Ollama making network calls | Low | Ollama runs locally; its network activity is the user's own responsibility |

---

## 3. Electron Security

### 3.1 Window Configuration

As specified in [04-Electron.md §6](./04-Electron.md):

| Setting | Value | Security Effect |
|---|---|---|
| `contextIsolation` | `true` | Renderer JavaScript cannot access preload or Node.js globals |
| `nodeIntegration` | `false` | Renderer cannot call Node.js APIs directly |
| `webSecurity` | `true` | Cross-origin requests from renderer are blocked |
| `allowRunningInsecureContent` | `false` | Mixed content blocked |
| `sandbox` | `false` | Preload needs `ipcRenderer`; mitigated by `contextIsolation` |

### 3.2 Content Security Policy

A strict CSP **shall** be applied to the main application window via the `Content-Security-Policy` HTTP header (set by the Electron `protocol` module for `file://` loads):

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
connect-src 'self';
font-src 'self' data:;
object-src 'none';
base-uri 'self';
```

`'unsafe-inline'` for styles is permitted because Tiptap and Angular compile inline styles. Script execution from inline `<script>` tags or `eval()` is absolutely prohibited.

### 3.3 Navigation Restriction

The application **shall** intercept `will-navigate` events and block any navigation away from the application's own `file://` origin. External links in note content **shall** be opened via `shell.openExternal()` in the system browser after URL validation.

### 3.4 URL Validation for `shell.openExternal()`

Before calling `shell.openExternal(url)`, the application **shall** validate that the URL:
- Has a `https://` or `http://` scheme
- Is not a `file://`, `javascript:`, or `data:` URL

Unvalidated external URLs **shall not** be passed to `shell.openExternal()`.

---

## 4. IPC Security

### 4.1 Input Validation

All IPC payloads received by main process handlers **shall** be validated against a schema (using a lightweight validator such as `zod`) before being passed to any use case or service. Malformed payloads **shall** be rejected with a `VALIDATION_ERROR` result.

### 4.2 Channel Whitelist

The preload script **shall** only forward `invoke` calls for channels that appear in the `@notebook/ipc-contracts` channel list. Unknown channels **shall** be silently dropped.

### 4.3 Renderer Cannot Directly Access Infrastructure

The renderer process has no direct access to the database, filesystem, or any infrastructure library. All such access is mediated through IPC handlers in the main process, which apply authorization checks appropriate to the operation.

---

## 5. OAuth and Google Drive Security

### 5.1 OAuth Flow

Google Drive authorization uses the standard OAuth 2.0 authorization code flow with PKCE:

1. The application generates a PKCE code verifier and challenge.
2. The authorization URL is opened in the **system browser** via `shell.openExternal()` — never loaded in the app window.
3. Google redirects to a local loopback server (`http://localhost:<ephemeral-port>/callback`) that the main process listens on.
4. The authorization code is exchanged for tokens. The loopback server is closed immediately after receiving the callback.
5. Access and refresh tokens are stored in the OS native credential store.

### 5.2 Token Storage

OAuth tokens **shall** be stored exclusively in the operating system's native secure credential store:

| Platform | Credential Store |
|---|---|
| Windows | Windows Credential Manager (via `keytar` or `@electron/keytar`) |
| macOS | macOS Keychain |
| Linux | libsecret / Secret Service API |

Tokens **shall not** be stored in:
- The SQLite database
- Plaintext configuration files
- Any location accessible to the renderer process

### 5.3 Token Refresh

Access tokens expire. The sync service **shall** automatically refresh the access token using the stored refresh token before initiating a sync operation. Refresh token rotation **shall** be handled correctly — new refresh tokens replace old ones in the credential store.

### 5.4 Token Revocation

When the user revokes Google Drive access:
1. The application calls the Google OAuth revocation endpoint.
2. All stored tokens for that Workspace are deleted from the OS credential store.
3. Sync is disabled for the Workspace.

---

## 6. Filesystem Security

### 6.1 Path Traversal Prevention

All filesystem operations **shall** validate that the target path is within the permitted directory before executing:
- Note attachments **shall** only be written to/read from the active Workspace's `attachments/` directory.
- Plugin filesystem operations **shall** be restricted to the plugin's designated subdirectory.
- Export operations **shall** write to user-selected directories (from a file save dialog) only.

Any path argument that, after normalization, resolves outside the permitted root **shall** be rejected.

### 6.2 Attachment Storage

Attachment files are stored verbatim — they are never re-encoded or modified by the application. File extensions and MIME types are recorded at attachment time and validated against a permitted list.

---

## 7. Plugin Security

As specified in [10-PluginArchitecture.md §7](./10-PluginArchitecture.md):

- Plugins declare required permissions in their `plugin.json`.
- The `PluginHostApi` exposes only capabilities corresponding to declared permissions.
- Plugins cannot import internal application modules; they receive only the `PluginHostApi` object.
- Plugin filesystem access is restricted to the plugin's own data directory and (with the `filesystem:read` permission) the Workspace directory in read-only mode.
- Network access (`network:outbound`) is available only with explicit permission declaration.

---

## 8. Content Sanitization (Rich Text Editor)

User-created note content and imported content **shall** be sanitized before rendering in the editor:

- Tiptap's schema validation ensures only declared node types and marks are present in the document model — arbitrary HTML **cannot** be injected through the editor data model.
- Content imported from external formats (Markdown, HTML) **shall** be parsed and validated against the Tiptap schema. Unknown HTML elements **shall** be stripped.
- Wiki link targets **shall** be resolved to internal `NoteId` values before rendering — they cannot be used to trigger external navigation.

---

## 9. Secrets and Configuration

| Secret | Storage | Notes |
|---|---|---|
| Google Drive OAuth tokens | OS credential store | See §5.2 |
| Workspace encryption passphrase (future) | Never stored — entered at open time | Derived key stored transiently in memory |
| Plugin-provided API keys (e.g., for cloud AI) | OS credential store via `config.set` in PluginHostApi | Plugins store their own credentials |
| Application configuration | Plaintext JSON in `app.getPath('userData')` | No secrets; only preferences |

---

## 10. Privacy by Design

As specified in [../00-overview/05-NonFunctionalRequirements.md §5](../00-overview/05-NonFunctionalRequirements.md):

- No telemetry, analytics, or crash reporting code exists in the application by default.
- No network request is made by the core application except for Google Drive sync (when authorized) and Ollama (local loopback only).
- All AI inference is local by default. Note content never leaves the machine through the AI path unless the user configures a remote provider via a plugin.

---

## 11. Future Considerations

- **At-rest database encryption:** SQLite database encrypted with SQLCipher or a similar extension, using a user-provided passphrase. The encryption key is derived from the passphrase using Argon2 or scrypt and held in memory only while the Workspace is open.
- **Plugin code signing:** A signature on the plugin's `plugin.json` and entry point, verified at install time against a trusted key (plugin author's key or a future marketplace key).
- **Audit log:** A tamper-evident log of security-relevant events (plugin installs, sync authorizations, token revocations) for user review.
- **Process-level plugin sandboxing:** Moving plugin execution to an Electron `utilityProcess` to enforce OS-level isolation.
