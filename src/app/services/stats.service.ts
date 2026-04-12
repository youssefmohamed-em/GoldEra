import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { map, Observable } from 'rxjs';




export interface SiteStat {
  id: number;
  stat_key: string;
  stat_label_en: string;
  stat_label_ar: string;
  stat_value: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface TermsResponse {
  id: number;
  key: string;
  contentAr: string;
  contentEn: string;
  active: boolean;
  createdAt: string;
}
@Injectable({
  providedIn: 'root',
})

export class StatsService {
  private http = inject(HttpClient);
  private configService= inject(ConfigService);
    getSiteStats(lang: 'en' | 'ar' = 'en'): Observable<SiteStat[]> {
    return this.http
      .get<TermsResponse>(
        `${this.configService.baseUrl}/public/terms?key=SITE_STATS`
      )
      .pipe(
        map((res) => {
          const content =
            lang === 'ar' ? res.contentAr : res.contentEn;

          return JSON.parse(content) as SiteStat[];
        })
      );
  }
  
}
