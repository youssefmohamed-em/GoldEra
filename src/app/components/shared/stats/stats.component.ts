import { Component, inject, OnInit, signal ,effect } from '@angular/core';
import { SiteStat, StatsService } from '../../../services/stats.service';
import { TranslateService } from '../../../services/translate.service';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {

  private statsService = inject(StatsService);
  private translate = inject(TranslateService);

  stats = signal<SiteStat[]>([]);

  lang = this.translate.lang;

   ngOnInit(): void {

    this.loadStats();

    // 🔥 reactive language change
    effect(() => {
      this.lang(); // track signal

      this.loadStats();
    });
  }

  loadStats() {
    const currentLang = this.translate.lang();

    this.statsService.getSiteStats(currentLang).subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('❌ Error:', err),
    });
  }
  getLabel(stat: any) {
  return this.lang() === 'ar'
    ? stat.stat_label_ar
    : stat.stat_label_en;
}
}