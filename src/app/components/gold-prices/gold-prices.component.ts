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


ngOnInit() {
    this.fetchPrices();
  }



fetchPrices() {
    this.goldService.getGoldPrices().subscribe({
      next: (data) => {
        // تحديث الـ Signal بالبيانات الجديدة
        this.goldPrices.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching gold prices:', err);
        this.isLoading.set(false);
      }
    });
  }
}
