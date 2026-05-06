import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AutenticacaoDefaultResponse,
  AutenticacaoRequest,
  AutenticacaoResponse,
} from '../../features/auth/models/auth.model';

const TOKEN_KEY = 'cgaf_token';
const AUTH_KEY = 'cgaf_auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  /** Signals for reactive state */
  private readonly _auth = signal<AutenticacaoResponse | null>(this.loadAuthFromStorage());
  private readonly _isLoading = signal(false);
  private readonly _loginError = signal<string | null>(null);

  /** Public readonly signals */
  readonly currentUser = this._auth.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly loginError = this._loginError.asReadonly();
  readonly isAuthenticated = computed(() => !!this._auth() && !!this.getToken());
  readonly isAdmin = computed(() => this._auth()?.perfil === 'ADMIN');
  readonly isUser = computed(() => this._auth()?.perfil === 'USER');

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) { }

  /**
   * Performs login against POST /auth/login.
   * Stores the JWT token from data.token in localStorage.
   */
  login(credentials: AutenticacaoRequest): Observable<AutenticacaoDefaultResponse> {
    this._isLoading.set(true);
    this._loginError.set(null);

    return this.http.post<AutenticacaoDefaultResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        const auth = response.data;
        localStorage.setItem(TOKEN_KEY, auth.token);
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
        this._auth.set(auth);

        const target = this.isAdmin() ? '/admin/dashboard' : '/colaborador/dashboard';
        this.router.navigate([target]);
      }),
      catchError((error) => {
        const message =
          error?.error?.message || 'Erro no servidor. Tente novamente mais tarde.';
        this._loginError.set(message);
        return throwError(() => error);
      }),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Logs out the user, removes stored data, and navigates to login.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
    this._auth.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Returns the stored JWT token.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Checks if a user is logged in.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Clears login error state.
   */
  clearError(): void {
    this._loginError.set(null);
  }

  authConfig(): AutenticacaoResponse | null {
    return this._auth();
  }

  /**
   * Loads user from localStorage on service init.
   */
  private loadAuthFromStorage(): AutenticacaoResponse | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
