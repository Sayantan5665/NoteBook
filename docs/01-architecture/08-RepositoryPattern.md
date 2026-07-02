# 08 — Repository Pattern

> **Document Type:** Architecture Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [02-CleanArchitecture.md](./02-CleanArchitecture.md) · [07-DependencyInjection.md](./07-DependencyInjection.md) · [../02-database/](../02-database/)

---

## 1. Purpose

This document specifies the Repository Pattern as applied in Notebook. It defines the repository interfaces, the responsibilities of implementations, transaction boundaries, and the conventions that **shall** govern all database and filesystem access in the application.

---

## 2. Why the Repository Pattern

The Repository Pattern provides a clean separation between the domain model and the data access mechanism. For Notebook, this means:

- **Testability:** Use cases can be tested with in-memory repository implementations without a database.
- **Substitutability:** The underlying storage (SQLite/Prisma) can be replaced or augmented without touching use cases or domain entities.
- **Abstraction:** Use cases express persistence intent in domain terms (`noteRepository.save(note)`) rather than infrastructure terms (`prisma.note.upsert(...)`).
- **Consistency:** All data access follows a single, predictable pattern.

---

## 3. Repository Interface Conventions

All repository interfaces **shall** follow these conventions:

1. Defined in `packages/domain/interfaces/repositories/`
2. Return domain entities, not ORM models or raw SQL rows
3. Accept and return typed identifiers (Value Objects like `NoteId`, not plain strings)
4. Return `Promise<T>` — all operations are asynchronous
5. Throw domain-specific errors (not Prisma errors) — infrastructure exceptions are caught and translated in the implementation

### 3.1 Standard Operation Set

Every repository **should** implement the following standard operations where applicable:

| Operation | Signature Pattern | Notes |
|---|---|---|
| `findById` | `(id: EntityId): Promise<Entity \| null>` | Returns null, never throws, if not found |
| `findAll` | `(workspaceId: WorkspaceId): Promise<Entity[]>` | All Workspace-scoped records |
| `save` | `(entity: Entity): Promise<Entity>` | Upsert — create or update |
| `delete` | `(id: EntityId): Promise<void>` | Hard delete |
| `moveToTrash` | `(id: EntityId): Promise<void>` | Soft delete |
| `findInTrash` | `(workspaceId: WorkspaceId): Promise<Entity[]>` | Trash contents |
| `restore` | `(id: EntityId): Promise<void>` | Restore from Trash |
| `permanentlyDelete` | `(id: EntityId): Promise<void>` | Remove from Trash permanently |

---

## 4. Repository Interface Catalogue

### 4.1 `INoteRepository`

```
INoteRepository {
  findById(id: NoteId): Promise<Note | null>
  findByWorkspace(workspaceId: WorkspaceId, options?: PaginationOptions): Promise<PageResult<Note>>
  findByFolder(folderId: FolderId): Promise<Note[]>
  findByTag(tagId: TagId, workspaceId: WorkspaceId): Promise<Note[]>
  findInTrash(workspaceId: WorkspaceId): Promise<Note[]>
  save(note: Note): Promise<Note>
  moveToTrash(id: NoteId): Promise<void>
  restore(id: NoteId): Promise<void>
  permanentlyDelete(id: NoteId): Promise<void>
}
```

### 4.2 `IWorkspaceRepository`

```
IWorkspaceRepository {
  findById(id: WorkspaceId): Promise<Workspace | null>
  findAll(): Promise<Workspace[]>                      ← All registered Workspaces on this machine
  save(workspace: Workspace): Promise<Workspace>
  delete(id: WorkspaceId): Promise<void>
}
```

### 4.3 `IFolderRepository`

```
IFolderRepository {
  findById(id: FolderId): Promise<Folder | null>
  findByWorkspace(workspaceId: WorkspaceId): Promise<Folder[]>
  findChildren(parentId: FolderId): Promise<Folder[]>
  findInTrash(workspaceId: WorkspaceId): Promise<Folder[]>
  save(folder: Folder): Promise<Folder>
  moveToTrash(id: FolderId): Promise<void>
  restore(id: FolderId): Promise<void>
  permanentlyDelete(id: FolderId): Promise<void>
}
```

### 4.4 `IAttachmentRepository`

```
IAttachmentRepository {
  findById(id: AttachmentId): Promise<Attachment | null>
  findByNote(noteId: NoteId): Promise<Attachment[]>
  findInTrash(workspaceId: WorkspaceId): Promise<Attachment[]>
  save(attachment: Attachment): Promise<Attachment>
  updateOcrText(id: AttachmentId, ocrText: string): Promise<void>
  moveToTrash(id: AttachmentId): Promise<void>
  restore(id: AttachmentId): Promise<void>
  permanentlyDelete(id: AttachmentId): Promise<void>
}
```

### 4.5 `ITagRepository`

```
ITagRepository {
  findById(id: TagId): Promise<Tag | null>
  findByWorkspace(workspaceId: WorkspaceId): Promise<Tag[]>
  findByName(name: TagName, workspaceId: WorkspaceId): Promise<Tag | null>
  save(tag: Tag): Promise<Tag>
  rename(id: TagId, newName: TagName): Promise<Tag>
  delete(id: TagId): Promise<void>
  applyToNote(tagId: TagId, noteId: NoteId): Promise<void>
  removeFromNote(tagId: TagId, noteId: NoteId): Promise<void>
}
```

### 4.6 `ITodoRepository`

```
ITodoRepository {
  findById(id: TodoId): Promise<Todo | null>
  findByWorkspace(workspaceId: WorkspaceId, options?: TodoFilterOptions): Promise<Todo[]>
  findByNote(noteId: NoteId): Promise<Todo[]>
  save(todo: Todo): Promise<Todo>
  delete(id: TodoId): Promise<void>
}
```

### 4.7 `INoteVersionRepository`

```
INoteVersionRepository {
  findById(id: NoteVersionId): Promise<NoteVersion | null>
  findByNote(noteId: NoteId): Promise<NoteVersion[]>
  save(version: NoteVersion): Promise<NoteVersion>
  deleteOlderThan(noteId: NoteId, retainCount: number): Promise<void>
}
```

### 4.8 `IEmbeddingRepository`

```
IEmbeddingRepository {
  upsert(sourceId: string, sourceType: 'note' | 'attachment', vector: EmbeddingVector): Promise<void>
  findSimilar(queryVector: EmbeddingVector, workspaceId: WorkspaceId, limit: number): Promise<SimilarityResult[]>
  deleteBySource(sourceId: string, sourceType: 'note' | 'attachment'): Promise<void>
}
```

### 4.9 `ISearchRepository`

```
ISearchRepository {
  fullTextSearch(query: string, workspaceId: WorkspaceId, options?: SearchOptions): Promise<SearchResult[]>
  indexNote(note: Note): Promise<void>
  indexAttachmentText(attachmentId: AttachmentId, text: string): Promise<void>
  removeFromIndex(id: string): Promise<void>
}
```

### 4.10 `IAiChatRepository`

```
IAiChatRepository {
  findByWorkspace(workspaceId: WorkspaceId): Promise<AiChat[]>
  findById(id: AiChatId): Promise<AiChat | null>
  saveChat(chat: AiChat): Promise<AiChat>
  saveMessage(message: AiMessage): Promise<AiMessage>
  clearChat(chatId: AiChatId): Promise<void>
}
```

---

## 5. Repository Implementations

Implementations live in `packages/infrastructure/database/repositories/`. Each implementation:

- Implements one repository interface
- Receives a `PrismaClient` instance (or raw `better-sqlite3` Database for FTS/vec operations) via constructor injection
- Maps between Prisma model types and domain entity types using a private mapper
- Catches Prisma errors and translates them to domain errors before re-throwing

### 5.1 Prisma Model ↔ Domain Entity Mapping

Each repository implementation contains a private static mapper. The mapper ensures the domain entity is never polluted with Prisma-specific fields (e.g., `createdAt` stored as a `Date` in Prisma vs. a `Timestamp` value object in the domain).

### 5.2 FTS5 and sqlite-vec Operations

FTS5 and sqlite-vec are queried directly via raw SQL through the Prisma `$queryRaw` API or via a raw `better-sqlite3` connection. These operations are encapsulated in `Fts5SearchRepository` and `SqliteVecEmbeddingRepository` respectively, keeping all raw SQL confined to the infrastructure layer.

---

## 6. Transaction Boundaries

### 6.1 Unit of Work

For use cases that write to multiple repositories atomically, a `IUnitOfWork` abstraction provides a transaction scope:

```
IUnitOfWork {
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
  noteRepository: INoteRepository
  attachmentRepository: IAttachmentRepository
  // ... other repositories in scope
}
```

The `PrismaUnitOfWork` implementation uses `prisma.$transaction()` to wrap all repository operations in a single database transaction.

### 6.2 When Transactions Are Required

| Operation | Transaction Required |
|---|---|
| Create note + index in FTS5 | Yes |
| Create note + apply tags | Yes |
| Move note + update folder counts | Yes |
| Delete folder + move all contents to Trash | Yes |
| Single note update with no cross-entity side effects | No (auto-commit) |
| Save embedding vector | No |
| Read operations | Never |

### 6.3 Transaction Scope

Transactions **shall** be as short as possible. Long-running operations (OCR, embedding generation) **shall not** run inside a transaction. Instead, the file/computation result is obtained first, then the write-only database update occurs within a short transaction.

---

## 7. Benefits Summary

| Benefit | Mechanism |
|---|---|
| Testable use cases | In-memory implementations substituted via constructor injection |
| No Prisma in domain or application | Interfaces are the only shared contract |
| Easy search backend swap | `Fts5SearchRepository` can be replaced with any `ISearchRepository` implementation |
| Consistent error handling | Infrastructure exceptions are always translated before crossing the layer boundary |
| Audit-friendly data access | All reads and writes flow through well-defined, discoverable repository methods |

---

## 8. Acceptance Criteria

- No use case directly imports any Prisma type or calls any Prisma method.
- All repository implementations have unit tests using an in-memory SQLite database (`:memory:`).
- A use case tested with `InMemoryNoteRepository` produces the same behavior as one tested with `PrismaNoteRepository` for equivalent inputs.
- All cross-entity writes that must be atomic are wrapped in a `UnitOfWork` transaction.
