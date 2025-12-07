import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { Vehicule } from '../../models/vehicule';
import {Categorievehicule} from "../../models/categorievehicule";

@Component({
  selector: 'app-add-vehicule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vehicule.component.html',
  styleUrls: ['./add-vehicule.component.scss']
})
export class AddVehiculeComponent implements OnInit {
  categories: Categorievehicule[] = [];

  vehicule: Vehicule = {
    id: 0,
    marque: '',
    modele: '',
    immatriculation: '',
    couleur: '',
    kilometrage: 0,
    carburant: 'ESSENCE',
    boiteVitesse: 'MANUELLE',
    nombrePlaces: 5,
    statut: 'DISPONIBLE'
  };

  selectedCategorieId: number | null = null;

  carburants = ['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'];
  boitesVitesse = ['MANUELLE', 'AUTOMATIQUE'];
  statuts = ['DISPONIBLE', 'LOUE', 'MAINTENANCE', 'HORS_SERVICE'];

  constructor(
    private vehiculeService: VehiculeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.vehiculeService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories chargées:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        alert('Erreur lors du chargement des catégories');
      }
    });
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      // Trouver la catégorie sélectionnée
      const selectedCategorie = this.categories.find(cat => cat.id === this.selectedCategorieId);
      if (!selectedCategorie) {
        alert('Veuillez sélectionner une catégorie');
        return;
      }

      // Préparer les données du véhicule
      // Le backend peut accepter soit l'objet complet, soit juste l'ID
      // On envoie l'objet complet mais on s'assure qu'il a bien un ID
      const vehiculeToAdd: any = {
        marque: this.vehicule.marque.trim(),
        modele: this.vehicule.modele.trim(),
        immatriculation: this.vehicule.immatriculation.trim(),
        couleur: this.vehicule.couleur?.trim() || null,
        kilometrage: this.vehicule.kilometrage || null,
        carburant: this.vehicule.carburant,
        boiteVitesse: this.vehicule.boiteVitesse,
        nombrePlaces: this.vehicule.nombrePlaces || 5,
        statut: this.vehicule.statut,
        categorie: {
          id: selectedCategorie.id
        }
      };
      
      console.log('Envoi du véhicule:', vehiculeToAdd);
      
      this.vehiculeService.addVehicule(vehiculeToAdd).subscribe({
        next: (createdVehicule) => {
          console.log('Véhicule créé:', createdVehicule);
          alert('Véhicule ajouté avec succès');
          this.router.navigate(['/vehicules']);
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
          alert('Erreur lors de l\'ajout: ' + errorMsg);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires (Marque, Modèle, Immatriculation, Catégorie)');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.vehicule.marque &&
      this.vehicule.modele &&
      this.vehicule.immatriculation &&
      this.selectedCategorieId
    );
  }

  cancel(): void {
    this.router.navigate(['/vehicules']);
  }
}
