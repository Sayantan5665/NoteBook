import { type ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { appRoutes } from './app.routes';

/**
 * Root application providers.
 *
 * Hash-based routing is used because Electron loads the production build via
 * the file:// protocol, which does not support HTML5 pushState routing.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes, withHashLocation())],
};
