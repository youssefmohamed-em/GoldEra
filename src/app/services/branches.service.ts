import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface Branch {
  id: number;

  nameAr: string;
  nameEn: string;

  streetAr?: string;
  streetEn?: string;

  phoneNumber?: string;

  isActive?: boolean;

  locationUrl?: string;

  country?: {
    id: number;
    nameAr: string;
    nameEn: string;
    code?: string;
  };

  state?: {
    id: number;
    nameAr: string;
    nameEn: string;
    code?: string;
  };

  city?: {
    id: number;
    nameAr: string;
    nameEn: string;
    code?: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

   getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.config.baseUrl}/public/branches`);
  }

}
