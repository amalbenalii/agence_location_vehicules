import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  adresse?: string;
  role?: 'CLIENT' | 'GESTIONNAIRE';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  role: 'CLIENT' | 'GESTIONNAIRE';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Vérifier si l'utilisateur est toujours connecté au démarrage
    const token = localStorage.getItem('token');
    if (token && this.isTokenExpired(token)) {
      this.logout();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isClient(): boolean {
    return this.getCurrentUser()?.role === 'CLIENT';
  }

  isGestionnaire(): boolean {
    return this.getCurrentUser()?.role === 'GESTIONNAIRE';
  }

  isAdmin(): boolean {
    return false;
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }
}
