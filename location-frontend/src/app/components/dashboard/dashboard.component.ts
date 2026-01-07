import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { VehiculeService } from '../../services/vehicule.service';
import { PaiementService } from '../../services/paiement.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  stats: any = {};
  isLoading = true;

  constructor(
    public authService: AuthService,
    private reservationService: ReservationService,
    private vehiculeService: VehiculeService,
    private paiementService: PaiementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;

    if (this.authService.isClient()) {
      // Stats pour client
      this.reservationService.getReservationsByClient(this.currentUser.id!).subscribe({
        next: (reservations) => {
          this.stats = {
            totalReservations: reservations.length,
            reservationsEnAttente: reservations.filter(r => r.statut === 'EN_ATTENTE').length,
            reservationsConfirmees: reservations.filter(r => r.statut === 'CONFIRMEE').length,
            reservationsEnCours: reservations.filter(r => r.statut === 'EN_COURS').length
          };
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Stats pour gestionnaire
      Promise.all([
        firstValueFrom(this.reservationService.getStatistiques()),
        firstValueFrom(this.vehiculeService.getVehicules()),
        firstValueFrom(this.paiementService.getStatistiques())
      ]).then(([resStats, vehicules, paiementStats]) => {
        this.stats = {
          ...resStats,
          totalVehicules: vehicules?.length || 0,
          vehiculesDisponibles: vehicules?.filter((v: any) => v.statut === 'DISPONIBLE').length || 0,
          ...paiementStats
        };
        this.isLoading = false;
      }).catch((error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.isLoading = false;
      });
    }
  }
}
