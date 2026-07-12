# 10 — Security Guidelines

> **Module:** Development Standards
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Security Guidelines establish the practices required to protect user data from unauthorized access, corruption, or malicious plugins, enforcing the privacy-first philosophy.

---

## 2. Core Principles

- **Security Philosophy:** Security is a shared responsibility throughout development. It includes least privilege, privacy-first principles, secure defaults, strict validation, and the unwavering protection of user data.
- **Least Privilege:** Components, modules, and plugins must only request the minimum permissions necessary to perform their stated function.
- **Permission Boundaries:** The application must enforce explicit boundaries. A UI component rendering a Note cannot silently trigger a Workspace deletion.

---

## 3. Data Protection

### 3.1 Input Validation
- All data entering the system (via user input, imported files, or plugin APIs) must be strictly validated against expected schemas. Do not trust external data.

### 3.2 Output Encoding
- All rendered output (especially Markdown rendering) must be sanitized to prevent Cross-Site Scripting (XSS) or similar injection attacks.

### 3.3 Secrets Handling
- As defined in Configuration Management, API keys or remote tokens must be stored securely and never logged.

### 3.4 Offline Data Protection
- Future enhancements may include at-rest encryption (e.g., SQLCipher) for the SQLite database to protect data if the physical device is compromised.

---

## 4. AI and Plugin Security

- **AI Privacy:** Prompts sent to remote providers must clearly warn the user about data leaving the local environment.
- **Plugin Security:** Plugins must execute in a sandboxed environment. They cannot access the filesystem, network, or DOM directly. They must use the Plugin SDK's mediated extension points.

---

## 5. Business Rules

- **Strict Sanitization:** Any plugin-provided HTML or Markdown must be aggressively sanitized before injection into the DOM.

---

## 6. Acceptance Criteria

- Code reviews explicitly verify that new input pathways include schema validation and sanitization.

---

## 7. Cross References

- [07-ConfigurationManagement.md](./07-ConfigurationManagement.md)
