import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  isLoading = true;
  currentUser: any;

  constructor(
    private reservationService: ReservationService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;

    if (this.authService.isClient()) {
      this.reservationService.getReservationsByClient(this.currentUser.id!).subscribe({
        next: (reservations) => {
          this.reservations = reservations;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.reservationService.getAllReservations().subscribe({
        next: (reservations) => {
          this.reservations = reservations;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  cancelReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          this.loadReservations();
        },
        error: (error: any) => {
          alert('Erreur lors de l\'annulation: ' + (error.error?.message || 'Erreur inconnue'));
        }
      });
    }
  }

  updateStatutReservation(id: number, statut: string): void {
    this.reservationService.updateStatutReservation(id, statut).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: (error: any) => {
        alert('Erreur lors de la mise à jour: ' + (error.error?.message || 'Erreur inconnue'));
      }
    });
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'EN_ATTENTE': 'warning',
      'CONFIRMEE': 'success',
      'EN_COURS': 'info',
      'TERMINEE': 'secondary',
      'ANNULEE': 'danger'
    };
    return classes[statut] || 'secondary';
  }

  onCardHover(event: MouseEvent, isEnter: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = isEnter ? 'translateY(-5px)' : 'translateY(0)';
    }
  }

  processPayment(reservation: Reservation): void {
    if (!reservation.id) return;
    this.router.navigate(['/payment', reservation.id]);
  }
}
