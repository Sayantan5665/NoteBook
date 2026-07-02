# Notebook

> A privacy-first, offline-first, AI-powered personal knowledge management system built with Electron, Angular, SQLite, and local AI.

---

## Overview

Notebook is a modern desktop application that serves as a personal "Second Brain."

Unlike cloud-first note-taking applications, Notebook stores all user data locally and gives users complete ownership of their knowledge.

The application combines:

- Rich note-taking
- File management
- Semantic search
- Retrieval-Augmented Generation (RAG)
- Local AI
- Google Drive synchronization
- Plugin-based extensibility

into a single offline-first desktop application.

Notebook is **Workspace-first**: every note, attachment, AI chat, and setting belongs to a self-contained Workspace. Notes connect to each other through **wiki links** (`[[Note Title]]`); the application automatically maintains **backlinks** without any user intervention.

---

# Project Philosophy

Notebook follows five core principles.

## Offline First

Every core feature works without an internet connection.

Internet is only required for optional features such as:

- Google Drive synchronization
- Optional cloud AI providers

---

## Local First

All data belongs to the user.

The application stores everything locally using SQLite and the local filesystem.

No developer-owned backend exists.

---

## Privacy First

User data never leaves the local machine unless explicitly requested by the user.

Notebook never collects analytics by default.

Notebook never uploads notes to third-party services automatically.

---

## Zero Mandatory Cost

The application is fully functional without:

- Subscription
- Hosting
- Cloud database
- Paid AI API

Every core feature is available for free.

---

## Extensible

Every major subsystem is replaceable.

Examples:

- AI Providers
- Sync Providers
- OCR Providers
- Importers
- Exporters
- Themes
- Editor Extensions

---

# Goals

The application should enable users to:

- Create rich notes
- Organize folders
- Upload documents
- Search instantly
- Ask AI questions
- Summarize documents
- Build a personal knowledge base
- Synchronize across devices
- Work completely offline

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Desktop | Electron |
| Frontend | Angular |
| Language | TypeScript |
| ORM | Prisma |
| Database | SQLite |
| Vector Search | sqlite-vec |
| Search | SQLite FTS5 |
| Editor | Tiptap |
| Local AI | Ollama |
| OCR | Tesseract OCR |
| File Parsing | PDF.js, Mammoth, SheetJS |
| Sync | Google Drive API |

---

# High-Level Architecture

```text
Angular UI
      │
Electron IPC
      │
Application Layer
      │
Repository Layer
      │
SQLite + sqlite-vec
      │
Local File Storage
      │
Google Drive (Optional)
```

---

# Major Modules

- Workspace
- Folder Management
- Notes
- Rich Text Editor
- Attachments
- OCR
- Search
- AI Chat
- Retrieval Engine
- Embeddings
- Todo Management
- Version History
- Backup
- Google Drive Sync
- Plugin Manager

---

# Documentation

Full project documentation lives in the `docs/` directory.

| Section | Description |
|----------|-------------|
| `00-overview` | Vision, goals, scope, requirements, roadmap, and glossary |
| `architecture` | System design and architectural decisions |
| `database` | Schema, migrations and indexing |
| `modules` | Functional specifications per module |
| `sdk` | Plugin development |
| `development` | Coding standards and contribution guide |
| `adr` | Architecture Decision Records |

Start with [`docs/00-overview/01-Vision.md`](docs/00-overview/01-Vision.md) for the product vision and design philosophy.

---

# Project Status

Planning Phase

Current milestone:

- Documentation
- Architecture
- Database Design

Implementation has not started.

---

# Development Principles

- Offline-first
- Event-driven architecture
- Repository pattern
- Plugin-first architecture
- Dependency injection
- Modular design
- Strong typing
- Testability
- High performance

---

# License

TBD

---

# Contributing

Documentation and implementation guidelines will be added after the architecture phase is complete.