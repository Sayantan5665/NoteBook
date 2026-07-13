import { app, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

interface WindowState {
  readonly x?: number;
  readonly y?: number;
  readonly width: number;
  readonly height: number;
  readonly isMaximized: boolean;
}

const STATE_FILE_NAME = 'window-state.json';

const DEFAULT_STATE: WindowState = {
  width: 1280,
  height: 800,
  isMaximized: false,
};

function getStatePath(): string {
  return path.join(app.getPath('userData'), STATE_FILE_NAME);
}

/** Reads persisted window state from userData. Returns defaults on any error. */
export function loadWindowState(): WindowState {
  try {
    const statePath = getStatePath();
    if (fs.existsSync(statePath)) {
      const raw = fs.readFileSync(statePath, 'utf-8');
      const parsed: unknown = JSON.parse(raw);
      if (parsed !== null && typeof parsed === 'object') {
        return parsed as WindowState;
      }
    }
  } catch {
    // Fall through to defaults on any read or parse failure.
  }
  return { ...DEFAULT_STATE };
}

/** Persists the current window bounds and maximized state to userData. */
export function saveWindowState(window: BrowserWindow): void {
  try {
    const bounds = window.getBounds();
    const state: WindowState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: window.isMaximized(),
    };
    fs.writeFileSync(getStatePath(), JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Window state persistence is best-effort; ignore save failures.
  }
}
