# 03 — Import Validation

> **Module:** Import / Export
> **Status:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The Import Validation document defines the safeguards that prevent corrupted, malicious, or incompatible external data from entering the Notebook ecosystem.

---

## 2. Validation Philosophy

- **Validation protects Notebook integrity.** The application trusts no external data by default.
- **Invalid imports never become Notebook data.** An import must pass all checks before being handed to the Domain.
- **Partial Acceptance (Future):** Future import strategies may support partial acceptance of valid data while safely rejecting invalid portions.

---

## 3. Validation Phases

### 3.1 Pre-Conversion Validation
Before attempting to parse an external file:
- **File Integrity:** Verifies file size limits and extension validity.
- **MIME Type Validation:** Ensures the actual content matches the expected format.

### 3.2 Post-Conversion Validation
After translating the external file into a Notebook entity model in memory:
- **Schema Validation:** Ensures the resulting object strictly adheres to the Domain's schema requirements (e.g., title length, valid ID).
- **Sanitization:** Strips malicious content (e.g., stripping `<script>` tags from imported HTML).

### 3.3 Conflict Validation
Before saving the entity:
- Validates that the imported data does not destructively overwrite existing canonical data without explicit user consent.

---

## 4. Failure Handling

- If any validation phase fails, the Import Session immediately aborts processing for that specific artifact.
- For batch imports, valid artifacts may proceed while invalid ones are skipped, producing a partial success result.

---

## 5. Business Rules

- **Validation protects Notebook integrity.**
- **Invalid imports never become Notebook data.**

---

## 6. Acceptance Criteria

- Importing an HTML file containing JavaScript `<script>` tags results in the tags being stripped during the Post-Conversion Validation phase, ensuring XSS protection.
- Importing a Markdown file that exceeds the maximum allowed size is rejected at Pre-Conversion Validation, preventing memory exhaustion.

---

## 7. Cross References

- [01-ImportOverview.md](./01-ImportOverview.md)
