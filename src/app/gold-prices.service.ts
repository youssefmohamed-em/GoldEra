import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './services/config.service';
import { Observable } from 'rxjs';

export interface GoldPrice {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  purity: string;
  currentSellPrice: number;
  currentBuyPrice: number;
  currency: string;
  lastUpdated: string;
}
@Injectable({
  providedIn: 'root',
})
export class GoldPricesService {
  private http= inject(HttpClient);
  private config = inject (ConfigService);

    getGoldPrices(): Observable<GoldPrice[]> {
    const url = `${this.config.baseUrl}/public/gold-prices`;
    return this.http.get<GoldPrice[]>(url);
  }
getcurrentGoldPrices(): Observable<GoldPrice[]> {
  const url = `${this.config.baseUrl}/public/gold-prices/current`;
  return this.http.get<GoldPrice[]>(url);
}
}
