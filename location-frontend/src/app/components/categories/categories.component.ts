import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import {Categorievehicule} from "../../models/categorievehicule";


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Categorievehicule[] = [];

  // Pour les messages
  successMessage: string = '';
  errorMessage: string = '';

  // Pour le chargement
  isLoading = false;

  constructor(
    private vehiculeService: VehiculeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Charger toutes les catégories
  loadCategories(): void {
    this.isLoading = true;
    this.vehiculeService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.showError('Erreur lors du chargement des catégories');
        this.isLoading = false;
      }
    });
  }

  // Supprimer une catégorie
  deleteCategorie(id: number, nom: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${nom}" ?`)) {
      this.vehiculeService.deleteCategorie(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(cat => cat.id !== id);
          this.showSuccess('Catégorie supprimée avec succès !');
        },
        error: (error) => {
          this.showError('Erreur lors de la suppression: ' + error.message);
        }
      });
    }
  }




  // Afficher un message de succès
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  // Afficher un message d'erreur
  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }


}
