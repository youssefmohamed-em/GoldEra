import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../shared/header/header.component";
import { CartItemService } from '../../services/cart-item.service';
import { FooterComponent } from "../shared/footer/footer.component";
import { StreamService } from '../../services/stream.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent  implements OnInit{
  private cartService = inject(CartItemService) ;
  private streamService = inject(StreamService);
 goldData: any;


ngOnInit(): void {

  this.cartService.loadMarketStatus();

  this.streamService.connect().subscribe({
    next: (data) => {
      this.goldData = data;
      console.log('🔥 Live Gold:', data);
    },
    error: (err) => {
      console.error('Stream error:', err);
    }
  });
}

ngOnDestroy(): void {
  this.streamService.disconnect();
}
}
