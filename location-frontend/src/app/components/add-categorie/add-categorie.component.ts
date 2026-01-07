import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import {Categorievehicule} from "../../models/categorievehicule";


@Component({
  selector: 'app-add-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.scss']
})
export class AddCategorieComponent {
  newCategorie: Categorievehicule = {
    nom: '',
    description: '',
    prixParJour: 0,
    caracteristiques: ''
  };

  constructor(
    private vehiculeService: VehiculeService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isFormValid()) {
      // Préparer les données
      const categorieToAdd: any = {
        nom: this.newCategorie.nom.trim(),
        description: this.newCategorie.description?.trim() || '',
        prixParJour: this.newCategorie.prixParJour,
        caracteristiques: this.newCategorie.caracteristiques?.trim() || ''
      };
      
      console.log('Envoi de la catégorie:', categorieToAdd);
      
      this.vehiculeService.addCategorie(categorieToAdd).subscribe({
        next: (createdCategorie) => {
          console.log('Catégorie créée:', createdCategorie);
          alert('Catégorie ajoutée avec succès');
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
          alert('Erreur lors de l\'ajout: ' + errorMsg);
        }
      });
    } else {
      alert('Veuillez remplir le nom et le prix (supérieur à 0)');
    }
  }

  isFormValid(): boolean {
    return !!(this.newCategorie.nom && this.newCategorie.prixParJour > 0);
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
