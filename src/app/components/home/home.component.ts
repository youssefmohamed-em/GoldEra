import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "../shared/hero/hero.component";
import { StatsComponent } from "../shared/stats/stats.component";
import { ChartComponent } from "../shared/chart/chart.component";
import { PricesComponent } from "../shared/prices/prices.component";
import { ProductCategoriesComponent } from "../shared/product-categories/product-categories.component";
import { CartComponent } from "../cart/cart.component";
import { CartItemService } from '../../services/cart-item.service';
@Component({
  selector: 'app-home',
  imports: [RouterModule, HeroComponent, StatsComponent, ChartComponent, PricesComponent, ProductCategoriesComponent, ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss',
})
export class HomeComponent  implements OnInit{
cardData = [
    {
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption, cold storage, and multi-factor authentication protect your investments',
      // SVG الخاص بأيقونة الدرع
icon: 'pi pi-shield'   
 },
    {
      title: '24/7 Real-Time Support',
      description: 'Get assistance anytime, day or night, with instant responses and real-time guidance whenever you need it.',
      // SVG الخاص بأيقونة الساعة
      icon: 'pi pi-clock'
    },
    {
      title: 'Certified Pure Gold',
      description: 'All products certified by Assay and Weights Authority',
      // SVG الخاص بأيقونة النجمة/الشهادة
       icon: 'pi pi-star'
    },
    {
      title: 'Secure Delivery',
      description: 'Insured delivery to your doorstep or secure vault storage across Egypt',
      // SVG الخاص بأيقونة الشاحنة
      icon: 'pi pi-truck'
    },
  ];
  private cartService = inject(CartItemService);

ngOnInit(): void {
  this.cartService.loadMarketStatus();
}
}
