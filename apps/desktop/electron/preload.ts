import { contextBridge, ipcRenderer } from 'electron';
import { AppChannels } from '@notebook/ipc-contracts';

type IpcEventHandler = (...args: unknown[]) => void;

/**
 * Whitelist of channels that the renderer is permitted to invoke.
 * Derived from @notebook/ipc-contracts — no string literals here.
 *
 * Per docs/01-architecture/06-IPC.md §10:
 * The preload shall validate that channel names passed to invoke are members
 * of the known channel set before calling ipcRenderer.invoke.
 */
const ALLOWED_CHANNELS = new Set<string>(Object.values(AppChannels));

/**
 * The typed IPC bridge exposed to the renderer as window.notebookApi.
 *
 * Security constraints (docs/01-architecture/04-Electron.md §6):
 * - contextIsolation: true  — renderer cannot access this script's scope
 * - nodeIntegration: false  — renderer cannot call Node.js APIs directly
 * - Exposed only via contextBridge — never via window assignment
 */
const notebookApi = {
  /**
   * Sends a request to the main process and returns a Promise for the response.
   * Only channels registered in @notebook/ipc-contracts are permitted.
   */
  invoke(channel: string, payload?: unknown): Promise<unknown> {
    if (!ALLOWED_CHANNELS.has(channel)) {
      return Promise.reject(
        new Error(`IPC invoke blocked: channel "${channel}" is not permitted.`)
      );
    }
    return ipcRenderer.invoke(channel, payload);
  },

  /**
   * Subscribes to push events sent from the main process via webContents.send().
   * Listener is registered only for whitelisted channels.
   */
  on(channel: string, handler: IpcEventHandler): void {
    if (!ALLOWED_CHANNELS.has(channel)) return;
    ipcRenderer.on(channel, (_event, ...args) => handler(...args));
  },

  /**
   * Unsubscribes a previously registered push event handler.
   * Must be called in ngOnDestroy to prevent memory leaks.
   */
  off(channel: string, handler: IpcEventHandler): void {
    if (!ALLOWED_CHANNELS.has(channel)) return;
    ipcRenderer.removeListener(channel, handler);
  },
} as const;

contextBridge.exposeInMainWorld('notebookApi', notebookApi);
