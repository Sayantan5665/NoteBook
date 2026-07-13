import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Settings placeholder page.
 *
 * Displays application metadata. No configuration logic is implemented
 * in this shell phase — that belongs to a future settings feature phase.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
