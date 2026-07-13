import { Injectable } from '@angular/core';
import { AppChannels } from '@notebook/ipc-contracts';

/**
 * IpcService is the sole gateway between the Angular renderer and the
 * Electron main process. No Angular component or other service may access
 * window.notebookApi directly — all IPC calls must go through this service.
 *
 * Architecture reference: docs/01-architecture/05-Angular.md §7
 *
 * Each public method corresponds to one IPC channel. The channel name is
 * sourced exclusively from @notebook/ipc-contracts — never as a string literal.
 */
@Injectable({ providedIn: 'root' })
export class IpcService {
  /** Sends a ping to the main process and expects 'pong' in response. */
  ping(): Promise<string> {
    if (!window.notebookApi) {
      return Promise.reject(new Error('IPC bridge not available'));
    }
    return window.notebookApi.invoke(AppChannels.PING) as Promise<string>;
  }
}
