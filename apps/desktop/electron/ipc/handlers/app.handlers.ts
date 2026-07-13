import { ipcMain } from 'electron';
import { AppChannels } from '@notebook/ipc-contracts';

/**
 * Registers application-level IPC handlers.
 *
 * Currently exposes a single ping/pong channel for IPC health verification.
 * Future app-level channels (e.g., app:get-version) are added here.
 */
export function registerAppHandlers(): void {
  ipcMain.handle(AppChannels.PING, async (): Promise<string> => {
    return 'pong';
  });
}
