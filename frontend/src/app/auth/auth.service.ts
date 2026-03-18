import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'flashcards_token';

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));
  private readonly emailSignal = signal<string | null>(localStorage.getItem('flashcards_email'));

  readonly isLoggedIn = computed(() => !!this.tokenSignal());
  readonly email = computed(() => this.emailSignal());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  register(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, { email, password }).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('flashcards_email');
    this.tokenSignal.set(null);
    this.emailSignal.set(null);
  }

  getToken() {
    return this.tokenSignal();
  }

  private storeSession(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem('flashcards_email', response.email);
    this.tokenSignal.set(response.token);
    this.emailSignal.set(response.email);
  }
}
