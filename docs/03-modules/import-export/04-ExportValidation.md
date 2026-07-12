# 04 — Export Validation

> **Module:** Import / Export
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved

---

## 1. Purpose

The Export Validation document defines the checks performed to ensure that the data leaving the Notebook application is complete, uncorrupted, and safely written.

---

## 2. Validation Philosophy

- **Validation protects Notebook integrity.** Even during export, the system must ensure it does not leak broken state.
- **Invalid exports are cancelled safely.** If a derived artifact cannot be formed properly, it is discarded.

---

## 3. Validation Phases

### 3.1 Pre-Export Validation
Before converting canonical data:
- **Entity Existence:** Ensures the requested Notes or Folders still exist and have not been deleted concurrently.
- **Attachment Integrity:** Verifies that attachments referenced in the Note are actually present on disk before attempting to bundle them.

### 3.2 Post-Export Validation
After the artifact is derived but before it is finalized:
- **Artifact Integrity:** Ensures the resulting file (e.g., ZIP archive) is valid and fully written.
- **Destination Verification:** Ensures the target directory is writable and possesses sufficient disk space.

---

## 4. Failure Handling

- If validation fails, the Export Session aborts.
- Temporary files generated during the conversion are purged.
- An `ExportFailed` event is published, ensuring the user knows the artifact was not created.

---

## 5. Business Rules

- **Invalid exports are cancelled safely.**
- **Validation protects Notebook integrity.**

---

## 6. Acceptance Criteria

- Attempting to export a Note that contains a reference to a missing attachment image gracefully handles the missing file (e.g., skipping it or writing a placeholder) rather than crashing the export session.
- If the destination folder becomes read-only during export, Post-Export Validation catches the IO error, aborts safely, and cleans up temp files.

---

## 7. Cross References

- [02-ExportOverview.md](./02-ExportOverview.md)
