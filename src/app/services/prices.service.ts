import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface Price {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionEn: string | null;
  descriptionAr?: string | null;
  purity?: string;
  currentSellPrice?: number;
  currentBuyPrice?: number;
  currency?: string;
  lastUpdated?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PricesService {
   private http = inject(HttpClient);
  private config = inject(ConfigService);
   private readonly base = `${this.config.baseUrl}/public/gold-prices`;


   getPrices(): Observable<Price[]> {
    return this.http.get<Price[]>(this.base);
  }

}