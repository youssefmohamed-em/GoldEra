import { Component, inject, OnInit, signal } from '@angular/core';
import { UserOrderService } from '../../services/user-order.service';
import { StatsService } from '../../services/stats.service';
import { ActivatedRoute } from '@angular/router';
import { GoldPricesService } from '../../gold-prices.service';
import { CartItemService } from '../../services/cart-item.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent  implements OnInit{
  // ================= inject =============================
  private userorder= inject(UserOrderService);
  private goldprice = inject (GoldPricesService); 
  private cartitem = inject (CartItemService);
 private stats = inject(StatsService); 
 private  route  = inject (ActivatedRoute );
 private router = inject(Router);

// =================== signals  ==================================

 orderNumber = signal<string | null>(null);
  order = signal<any> (null);
   loading = signal(false);
   selectedFile: File | null = null;
isLoading = signal(false);

onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.selectedFile = file;
  }
}


getFileSize(size: number) {
  return (size / 1024 / 1024).toFixed(2) + ' MB';
}

uploadProof() {
  if (!this.selectedFile) return;

  const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
  if (!orderNumber) return;

  this.isLoading.set(true);

  this.userorder.verifyOrder(orderNumber, this.selectedFile)
    .subscribe({
      next: (res) => {
        console.log('Upload success:', res);
        this.isLoading.set(false);

        this.selectedFile = null;

        // ✅ redirect بعد النجاح
        this.router.navigate(['/dashboard/profile-orders']);
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.isLoading.set(false);
      }
    });
}
   ngOnInit(): void {
  this.stats.getSiteStats();

  const orderNumber = this.route.snapshot.paramMap.get('orderNumber');

  this.orderNumber.set(orderNumber);

  if (orderNumber) {
    this.loadOrder(orderNumber);
  }

  this.goldprice.getcurrentGoldPrices();
  this.cartitem.loadCart();
  this.cartitem.loadMarketStatus();
}
  loadOrder(orderNumber: string) {
    this.loading.set(true);

    this.userorder.getOrderByNumber(orderNumber)
      .subscribe({
        next: (res) => {
          this.order.set(res.content[0]);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
  }

}
