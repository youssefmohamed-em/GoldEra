import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
export interface Config {
  baseUrl: string;
  uploadUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config?: Config;

  private readonly fallbackConfig: Config = {
    baseUrl: 'https://dhabk-api-uat.79-pay.com/goldera',
    uploadUrl: 'uplaod/gcp',
  };

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<Config> {
    return firstValueFrom(
      this.http.get<Config>('/assets/config.json')
    )
      .then((config) => {
        this.config = config;
        console.log('✅ Config loaded:', config);
        return config;
      })
      .catch((error) => {
        console.error('❌ Config load failed:', error);

        this.config = this.fallbackConfig;

        console.warn('⚠️ Using fallback config:', this.config);
        return this.config;
      });
  }

  private getConfig(): Config {
    if (!this.config) {
      // مهم جدًا مع interceptor
      throw new Error('❌ Config not initialized! Check APP_INITIALIZER');
    }
    return this.config;
  }

  get baseUrl(): string {
    return this.getConfig().baseUrl;
  }

  get uploadUrl(): string {
    return this.getConfig().uploadUrl;
  }
}