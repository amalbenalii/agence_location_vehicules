import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VehiculeService, PaginationResponse } from '../../services/vehicule.service';
import { Vehicule } from '../../models/vehicule';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PublicNavbarComponent, PaginationComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  vehicules: Vehicule[] = [];
  isLoading = false;
  filteredVehicules: Vehicule[] = [];
  searchTerm = '';
  pagination: PaginationResponse | null = null;
  currentPage = 0;
  pageSize = 6;  // Changé de 12 à 6
  sortBy = 'id';
  sortDir = 'asc';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private vehiculeService: VehiculeService
  ) {}

  ngOnInit(): void {
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.redirectToDashboard();
      return;
    }
    this.loadVehicules();
  }

  loadVehicules(): void {
    this.isLoading = true;
    this.vehiculeService.getAvailableVehiculesPaginated(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        this.pagination = response;
        // Plus besoin de filtrer côté client - le backend fait déjà le filtrage
        this.vehicules = response.content;
        this.filteredVehicules = this.vehicules;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement véhicules:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVehicules();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 0; // Reset to first page
    this.loadVehicules();
  }

  onSortChange(sortBy: string, sortDir: string): void {
    this.sortBy = sortBy;
    this.sortDir = sortDir;
    this.currentPage = 0; // Reset to first page
    this.loadVehicules();
  }

  onSearch(): void {
    this.isLoading = true;
    
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.loadVehicules();
      return;
    }
    
    const term = this.searchTerm.trim();
    
    this.vehiculeService.searchAvailableVehiculesPaginated(term, this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        this.pagination = response;
        // Plus besoin de filtrer côté client - le backend fait déjà le filtrage
        this.vehicules = response.content;
        this.filteredVehicules = this.vehicules;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur recherche véhicules:', error);
        this.isLoading = false;
      }
    });
  }

  redirectToDashboard(): void {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'CLIENT' || user?.role === 'GESTIONNAIRE') {
      this.router.navigate(['/dashboard']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  viewVehiculeDetails(id?: number): void {
    if (id) {
      this.router.navigate(['/vehicule', id]);
    }
  }

  quickReserve(id?: number): void {
    if (id) {
      // Redirect to login first, then to reservation
      this.router.navigate(['/login'], { queryParams: { redirect: '/add-reservation', vehicleId: id } });
    }
  }

  formatKilometrage(km?: number): string {
    if (!km) return 'N/A';
    if (km >= 1000) {
      return (km / 1000).toFixed(1) + 'k km';
    }
    return km + ' km';
  }

  onCardHover(event: MouseEvent, isHovering: boolean): void {
    const element = event.currentTarget as HTMLElement;
    if (element) {
      element.style.transform = isHovering ? 'translateY(-5px)' : 'translateY(0)';
    }
  }
}
