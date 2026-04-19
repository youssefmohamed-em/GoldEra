import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { GoldPrice, GoldPricesService } from '../../gold-prices.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-gold-prices',
  imports: [RouterModule , CommonModule],
  templateUrl: './gold-prices.component.html',
  styleUrl: './gold-prices.component.scss',
})
export class GoldPricesComponent {
private goldService = inject(GoldPricesService);
goldPrices = signal<GoldPrice[]>([]);
isLoading = signal<boolean>(true);

lastUpdated = signal<Date | null>(null);
timeAgo = signal<string>('just now');


ngOnInit() {
    this.fetchPrices();
  }



fetchPrices() {
  this.goldService.getGoldPrices().subscribe({
    next: (data) => {
      this.goldPrices.set(data);
      this.isLoading.set(false);

      // خُد آخر تحديث من أول عنصر (أو أحدث عنصر)
      if (data?.length) {
        this.lastUpdated.set(new Date(data[0].lastUpdated));
        this.updateTimeAgo();
      }
    },
    error: (err) => {
      console.error('Error fetching gold prices:', err);
      this.isLoading.set(false);
    }
  });
}
updateTimeAgo() {
  const update = () => {
    const last = this.lastUpdated();
    if (!last) return;

    const diffMs = new Date().getTime() - last.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) {
      this.timeAgo.set('just now');
    } else if (diffMin < 60) {
      this.timeAgo.set(`${diffMin}m ago`);
    } else {
      const diffHr = Math.floor(diffMin / 60);
      this.timeAgo.set(`${diffHr}h ago`);
    }
  };

  update();
  setInterval(update, 30000); // تحديث كل 30 ثانية
}
}
