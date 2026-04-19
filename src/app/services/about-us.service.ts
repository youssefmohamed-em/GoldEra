import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

export interface AboutPage {
  id: number;
  slug: string;
  sections: Section[];
}

export interface Section {
  id: number;
  imgStyle: string;
  image: string;
  items: Item[];
}

export interface Item {
  title: {
    ar: string;
    en: string;
  };
  content: {
    ar: string;
    en: string;
  };
  style: string;
}

@Injectable({
  providedIn: 'root',
})
export class AboutUsService {
 private http = inject(HttpClient);
 private config = inject(ConfigService);
 

getAboutPage(): Observable<AboutPage> {
  return this.http.get<AboutPage>(
    `${this.config.baseUrl}/public/pages/about-us`
  );
}
}
