import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private config = inject(ConfigService);
  private http = inject(HttpClient);

  private get authUrl(): string {
    return `${this.config.baseUrl}/public/auth`;
  }
  private get protectedUrl(): string {
  return `${this.config.baseUrl}/protected`;
}

  /**
   * Login API
   */
  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, data);
  }

  /**
   * Save token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Create auth headers
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders(
      token
        ? { Authorization: `Bearer ${token}` }
        : {}
    );
  }
  saveCurrentUser(user: any): void {
  localStorage.setItem('current_user', JSON.stringify(user));
}

register(data: any): Observable<any> {
  return this.http.post(`${this.authUrl}/register`, data);
}

getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

saveRefreshToken(token: string) {
  localStorage.setItem('refresh_token', token);
}

refreshToken(refreshToken: string) {
  return this.http.post('YOUR_API/refresh', {
    refresh_token: refreshToken
  });
}
isTokenExpired(token: string): boolean {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
}
getCurrentUser(): any {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
}

getUserAddresses(): Observable<any> {
  return this.http.get(
    `${this.protectedUrl}/user-addresses`,
  );
}
addUserAddress(data: any): Observable<any> {
  return this.http.post(
    `${this.protectedUrl}/user-addresses`,
    data
  );
}
}