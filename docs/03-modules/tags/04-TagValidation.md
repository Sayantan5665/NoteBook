> **Document Type:** Module Specification
> **Status:** Draft
> **Version:** 1.0
> **Depends On:** Tags Module Overview
> **Document Owner:** Core Architecture Team

# 04 — Tag Validation

---

## 1. Purpose

This document outlines the principles for validating Tags. It ensures that Tag names are consistent, queries behave predictably, and the relational graph remains uncorrupted.

## 2. Validation Philosophy

Validation protects Tag consistency without restricting future extensibility. The system should gently enforce hygiene (like preventing confusing duplicate names) without blocking creative organization.

## 3. Core Concepts

### 3.1 Duplicate Names
- The module must prevent the creation of two distinct UUIDs with the exact same textual name (e.g., stopping the user from having two separate `#important` tags). 
- If a user attempts to create a duplicate, the system should silently resolve to the existing UUID.

### 3.2 Case Sensitivity Philosophy
- Tags are conceptually case-insensitive for resolution but case-preserving for display.
- Example: Creating `#Meeting` will display as `#Meeting`. Typing `#meeting` later will resolve to the existing `#Meeting` UUID rather than creating a new tag.

### 3.3 Invalid Characters
- Tags typically restrict whitespace and certain special characters (e.g., `,`, `;`, `.`, `!`) to ensure they can be easily typed and parsed in plain text editors. The exact regex is an implementation detail, but the validation boundary belongs here.

### 3.4 Reserved Names (Future)
- Reserving specific strings (e.g., `#system`, `#all`) to prevent collisions with future system-level Tag Groups or features.

## 4. Operation Validation

### 4.1 Merge Validation
- The module must validate that a Merge operation specifies two valid, distinct Tag UUIDs.
- Circular merges (merging A into A) must be rejected.

### 4.2 Delete Validation
- Deleting a Tag must validate that the UUID exists. It does NOT need to check if Notes are attached, because deleting a Tag is always safe (it never cascades to delete Notes).

### 4.3 Reference Validation
- Ensuring that when a Note payload claims to reference a Tag UUID, that UUID actually exists in the Tags registry.

## 5. Business Rules

- **Consistent Resolution:** The case-insensitivity rule must be enforced consistently at the module boundary to prevent fragmented databases (e.g., having `#Work`, `#work`, and `#WORK` as three distinct UUIDs).

## 6. Acceptance Criteria

- Typing `#meeting` and `#Meeting` in two different notes results in both notes referencing the exact same Tag UUID.
- Attempting to rename `#ideas` to an empty string `""` is rejected by the validation layer.
