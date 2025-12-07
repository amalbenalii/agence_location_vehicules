import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import {Categorievehicule} from "../../models/categorievehicule";

@Component({
  selector: 'app-edit-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss']
})
export class EditCategorieComponent implements OnInit {
  categorieId!: number;
  categorie: Categorievehicule | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiculeService: VehiculeService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.categorieId = +this.route.snapshot.params['id'];
    this.loadCategorie();
  }

  loadCategorie(): void {
    this.vehiculeService.getCategorie(this.categorieId).subscribe({
      next: (data) => {
        this.categorie = data;
      },
      error: (error) => {
        console.error('Erreur chargement catégorie:', error);
        alert('Catégorie non trouvée');
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.categorie && this.isFormValid()) {
      // S'assurer que les champs optionnels sont définis
      if (!this.categorie.description) {
        this.categorie.description = '';
      }
      if (!this.categorie.caracteristiques) {
        this.categorie.caracteristiques = '';
      }
      
      this.vehiculeService.updateCategorie(this.categorie).subscribe({
        next: () => {
          alert('Catégorie mise à jour avec succès');
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Erreur:', error);
          alert('Erreur lors de la mise à jour: ' + (error.error?.message || error.message || 'Erreur inconnue'));
        }
      });
    } else {
      alert('Veuillez remplir le nom et le prix (supérieur à 0)');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.categorie &&
      this.categorie.nom &&
      this.categorie.prixParJour > 0
    );
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
