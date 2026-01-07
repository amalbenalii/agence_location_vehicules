import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { VehiculeService } from '../../services/vehicule.service';
import { AgenceService } from '../../services/agence.service';
import { AuthService } from '../../services/auth.service';
import { Vehicule } from '../../models/vehicule';
import { Agence } from '../../models/reservation.model';

@Component({
  selector: 'app-add-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  vehicules: Vehicule[] = [];
  agences: Agence[] = [];
  vehiculesDisponibles: Vehicule[] = [];
  isLoading = false;
  errorMessage = '';
  montantTotal = 0;

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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.reservationForm = this.fb.group({
      vehiculeId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      agencePriseEnChargeId: ['', Validators.required],
      agenceRetourId: ['', Validators.required]
    });

    // Vérifier si un vehiculeId est passé en paramètre
    this.route.queryParams.subscribe((params: any) => {
      const vehiculeId = params['vehiculeId'];
      if (vehiculeId) {
        this.reservationForm.patchValue({ vehiculeId: Number(vehiculeId) });
      }
    });

    this.loadData();

    // Écouter les changements de dates pour vérifier la disponibilité
    this.reservationForm.get('dateDebut')?.valueChanges.subscribe(() => this.checkDisponibilite());
    this.reservationForm.get('dateFin')?.valueChanges.subscribe(() => this.checkDisponibilite());
    this.reservationForm.get('vehiculeId')?.valueChanges.subscribe(() => {
      this.calculerMontant();
      this.checkDisponibilite();
    });
  }

  loadData(): void {
    this.vehiculeService.getVehicules().subscribe({
      next: (vehicules) => {
        this.vehicules = vehicules;
        this.filterDisponibles();
      }
    });

    this.agenceService.getAllAgences().subscribe({
      next: (agences) => {
        this.agences = agences;
      }
    });
  }

  filterDisponibles(): void {
    this.vehiculesDisponibles = this.vehicules.filter(v => v.statut === 'DISPONIBLE');
  }

  checkDisponibilite(): void {
    const vehiculeId = this.reservationForm.get('vehiculeId')?.value;
    const dateDebut = this.reservationForm.get('dateDebut')?.value;
    const dateFin = this.reservationForm.get('dateFin')?.value;

    if (vehiculeId && dateDebut && dateFin) {
      this.reservationService.checkDisponibilite(vehiculeId, dateDebut, dateFin).subscribe({
        next: (disponible) => {
          if (!disponible) {
            this.errorMessage = 'Ce véhicule n\'est pas disponible pour ces dates.';
          } else {
            this.errorMessage = '';
            this.calculerMontant();
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
    if (this.reservationForm.valid && !this.errorMessage) {
      this.isLoading = true;
      const formValue = this.reservationForm.value;
      const currentUser = this.authService.getCurrentUser();

      const reservation: any = {
        dateDebut: formValue.dateDebut,
        dateFin: formValue.dateFin,
        vehicule: { id: formValue.vehiculeId },
        client: { id: currentUser?.id },
        agencePriseEnCharge: { id: formValue.agencePriseEnChargeId },
        agenceRetour: { id: formValue.agenceRetourId },
        montantTotal: this.montantTotal,
        statut: 'EN_ATTENTE' as const
      };

      this.reservationService.createReservation(reservation).subscribe({
        next: () => {
          this.router.navigate(['/reservations']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la création de la réservation.';
        }
      });
    }
  }
}
