import { type Routes } from '@angular/router';

/**
 * Root route configuration.
 *
 * All feature routes are lazy-loaded via loadComponent() per
 * docs/01-architecture/05-Angular.md §5.2.
 *
 * The /dashboard and /settings routes are placeholder shells.
 * Full feature routes (/workspace, /workspace/notes/:id, etc.) are
 * added in subsequent implementation phases.
 */
export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
