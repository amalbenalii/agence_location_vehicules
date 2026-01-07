import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { AgenceService } from '../../services/agence.service';
import { Vehicule } from '../../models/vehicule';
import { Categorievehicule } from "../../models/categorievehicule";
import { Agence } from '../../models/reservation.model';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-add-vehicule',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './add-vehicule.component.html',
  styleUrls: ['./add-vehicule.component.scss']
})
export class AddVehiculeComponent implements OnInit {
  categories: Categorievehicule[] = [];
  agences: Agence[] = [];

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
  selectedAgenceId: number | null = null;
  selectedImageFile?: File;
  isUploadingImage = false;

  carburants = ['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'];
  boitesVitesse = ['MANUELLE', 'AUTOMATIQUE'];
  statuts = ['DISPONIBLE', 'LOUE', 'MAINTENANCE', 'HORS_SERVICE'];

  constructor(
    private vehiculeService: VehiculeService,
    private agenceService: AgenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAgences();
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

  loadAgences(): void {
    this.agenceService.getAllAgences().subscribe({
      next: (data: Agence[]) => {
        this.agences = data;
        console.log('Agences chargées:', data);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des agences:', error);
        alert('Erreur lors du chargement des agences');
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

      // Trouver l'agence sélectionnée
      const selectedAgence = this.agences.find((ag: Agence) => ag.id === this.selectedAgenceId);
      if (!selectedAgence) {
        alert('Veuillez sélectionner une agence');
        return;
      }

      // Préparer les données du véhicule
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
        },
        agence: {
          id: selectedAgence.id
        }
      };
      
      console.log('Envoi du véhicule:', vehiculeToAdd);
      
      this.vehiculeService.addVehicule(vehiculeToAdd).subscribe({
        next: (createdVehicule) => {
          console.log('Véhicule créé:', createdVehicule);
          
          // Upload image if selected
          if (this.selectedImageFile && createdVehicule.id) {
            this.uploadImage(createdVehicule.id);
          } else {
            alert('Véhicule ajouté avec succès');
            this.router.navigate(['/vehicules']);
          }
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
          alert('Erreur lors de l\'ajout: ' + errorMsg);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires (Marque, Modèle, Immatriculation, Catégorie, Agence)');
    }
  }

  onImageSelected(file: File): void {
    this.selectedImageFile = file;
  }

  onImageRemoved(): void {
    this.selectedImageFile = undefined;
  }

  private uploadImage(vehiculeId: number): void {
    if (!this.selectedImageFile) return;

    this.isUploadingImage = true;
    this.vehiculeService.uploadVehiculeImage(vehiculeId, this.selectedImageFile).subscribe({
      next: (response) => {
        console.log('Image uploaded:', response);
        this.isUploadingImage = false;
        alert('Véhicule ajouté avec succès (image téléchargée)');
        this.router.navigate(['/vehicules']);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.isUploadingImage = false;
        alert('Véhicule ajouté mais erreur lors du téléchargement de l\'image');
        this.router.navigate(['/vehicules']);
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.vehicule.marque &&
      this.vehicule.modele &&
      this.vehicule.immatriculation &&
      this.selectedCategorieId &&
      this.selectedAgenceId
    );
  }

  cancel(): void {
    this.router.navigate(['/vehicules']);
  }
}
