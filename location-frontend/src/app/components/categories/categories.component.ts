import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategorieService } from '../../services/categorie.service';
import { AuthService } from '../../services/auth.service';
import { CategorieVehicule } from '../../models/reservation.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  title = 'Gestion des Catégories';
  categories: CategorieVehicule[] = [];
  loading = false;
  error = '';

  constructor(
    private categorieService: CategorieService, 
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categorieService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories';
        this.loading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  editCategorie(id: number): void {
    this.router.navigate(['/edit-categorie', id]);
  }

  deleteCategorie(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la catégorie';
          console.error('Error deleting categorie:', err);
        }
      });
    }
  }

  addCategorie(): void {
    this.router.navigate(['/add-categorie']);
  }

  onCardHover(event: MouseEvent, isEnter: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = isEnter ? 'translateY(-5px)' : 'translateY(0)';
    }
  }
}
