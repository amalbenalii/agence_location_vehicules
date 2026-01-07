import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { VehiculeService } from '../../services/vehicule.service';
import { AgenceService } from '../../services/agence.service';
import { AuthService } from '../../services/auth.service';
import { Vehicule } from '../../models/vehicule';
import { Agence, Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-edit-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css']
})
export class EditReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  vehicules: Vehicule[] = [];
  agences: Agence[] = [];
  reservation: Reservation | null = null;
  isLoading = false;
  errorMessage = '';
  montantTotal = 0;
  reservationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private vehiculeService: VehiculeService,
    private agenceService: AgenceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isClient()) {
      this.router.navigate(['/reservations']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      this.reservationId = idStr ? Number(idStr) : null;

      if (!this.reservationId || isNaN(this.reservationId)) {
        alert('Identifiant de réservation invalide.');
        this.router.navigate(['/reservations']);
        return;
      }

      this.loadReservation();
    });

    this.reservationForm = this.fb.group({
      vehiculeId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      agencePriseEnChargeId: ['', Validators.required],
      agenceRetourId: ['', Validators.required]
    });

    this.loadData();

    // Écouter les changements pour recalculer
    this.reservationForm.get('dateDebut')?.valueChanges.subscribe(() => {
      this.checkDisponibilite();
      this.calculerMontant();
    });
    this.reservationForm.get('dateFin')?.valueChanges.subscribe(() => {
      this.checkDisponibilite();
      this.calculerMontant();
    });
    this.reservationForm.get('vehiculeId')?.valueChanges.subscribe(() => {
      this.calculerMontant();
      this.checkDisponibilite();
    });
  }

  loadReservation(): void {
    if (!this.reservationId) return;

    this.isLoading = true;
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        
        // Vérifier que c'est bien la réservation du client connecté
        const currentUser = this.authService.getCurrentUser();
        if (reservation.client?.id !== currentUser?.id) {
          alert('Vous n\'avez pas le droit de modifier cette réservation.');
          this.router.navigate(['/reservations']);
          return;
        }

        // Vérifier que la réservation peut être modifiée
        if (reservation.statut !== 'EN_ATTENTE' && reservation.statut !== 'CONFIRMEE') {
          alert('Cette réservation ne peut plus être modifiée.');
          this.router.navigate(['/reservations']);
          return;
        }

        // Remplir le formulaire
        this.reservationForm.patchValue({
          vehiculeId: reservation.vehicule?.id,
          dateDebut: reservation.dateDebut,
          dateFin: reservation.dateFin,
          agencePriseEnChargeId: reservation.agencePriseEnCharge?.id,
          agenceRetourId: reservation.agenceRetour?.id
        });

        this.montantTotal = reservation.montantTotal;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement réservation:', error);
        alert('Réservation introuvable.');
        this.router.navigate(['/reservations']);
      }
    });
  }

  loadData(): void {
    this.vehiculeService.getVehicules().subscribe({
      next: (vehicules) => {
        this.vehicules = vehicules.filter(v => v.statut === 'DISPONIBLE');
      }
    });

    this.agenceService.getAllAgences().subscribe({
      next: (agences) => {
        this.agences = agences;
      }
    });
  }

  checkDisponibilite(): void {
    const vehiculeId = this.reservationForm.get('vehiculeId')?.value;
    const dateDebut = this.reservationForm.get('dateDebut')?.value;
    const dateFin = this.reservationForm.get('dateFin')?.value;

    if (vehiculeId && dateDebut && dateFin) {
      this.reservationService.checkDisponibilite(vehiculeId, dateDebut, dateFin).subscribe({
        next: (disponible) => {
          if (!disponible && vehiculeId !== this.reservation?.vehicule?.id) {
            this.errorMessage = 'Ce véhicule n\'est pas disponible pour ces dates.';
          } else {
            this.errorMessage = '';
          }
        }
      });
    }
  }

  calculerMontant(): void {
    const vehiculeId = this.reservationForm.get('vehiculeId')?.value;
    const dateDebut = this.reservationForm.get('dateDebut')?.value;
    const dateFin = this.reservationForm.get('dateFin')?.value;

    if (vehiculeId && dateDebut && dateFin) {
      const vehicule = this.vehicules.find(v => v.id === vehiculeId);
      if (vehicule?.categorie?.prixParJour) {
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        const jours = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        this.montantTotal = jours * vehicule.categorie.prixParJour;
      }
    }
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.reservationForm.valid && !this.errorMessage && this.reservationId) {
      this.isLoading = true;
      const formValue = this.reservationForm.value;
      const currentUser = this.authService.getCurrentUser();

      const reservation: any = {
        id: this.reservationId,
        dateDebut: formValue.dateDebut,
        dateFin: formValue.dateFin,
        vehicule: { id: formValue.vehiculeId },
        client: { id: currentUser?.id },
        agencePriseEnCharge: { id: formValue.agencePriseEnChargeId },
        agenceRetour: { id: formValue.agenceRetourId },
        montantTotal: this.montantTotal,
        statut: this.reservation?.statut || 'EN_ATTENTE'
      };

      this.reservationService.updateReservation(this.reservationId, reservation).subscribe({
        next: () => {
          this.router.navigate(['/reservations']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la modification de la réservation.';
        }
      });
    }
  }
}
