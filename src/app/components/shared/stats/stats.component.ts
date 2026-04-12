import { Component, inject, OnInit, signal } from '@angular/core';
import { SiteStat, StatsService } from '../../../services/stats.service';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent  implements OnInit {
  private statsService = inject(StatsService);
  stats = signal<SiteStat[]>([]);
   ngOnInit(): void {
    this.statsService.getSiteStats('en').subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('❌ Error:', err),
    });
  }

}
