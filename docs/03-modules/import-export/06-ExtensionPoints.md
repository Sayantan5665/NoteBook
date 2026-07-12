# 06 — Extension Points

> **Module:** Import / Export
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Extension Points document defines how the module supports a variety of data formats, enabling interoperability without hardcoding parsers into the core application.

---

## 2. Supported Extensions

### 2.1 File Formats
- **Markdown:** Core format for notes.
- **HTML:** Web clippings and rich text.
- **JSON:** Application data interchange.
- **ZIP:** Archive bundles.
- **PDF:** Read-only export format.
- **Future Custom Formats:** E.g., `.docx` or ePub.

### 2.2 Future Interoperability
- **Future Migration Tools:** Dedicated plugins to import from specific competitors (Notion, Obsidian, Roam).
- **Future Interoperability Providers:** Plugins that map foreign schemas to the Notebook Domain schema.

---

## 3. Business Rules

- Extensions only provide parsing and serialization logic.
- Extensions never interact directly with the database.
- Extensions receive opaque payloads or strings and return structured intermediate representations.

---

## 4. Acceptance Criteria

- A new `HTMLToNoteProvider` plugin can be registered with the Import module, allowing `.html` files to be dragged and dropped into the app without modifying the core import orchestration logic.

---

## 5. Cross References

- [Architecture: 10-PluginArchitecture](../../01-architecture/10-PluginArchitecture.md)
