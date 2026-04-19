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
import { FooterComponent } from "../shared/footer/footer.component";
import { StreamService } from '../../services/stream.service';
import { TranslateService } from '../../services/translate.service';
@Component({
  selector: 'app-home',
  imports: [RouterModule, HeroComponent, StatsComponent, ChartComponent, PricesComponent, ProductCategoriesComponent, FooterComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss',
})
export class HomeComponent  implements OnInit{
  private streamService = inject(StreamService);
  private translate =  inject(TranslateService);
cardData = [
  {
    title: 'CARD_SECURITY_TITLE',
    description: 'CARD_SECURITY_DESC',
    icon: 'pi pi-shield'
  },
  {
    title: 'CARD_SUPPORT_TITLE',
    description: 'CARD_SUPPORT_DESC',
    icon: 'pi pi-clock'
  },
  {
    title: 'CARD_CERTIFIED_TITLE',
    description: 'CARD_CERTIFIED_DESC',
    icon: 'pi pi-star'
  },
  {
    title: 'CARD_DELIVERY_TITLE',
    description: 'CARD_DELIVERY_DESC',
    icon: 'pi pi-truck'
  }
];
  private cartService = inject(CartItemService);

ngOnInit(): void {
  this.cartService.loadMarketStatus();
}

t(key: string) {
  return this.translate.translate(key);
}
}
