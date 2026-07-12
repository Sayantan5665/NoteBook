# 06 — Settings Governance

> **Module:** Settings
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Governance document defines the strict ownership boundaries for the Settings module, preventing it from creeping into domain logic.

---

## 2. Ownership Boundaries

### 2.1 Settings Owns:
- **Configuration schema:** Defining what settings exist.
- **Validation:** Ensuring values are correct.
- **Preference persistence:** Saving and loading the config file.

### 2.2 Settings Does NOT Own:
- **Notes**
- **Editor**
- **Search**
- **AI**
- **Sync**
- **Backup**
- **Notifications**

---

## 3. Consistency Rules

- **Settings configure modules. Modules remain owners of their own functionality.**
- **No Domain Logic:** The Settings module does not contain the logic for "How to switch to Dark Mode" or "How to connect to the Sync provider." It only stores the strings `'dark'` and `'provider_url'`.

---

## 4. Business Rules

- **Settings configure Notebook behavior.**
- **Settings never become Notebook content.**
- **Settings influence module behavior without owning modules.**
- **Notebook entities remain the canonical source of truth.**
- **Infrastructure modules coordinate processing.**
- **Derived artifacts never replace Notebook entities.**
- **Ownership never transfers.**

---

## 5. Acceptance Criteria

- Code reviews confirm that the Settings module does not import or execute any services from the AI, Editor, or Sync modules. It only accesses its own Key-Value store and publishes to the Event Bus.

---

## 6. Cross References

- [01-SettingsOverview.md](./01-SettingsOverview.md)
