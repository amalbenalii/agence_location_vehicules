import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { AgenceService } from '../../services/agence.service';
import { Vehicule } from '../../models/vehicule';
import { Categorievehicule } from "../../models/categorievehicule";
import { Agence } from '../../models/reservation.model';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-edit-vehicule',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './edit-vehicule.component.html',
  styleUrls: ['./edit-vehicule.component.scss']
})
export class EditVehiculeComponent implements OnInit {
  vehiculeId!: number;
  vehicule: Vehicule | null = null;
  categories: Categorievehicule[] = [];
  agences: Agence[] = [];

  carburants = ['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'];
  boitesVitesse = ['MANUELLE', 'AUTOMATIQUE'];
  statuts = ['DISPONIBLE', 'LOUE', 'MAINTENANCE', 'HORS_SERVICE'];

  selectedImageFile?: File;
  isUploadingImage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiculeService: VehiculeService,
    private agenceService: AgenceService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL (s'abonner pour être sûr du paramètre)
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      this.vehiculeId = idStr ? Number(idStr) : NaN;
      console.log('Param id route:', idStr, 'parsed:', this.vehiculeId);

      if (!idStr || isNaN(this.vehiculeId) || this.vehiculeId <= 0) {
        alert('Identifiant de véhicule invalide.');
        this.router.navigate(['/vehicules']);
        return;
      }

      this.loadVehicule();
      this.loadCategories();
      this.loadAgences();
    });
  }

  loadVehicule(): void {
    this.vehiculeService.getVehicule(this.vehiculeId).subscribe({
      next: (data) => {
        this.vehicule = data;
        console.log('Véhicule chargé:', data);
      },
      error: (error) => {
        console.error('Erreur chargement véhicule:', error);
        if (error?.status === 401) {
          alert('Non authentifié. Veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        } else if (error?.status === 403) {
          alert('Accès refusé. Vous n\'avez pas la permission.');
          this.router.navigate(['/vehicules']);
        } else if (error?.status === 404) {
          alert('Véhicule introuvable.');
          this.router.navigate(['/vehicules']);
        } else {
          const msg = error?.error?.message || error?.message || 'Erreur lors du chargement du véhicule';
          alert(msg);
          this.router.navigate(['/vehicules']);
        }
      }
    });
  }

  loadCategories(): void {
    this.vehiculeService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Erreur chargement catégories:', error)
    });
  }

  loadAgences(): void {
    this.agenceService.getAllAgences().subscribe({
      next: (data: Agence[]) => this.agences = data,
      error: (error: any) => console.error('Erreur chargement agences:', error)
    });
  }

  onSubmit(): void {
    if (this.vehicule && this.isFormValid()) {
      // Préparer les données
      const vehiculeToUpdate: any = {
        id: this.vehicule.id,
        marque: this.vehicule.marque.trim(),
        modele: this.vehicule.modele.trim(),
        immatriculation: this.vehicule.immatriculation.trim(),
        couleur: this.vehicule.couleur?.trim() || null,
        kilometrage: this.vehicule.kilometrage || null,
        carburant: this.vehicule.carburant,
        boiteVitesse: this.vehicule.boiteVitesse,
        nombrePlaces: this.vehicule.nombrePlaces || 5,
        statut: this.vehicule.statut,
        imageUrl: this.vehicule.imageUrl, // Preserve existing image URL
        categorie: this.vehicule.categorie ? {
          id: this.vehicule.categorie.id
        } : null,
        agence: this.vehicule.agence ? {
          id: this.vehicule.agence.id
        } : null
      };

      console.log('Mise à jour du véhicule:', vehiculeToUpdate);

      this.vehiculeService.updateVehicule(vehiculeToUpdate).subscribe({
        next: (updatedVehicule) => {
          console.log('Véhicule mis à jour:', updatedVehicule);
          
          // Upload image if selected
          if (this.selectedImageFile && updatedVehicule.id) {
            this.uploadImage(updatedVehicule.id);
          } else {
            alert('Véhicule mis à jour avec succès');
            this.router.navigate(['/vehicules']);
          }
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
          alert('Erreur lors de la mise à jour: ' + errorMsg);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.vehicule &&
      this.vehicule.marque &&
      this.vehicule.modele &&
      this.vehicule.immatriculation &&
      this.vehicule.categorie?.id &&
      this.vehicule.agence?.id
    );
  }

  cancel(): void {
    this.router.navigate(['/vehicules']);
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
        alert('Véhicule mis à jour avec succès (image téléchargée)');
        this.router.navigate(['/vehicules']);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.isUploadingImage = false;
        alert('Véhicule mis à jour mais erreur lors du téléchargement de l\'image');
        this.router.navigate(['/vehicules']);
      }
    });
  }

  getImageFilename(): string {
    if (!this.vehicule?.imageUrl) return '';
    // Extract filename from URL like "/uploads/filename.jpg"
    return this.vehicule.imageUrl.substring(this.vehicule.imageUrl.lastIndexOf('/') + 1);
  }
}
