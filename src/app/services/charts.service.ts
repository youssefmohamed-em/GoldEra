import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';


export interface GoldPriceSummary {
  priceDate: string;
  minSellPrice: number;
  purity: 'K18' | 'K21' | 'K24';
}

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  private http = inject(HttpClient);
  private configService= inject(ConfigService);

  getGoldPriceSummary(amount: number ,type : 'DAY' | 'WEEK' | 'MONTH' = 'DAY') :Observable<GoldPriceSummary[]> {
     return this.http.get<GoldPriceSummary[]>(
      `${this.configService.baseUrl}/public/gold-prices/summary?amount=${amount}&type=${type}`
    );
    // Implementation for fetching gold price summary
  }
}
