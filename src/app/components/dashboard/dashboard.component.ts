import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../shared/header/header.component";
import { CartItemService } from '../../services/cart-item.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, RouterOutlet, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent  implements OnInit{
  private cartService = inject(CartItemService) ;



ngOnInit(): void {
  this.cartService.loadMarketStatus();
}
}
