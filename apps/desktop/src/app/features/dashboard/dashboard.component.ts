import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { IpcService } from '../../core/services/ipc.service';

/**
 * Dashboard placeholder page.
 *
 * Provides an application overview and verifies IPC connectivity on init.
 * No business data is loaded in this shell phase.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly ipcService = inject(IpcService);

  /** Reflects the IPC health-check result — updated asynchronously on init. */
  readonly ipcStatus = signal<string>('Checking IPC connection…');

  ngOnInit(): void {
    this.ipcService
      .ping()
      .then((response) =>
        this.ipcStatus.set(`IPC connected — response: "${response}"`)
      )
      .catch(() =>
        this.ipcStatus.set('IPC unavailable (running outside Electron)')
      );
  }
}
