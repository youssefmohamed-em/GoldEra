import { Component, inject, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Price, PricesService } from '../../../services/prices.service';
import { DatePipe } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-prices',
  imports: [RouterModule, DatePipe],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss',
})
export class PricesComponent {

  private pricesService = inject(PricesService);
private router = inject(Router);
  prices = signal<Price[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
constructor() {
this.loadPrices();
}

 loadPrices() {
    this.loading.set(true);
    this.error.set(null);

    this.pricesService.getPrices().subscribe({
      next: (data) => {
        this.prices.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load prices');
        this.loading.set(false);
      }
    });
  }
 goToMakingCharges() {
    // scroll smooth للأول
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // بعد scroll روح للصفحة
    setTimeout(() => {
      this.router.navigate(['/dashboard/making-charges']);
    }, 400); // وقت بسيط عشان الإحساس يبقى smooth
  }
}