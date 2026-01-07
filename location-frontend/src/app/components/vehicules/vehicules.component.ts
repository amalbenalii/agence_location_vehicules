import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { AuthService } from '../../services/auth.service';
import { Vehicule} from '../../models/vehicule';
import {Categorievehicule} from "../../models/categorievehicule";

@Component({
  selector: 'app-vehicules',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vehicules.component.html',
  styleUrls: ['./vehicules.component.scss']
})
export class VehiculesComponent implements OnInit {
  vehicules: Vehicule[] = [];
  categories: Categorievehicule[] = [];

  searchMarque: string = '';
  selectedCategorie: number | null = null;
  selectedStatut: string = '';

  statuts = ['DISPONIBLE', 'LOUE', 'MAINTENANCE', 'HORS_SERVICE'];
  carburants = ['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'];
  boitesVitesse = ['MANUELLE', 'AUTOMATIQUE'];

  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private vehiculeService: VehiculeService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicules();
    this.loadCategories();
  }

  loadVehicules(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.vehiculeService.getVehicules().subscribe({
      next: (data) => {
        this.vehicules = data;
        this.isLoading = false;
        console.log('Véhicules chargés:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des véhicules:', error);
        this.errorMessage = 'Erreur lors du chargement des véhicules. Vérifiez que le serveur est démarré sur le port 8090.';
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  loadCategories(): void {
    this.vehiculeService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories chargées:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.errorMessage = 'Erreur lors du chargement des catégories.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  onSearch(): void {
    if (this.searchMarque) {
      this.vehiculeService.getVehiculesByMarque(this.searchMarque).subscribe({
        next: (data) => this.vehicules = data
      });
    } else {
      this.loadVehicules();
    }
  }

  onCategorieChange(): void {
    if (this.selectedCategorie) {
      this.vehiculeService.getVehiculesByCategorie(this.selectedCategorie).subscribe({
        next: (data) => this.vehicules = data
      });
    } else {
      this.loadVehicules();
    }
  }

  onStatutChange(): void {
    if (this.selectedStatut) {
      this.vehiculeService.getVehiculesByStatut(this.selectedStatut).subscribe({
        next: (data) => this.vehicules = data
      });
    } else {
      this.loadVehicules();
    }
  }

  deleteVehicule(id: number): void {
    if (confirm('Supprimer ce véhicule ?')) {
      this.vehiculeService.deleteVehicule(id).subscribe({
        next: () => {
          this.successMessage = 'Véhicule supprimé avec succès';
          this.loadVehicules();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue');
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  getStatutClass(statut: string): string {
    return `badge-${statut.toLowerCase()}`;
  }

  onCardHover(event: MouseEvent, isEnter: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = isEnter ? 'translateY(-5px)' : 'translateY(0)';
    }
  }
}
