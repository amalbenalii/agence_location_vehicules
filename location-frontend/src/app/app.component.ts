import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-car-front me-2"></i>
          Location Véhicules
        </a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/vehicules" routerLinkActive="active">
            Véhicules
          </a>
          <a class="nav-link" routerLink="/categories" routerLinkActive="active">
            Catégories
          </a>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar-nav .nav-link.active {
      font-weight: bold;
      text-decoration: underline;
    }
  `]
})
export class AppComponent {
  title = 'Location Véhicules';
}
