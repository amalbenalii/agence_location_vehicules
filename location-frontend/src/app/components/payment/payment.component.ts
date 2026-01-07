import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaiementService } from '../../services/paiement.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Reservation, Paiement } from '../../models/reservation.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  reservation: Reservation | null = null;
  reservationId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est un client
    if (!this.authService.isClient()) {
      this.router.navigate(['/reservations']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      this.reservationId = idStr ? Number(idStr) : null;

      if (!this.reservationId || isNaN(this.reservationId)) {
        this.router.navigate(['/reservations']);
        return;
      }

      this.loadReservation();
    });

    this.paymentForm = this.fb.group({
      methodePaiement: ['CARTE_BANCAIRE', Validators.required],
      numeroCarte: [''],
      dateExpiration: [''],
      cvv: [''],
      nomTitulaire: ['']
    });

    // Validation conditionnelle selon la méthode de paiement
    this.paymentForm.get('methodePaiement')?.valueChanges.subscribe(methode => {
      if (methode === 'CARTE_BANCAIRE') {
        this.paymentForm.get('numeroCarte')?.setValidators([Validators.required]);
        this.paymentForm.get('dateExpiration')?.setValidators([Validators.required]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required]);
        this.paymentForm.get('nomTitulaire')?.setValidators([Validators.required]);
      } else {
        this.paymentForm.get('numeroCarte')?.clearValidators();
        this.paymentForm.get('dateExpiration')?.clearValidators();
        this.paymentForm.get('cvv')?.clearValidators();
        this.paymentForm.get('nomTitulaire')?.clearValidators();
      }
      this.paymentForm.get('numeroCarte')?.updateValueAndValidity();
      this.paymentForm.get('dateExpiration')?.updateValueAndValidity();
      this.paymentForm.get('cvv')?.updateValueAndValidity();
      this.paymentForm.get('nomTitulaire')?.updateValueAndValidity();
    });
  }

  loadReservation(): void {
    if (!this.reservationId) return;

    this.isLoading = true;
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        
        // Vérifier que la réservation peut être payée
        if (reservation.statut !== 'CONFIRMEE') {
          this.errorMessage = 'Cette réservation ne peut pas être payée.';
          this.router.navigate(['/reservations']);
          return;
        }

        if (reservation.paiement && reservation.paiement.statut === 'VALIDE') {
          this.errorMessage = 'Cette réservation a déjà été payée.';
          this.router.navigate(['/reservations']);
          return;
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur chargement réservation:', error);
        this.errorMessage = 'Réservation introuvable.';
        this.router.navigate(['/reservations']);
      }
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid && this.reservation && this.reservationId) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.paymentForm.value;
      const paiement: any = {
        montant: this.reservation.montantTotal,
        methodePaiement: formValue.methodePaiement,
        statut: 'EN_ATTENTE',
        reservation: { id: this.reservationId }
      };

      this.paiementService.createPaiement(paiement).subscribe({
        next: (paiementCree: Paiement) => {
          // Confirmer automatiquement le paiement (simulation)
          this.paiementService.confirmerPaiement(paiementCree.id!).subscribe({
            next: () => {
              alert('Paiement effectué avec succès !');
              this.router.navigate(['/reservations']);
            },
            error: (error: any) => {
              this.isLoading = false;
              this.errorMessage = 'Erreur lors de la confirmation: ' + (error.error?.message || 'Erreur inconnue');
            }
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors du paiement: ' + (error.error?.message || 'Erreur inconnue');
        }
      });
    }
  }
}
