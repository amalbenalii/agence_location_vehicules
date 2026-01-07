import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <!-- Navbar uniquement pour les utilisateurs connectés -->
    <nav *ngIf="isLoggedIn$ | async" class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/dashboard">
          <i class="bi bi-car-front me-2"></i>
          Location Véhicules
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="bi bi-speedometer2 me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/vehicules" routerLinkActive="active">
                <i class="bi bi-car-front me-1"></i>Véhicules
              </a>
            </li>
            <li class="nav-item" *ngIf="authService.isGestionnaire()">
              <a class="nav-link" routerLink="/categories" routerLinkActive="active">
                <i class="bi bi-tags me-1"></i>Catégories
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/reservations" routerLinkActive="active">
                <i class="bi bi-calendar-check me-1"></i>{{ authService.isClient() ? 'Mes Réservations' : 'Réservations' }}
              </a>
            </li>
            <li class="nav-item" *ngIf="authService.isGestionnaire()">
              <a class="nav-link" routerLink="/agences" routerLinkActive="active">
                <i class="bi bi-building me-1"></i>Agences
              </a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userMenu" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>
                {{ (currentUser$ | async)?.prenom }} {{ (currentUser$ | async)?.nom }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li><a class="dropdown-item" routerLink="/profile">
                  <i class="bi bi-person me-2"></i>Profil
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="logout(); $event.preventDefault()" style="cursor: pointer;">
                  <i class="bi bi-box-arrow-right me-2"></i>Déconnexion
                </a></li>
              </ul>
            </li>
            
            <li class="nav-item d-flex align-items-center">
              <button class="btn btn-outline-light btn-sm ms-2" (click)="logout()" title="Déconnexion" type="button">
                <i class="bi bi-box-arrow-right me-1"></i>
                <span class="d-none d-md-inline">Déconnexion</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main [class.container]="isLoggedIn$ | async" [class.mt-4]="isLoggedIn$ | async">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `.navbar-nav .nav-link.active { font-weight: bold; text-decoration: underline; }`
  ]
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;
  currentUser$ = this.authService.currentUser$;

  constructor(public authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.currentUser$.pipe(
      map((user: any) => !!user)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
