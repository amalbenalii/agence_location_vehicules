import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  currentUser: any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }

  // Méthodes publiques pour le template
  isClient(): boolean {
    return this.authService.isClient();
  }

  isGestionnaire(): boolean {
    return this.authService.isGestionnaire();
  }

  isAdmin(): boolean {
    return false;
  }

  isGestionnaireOrAdmin(): boolean {
    return this.authService.isGestionnaire();
  }
}
