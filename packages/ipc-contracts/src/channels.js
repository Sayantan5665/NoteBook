"use strict";
/**
 * IPC channel name constants.
 *
 * All channels follow the `domain:action` naming convention defined in
 * docs/01-architecture/06-IPC.md §3.
 *
 * This file is the single source of truth for all channel names.
 * String literals MUST NOT appear in handler or call-site code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppChannels = void 0;
exports.AppChannels = {
    /** Renderer → Main health-check ping. Main responds with 'pong'. */
    PING: 'app:ping',
};
//# sourceMappingURL=channels.js.map