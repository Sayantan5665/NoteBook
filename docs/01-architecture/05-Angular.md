# 05 — Angular Architecture

> **Document Type:** Architecture Specification
> **Status:** Draft
> **Applies To:** Notebook — All Versions
> **Related Documents:**
> [01-SystemOverview.md](./01-SystemOverview.md) · [04-Electron.md](./04-Electron.md) · [06-IPC.md](./06-IPC.md) · [03-Monorepo.md](./03-Monorepo.md)

---

## 1. Purpose

This document specifies the Angular architecture for Notebook's UI layer. It defines the module structure, component organization, state management approach, routing strategy, and Angular-specific conventions that **shall** be followed across the application.

---

## 2. Angular Version and Configuration

- Angular **shall** use the latest stable major version at project initiation.
- **Standalone components** are the preferred component authoring style. `NgModule`-based modules **should** be limited to legacy integration patterns only.
- **Signals** are the preferred reactive primitive for local and feature-level state.
- **RxJS** is used for inherently stream-based concerns: IPC event streams, debounced input handling, and long-lived subscriptions.

---

## 3. Application Structure

```
apps/desktop/src/
├── app/
│   ├── core/                         ← Application-wide singletons and infrastructure
│   │   ├── services/
│   │   │   ├── ipc.service.ts        ← Typed wrapper around window.notebookApi
│   │   │   ├── workspace.service.ts  ← Active Workspace session state
│   │   │   ├── theme.service.ts      ← System theme detection and management
│   │   │   └── error.service.ts      ← Global error handling and display
│   │   ├── guards/
│   │   │   └── workspace.guard.ts    ← Prevent navigation without an open Workspace
│   │   └── interceptors/             ← (reserved for future use)
│   │
│   ├── shared/                       ← Reusable UI building blocks
│   │   ├── components/
│   │   │   ├── button/
│   │   │   ├── dialog/
│   │   │   ├── spinner/
│   │   │   ├── toast/
│   │   │   └── empty-state/
│   │   ├── directives/
│   │   │   ├── autofocus.directive.ts
│   │   │   └── scroll-into-view.directive.ts
│   │   ├── pipes/
│   │   │   ├── relative-date.pipe.ts
│   │   │   └── file-size.pipe.ts
│   │   └── shared.ts                 ← Barrel export
│   │
│   ├── features/                     ← Feature areas (lazy-loaded)
│   │   ├── workspace-selector/       ← Launch screen — open/create Workspace
│   │   ├── workspace-shell/          ← Main app shell after Workspace is open
│   │   ├── notes/                    ← Note list, note editor, backlinks panel
│   │   ├── folders/                  ← Folder tree sidebar
│   │   ├── attachments/              ← Attachment panel, OCR status
│   │   ├── search/                   ← Full-text and semantic search UI
│   │   ├── ai-chat/                  ← AI chat interface
│   │   ├── todos/                    ← Todo list and management
│   │   ├── tags/                     ← Tag browser and tag management
│   │   ├── version-history/          ← Version diff viewer and restore UI
│   │   ├── settings/                 ← Workspace and application settings
│   │   ├── sync/                     ← Google Drive sync UI
│   │   ├── import-export/            ← Import and export wizards
│   │   └── plugins/                  ← Plugin management UI
│   │
│   ├── app.routes.ts                 ← Root routing configuration
│   └── app.config.ts                 ← Root application providers
│
├── assets/
└── styles/
    ├── global.scss
    ├── themes/
    │   ├── light.scss
    │   └── dark.scss
    └── variables.scss
```

---

## 4. Module and Component Strategy

### 4.1 Standalone Components (Preferred)

All new components **shall** be declared as standalone (`standalone: true`). They import their dependencies directly in the `imports` array of the `@Component` decorator. This eliminates the need for `NgModule` declarations and simplifies tree-shaking.

### 4.2 Core Services

Core services are provided at the root level (`providedIn: 'root'`). They are singletons for the application lifetime.

| Service | Scope | Responsibility |
|---|---|---|
| `IpcService` | Root | Typed wrapper over `window.notebookApi`; provides Observable streams for push events |
| `WorkspaceService` | Root | Holds current Workspace state (Signal); mediates Workspace open/close |
| `ThemeService` | Root | Reads `nativeTheme` preference via IPC; applies CSS custom properties |
| `ErrorService` | Root | Catches unhandled errors; surfaces toast notifications |
| `PluginUiHostService` | Root | Registers UI-side plugin extensions (editor extensions, themes) |

### 4.3 Feature Services

Each feature module **may** define its own services provided at the feature level (`providers: [...]` in the route). These are scoped to the feature's lifetime.

---

## 5. Routing

### 5.1 Route Structure

```
/                         → WorkspaceSelectorComponent (no Workspace guard)
/workspace                → WorkspaceShellComponent (requires Workspace guard)
  /workspace/notes        → NotesLayoutComponent
  /workspace/notes/:id    → NoteEditorComponent
  /workspace/search       → SearchComponent
  /workspace/ai-chat      → AiChatComponent
  /workspace/todos        → TodosComponent
  /workspace/tags         → TagsComponent
  /workspace/settings     → SettingsComponent
  /workspace/sync         → SyncComponent
  /workspace/plugins      → PluginsComponent
  /workspace/import       → ImportComponent
  /workspace/export       → ExportComponent
```

### 5.2 Lazy Loading

All feature routes **shall** use lazy loading via `loadComponent()` or `loadChildren()`. The workspace selector and workspace shell are loaded eagerly (small, always needed). All other feature routes are lazy.

```typescript
// Example route definition pattern
{
  path: 'workspace',
  canActivate: [WorkspaceGuard],
  loadComponent: () => import('./features/workspace-shell/workspace-shell.component')
    .then(m => m.WorkspaceShellComponent),
  children: [
    {
      path: 'notes/:id',
      loadComponent: () => import('./features/notes/note-editor/note-editor.component')
        .then(m => m.NoteEditorComponent)
    }
  ]
}
```

### 5.3 Guards

| Guard | Applied To | Behavior |
|---|---|---|
| `WorkspaceGuard` | All `/workspace/*` routes | Redirects to `/` if no Workspace is open |

---

## 6. State Management

### 6.1 Philosophy

Notebook is a single-user desktop application. Heavy state management frameworks (NgRx, Akita, etc.) introduce complexity that is not justified. The state management approach is:

- **Angular Signals** for reactive local and feature-level state
- **Angular Services with Signals** as simple shared state stores
- **RxJS Observables** for event streams (IPC push events, debounced input)
- **No global state store** (no NgRx, no BehaviorSubject stores at root level)

### 6.2 State Categories

| Category | Mechanism | Example |
|---|---|---|
| Active Workspace | `WorkspaceService` (Signal) | `currentWorkspace: Signal<WorkspaceDto>` |
| Active Note | `NoteEditorService` (Signal) | `activeNote: Signal<NoteDto \| null>` |
| Search results | Local component Signal | `results: Signal<SearchResultDto[]>` |
| AI response stream | RxJS Observable from IPC | `aiResponse$: Observable<string>` |
| Sidebar open/closed | Local component Signal | `sidebarOpen: Signal<boolean>` |
| Theme | `ThemeService` (Signal) | `theme: Signal<'light' \| 'dark'>` |

### 6.3 Data Loading Pattern

Feature components **shall** load their data by calling the `IpcService` and projecting results into Signals.

```
Component.ngOnInit()
  → IpcService.invoke('note:get', { id })
  → Sets noteSignal with Result data
  → Template reads from noteSignal
```

Loading and error states **shall** be tracked as co-located Signals within the component or its dedicated service.

### 6.4 Mutations

All mutations (create, update, delete) go through the IPC layer and return a `Result`. On success, the component updates its local Signal and optionally navigates. The Signal-based approach avoids the need for optimistic updates in most cases.

---

## 7. IPC Service Design

The `IpcService` is the sole gateway between the Angular UI and the main process. It wraps `window.notebookApi` and provides:

- **Typed invoke methods** — one method per IPC channel, fully typed against `@notebook/ipc-contracts`
- **Observable event streams** — converts `window.notebookApi.on(channel, handler)` into RxJS Observables for reactive consumption in components

```
IpcService
  notes.create(payload: CreateNoteRequest): Promise<Result<NoteDto>>
  notes.update(payload: UpdateNoteRequest): Promise<Result<NoteDto>>
  notes.delete(payload: DeleteNoteRequest): Promise<Result<void>>
  search.fullText(query: SearchQuery): Promise<Result<SearchResultDto[]>>
  ai.sendMessage(payload: AiMessageRequest): Promise<Result<void>>
  ai.onResponseChunk(): Observable<AiChunkEvent>
  sync.onStatusChanged(): Observable<SyncStatusEvent>
  ocr.onProgress(): Observable<OcrProgressEvent>
```

---

## 8. Editor Integration (Tiptap)

The rich text editor is built on **Tiptap**, which is framework-agnostic. The Angular integration **shall**:

- Wrap the Tiptap `Editor` instance in an `EditorService` scoped to the note editor feature
- Initialize the editor with a configured extension set on `ngAfterViewInit`
- Serialize editor content to/from the storage format (JSON or HTML) on save/load
- Expose a `content` Signal reflecting the current editor state for metadata display (word count, etc.)
- Support plugin-registered editor extensions via the `PluginUiHostService`

---

## 9. Theme System

The application **shall** support light and dark modes using CSS custom properties.

- `ThemeService` reads the system preference via an IPC call to `nativeTheme.shouldUseDarkColors`
- The theme is applied by setting a `data-theme` attribute on the `<html>` element
- CSS custom properties are defined in `styles/themes/light.scss` and `styles/themes/dark.scss`
- Users **may** override the system preference via the application settings

---

## 10. Error Handling

- All IPC calls return `Result<T, AppError>`. Components **shall** handle both `success` and `failure` branches explicitly.
- Unhandled `failure` results **shall** be forwarded to `ErrorService`, which displays a toast notification.
- Angular's `ErrorHandler` **shall** be overridden to route JavaScript runtime errors to `ErrorService` and log them via IPC to the filesystem logger.

---

## 11. Performance Considerations

- **Virtual scrolling** (`@angular/cdk/scrolling`) **shall** be used for all lists that may contain more than 50 items (note lists, search results, tag browser).
- **OnPush change detection** **shall** be used on all list item components and other pure display components.
- Heavy operations (embedding display, version diff rendering) **shall** be deferred using `afterNextRender()` or `setTimeout` with `ChangeDetectorRef.detectChanges()` to avoid blocking the main render cycle.

---

## 12. Acceptance Criteria

- All feature routes are lazy-loaded; the initial bundle contains only the workspace selector and core services.
- No Angular component directly accesses `window.notebookApi` — all calls go through `IpcService`.
- No Angular component contains business logic — all business operations are delegated to IPC calls.
- The application renders correctly in both light and dark system themes on all three target platforms.
