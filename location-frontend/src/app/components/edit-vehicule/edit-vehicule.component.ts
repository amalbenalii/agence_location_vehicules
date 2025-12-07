import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { Vehicule } from '../../models/vehicule';
import {Categorievehicule} from "../../models/categorievehicule";

@Component({
  selector: 'app-edit-vehicule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-vehicule.component.html',
  styleUrls: ['./edit-vehicule.component.scss']
})
export class EditVehiculeComponent implements OnInit {
  vehiculeId!: number;
  vehicule: Vehicule | null = null;
  categories: Categorievehicule[] = [];

  carburants = ['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'];
  boitesVitesse = ['MANUELLE', 'AUTOMATIQUE'];
  statuts = ['DISPONIBLE', 'LOUE', 'MAINTENANCE', 'HORS_SERVICE'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiculeService: VehiculeService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.vehiculeId = +this.route.snapshot.params['id'];

    this.loadVehicule();
    this.loadCategories();
  }

  loadVehicule(): void {
    this.vehiculeService.getVehicule(this.vehiculeId).subscribe({
      next: (data) => {
        this.vehicule = data;
        console.log('Véhicule chargé:', data);
      },
      error: (error) => {
        console.error('Erreur chargement véhicule:', error);
        alert('Véhicule non trouvé');
        this.router.navigate(['/vehicules']);
      }
    });
  }

  loadCategories(): void {
    this.vehiculeService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Erreur chargement catégories:', error)
    });
  }

  onSubmit(): void {
    if (this.vehicule && this.isFormValid()) {
      // Préparer les données
      // S'assurer que la catégorie est correctement formatée
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
        categorie: this.vehicule.categorie ? {
          id: this.vehicule.categorie.id
        } : null
      };

      console.log('Mise à jour du véhicule:', vehiculeToUpdate);

      this.vehiculeService.updateVehicule(vehiculeToUpdate).subscribe({
        next: (updatedVehicule) => {
          console.log('Véhicule mis à jour:', updatedVehicule);
          alert('Véhicule mis à jour avec succès');
          this.router.navigate(['/vehicules']);
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
      this.vehicule.categorie?.id
    );
  }

  cancel(): void {
    this.router.navigate(['/vehicules']);
  }
}
