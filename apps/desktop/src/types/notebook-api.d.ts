/**
 * Ambient type declaration for window.notebookApi.
 *
 * This interface describes the shape of the IPC bridge exposed by the
 * Electron preload script via contextBridge.exposeInMainWorld('notebookApi', ...).
 *
 * No Angular component or service may access window.notebookApi directly —
 * all calls must go through IpcService.
 *
 * Reference: docs/01-architecture/04-Electron.md §5, docs/01-architecture/06-IPC.md §9
 */

type IpcEventHandler = (...args: unknown[]) => void;

interface NotebookApi {
  /**
   * Sends a typed request to the main process via ipcRenderer.invoke().
   * Returns a Promise that resolves with the handler's return value.
   * Only channels registered in @notebook/ipc-contracts are permitted.
   */
  readonly invoke: (channel: string, payload?: unknown) => Promise<unknown>;

  /**
   * Subscribes to push events sent from main via webContents.send().
   * Must be paired with off() in ngOnDestroy to prevent memory leaks.
   */
  readonly on: (channel: string, handler: IpcEventHandler) => void;

  /**
   * Unsubscribes a push event handler registered with on().
   */
  readonly off: (channel: string, handler: IpcEventHandler) => void;
}

declare interface Window {
  readonly notebookApi: NotebookApi;
}
