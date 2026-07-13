import { app, BrowserWindow, Menu, shell, type MenuItemConstructorOptions } from 'electron';
import * as path from 'path';
import { registerIpcHandlers } from './ipc/register-handlers';
import { loadWindowState, saveWindowState } from './lifecycle/window-state';

const IS_DEV = process.env['NODE_ENV'] === 'development';

/**
 * Acquires the single-instance lock.
 * Must be called synchronously before app.whenReady().
 * If a second instance launches, this returns false and the process exits.
 */
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
}

function buildApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'zoom' }, { role: 'close' }],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createMainWindow(): BrowserWindow {
  const windowState = loadWindowState();

  const win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 800,
    minHeight: 600,
    /**
     * show: false prevents the white-flash on startup.
     * The window is shown on the 'ready-to-show' event below.
     */
    show: false,
    backgroundColor: '#0f0f1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      /**
       * Security per docs/01-architecture/04-Electron.md §6:
       * - contextIsolation: true  — renderer cannot access preload Node.js scope
       * - nodeIntegration: false  — renderer has no direct Node.js access
       * - sandbox: false          — required so preload can use ipcRenderer
       * - webSecurity: true       — same-origin policy enforced
       */
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });

  if (windowState.isMaximized) {
    win.maximize();
  }

  /**
   * Navigation guard: prevent the renderer from loading external URLs
   * inside the application window. External URLs open in the OS browser.
   */
  win.webContents.on('will-navigate', (event, url) => {
    const parsed = new URL(url);
    const isLocalDevServer =
      IS_DEV &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');
    const isFileProtocol = parsed.protocol === 'file:';

    if (!isLocalDevServer && !isFileProtocol) {
      event.preventDefault();
      shell.openExternal(url).catch(() => undefined);
    }
  });

  // Route all new-window requests to the OS default browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url).catch(() => undefined);
    return { action: 'deny' };
  });

  // Show only when Chromium has painted the first frame — prevents white flash.
  win.once('ready-to-show', () => win.show());

  // Persist window state whenever the window closes.
  win.on('close', () => saveWindowState(win));

  return win;
}

async function loadWindowContent(win: BrowserWindow): Promise<void> {
  if (IS_DEV) {
    await win.loadURL('http://localhost:4200');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    /**
     * In production, Angular is compiled to dist/angular/ by ng build.
     * __dirname resolves to dist/electron/ at runtime (rootDir: 'electron').
     * dist/angular/index.html is one directory up from dist/electron/.
     */
    const indexPath = path.join(__dirname, '..', 'angular', 'index.html');
    await win.loadFile(indexPath);
  }
}

// ─── Application Entry Point ──────────────────────────────────────────────────

/**
 * Register IPC handlers before any window is created so handlers are ready
 * the moment the renderer sends its first message.
 */
registerIpcHandlers();

let mainWindow: BrowserWindow | null = null;

// Restore and focus the existing window when a second instance is launched.
app.on('second-instance', () => {
  if (mainWindow !== null) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Quit on all windows closed (except macOS where apps remain active).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    buildApplicationMenu();
    mainWindow = createMainWindow();
    return loadWindowContent(mainWindow);
  })
  .then(() => {
    // macOS: re-create the window when the dock icon is clicked and no windows exist.
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow();
        loadWindowContent(mainWindow).catch(console.error);
      }
    });
  })
  .catch(console.error);
