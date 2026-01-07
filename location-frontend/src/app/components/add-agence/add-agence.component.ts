import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AgenceService } from '../../services/agence.service';
import { Agence } from '../../models/reservation.model';

@Component({
  selector: 'app-add-agence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-agence.component.html',
  styleUrls: ['./add-agence.component.css']
})
export class AddAgenceComponent implements OnInit {
  title = 'Nouvelle Agence';
  agence: Agence = {
    nom: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
    heureOuverture: '',
    heureFermeture: ''
  };

  loading = false;
  error = '';
  success = '';

  private editingId: number | null = null;

  constructor(private agenceService: AgenceService, public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.editingId) {
      this.agenceService.updateAgence(this.editingId, this.agence).subscribe({
        next: (data) => {
          this.success = 'Agence mise à jour avec succès!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/agences']), 1500);
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour de l\'agence';
          this.loading = false;
          console.error('Error updating agence:', err);
        }
      });
    } else {
      this.agenceService.createAgence(this.agence).subscribe({
        next: (data) => {
          this.success = 'Agence créée avec succès!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/agences']), 2000);
        },
        error: (err) => {
          this.error = 'Erreur lors de la création de l\'agence';
          this.loading = false;
          console.error('Error creating agence:', err);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.agence.nom || !this.agence.adresse || !this.agence.ville || !this.agence.telephone) {
      this.error = 'Les champs obligatoires doivent être remplis';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.agence.email && !emailRegex.test(this.agence.email)) {
      this.error = 'Veuillez entrer une adresse email valide';
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/agences']);
  }
  
  ngAfterViewInit(): void {
    // Vérifier s'il y a un paramètre id pour l'édition
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.loadForEdit(id);
      }
    }
  }

  private loadForEdit(id: number): void {
    this.editingId = id;
    this.title = 'Modifier Agence';
    this.loading = true;
    this.agenceService.getAgenceById(id).subscribe({
      next: (data) => {
        this.agence = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement agence:', err);
        this.loading = false;
      }
    });
  }
}
