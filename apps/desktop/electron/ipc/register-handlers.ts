import { registerAppHandlers } from './handlers/app.handlers';

/**
 * Registers all IPC handlers at application startup.
 *
 * Called once from main.ts before any BrowserWindow is created.
 * Each domain's handlers are grouped in their own file under handlers/.
 * Future domains (note, workspace, search, etc.) are added by importing
 * their registration function here.
 */
export function registerIpcHandlers(): void {
  registerAppHandlers();
}
