import { Component, OnInit } from '@angular/core';
import { Agence } from '../../models/reservation.model';
import { AgenceService } from '../../services/agence.service';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-agences',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agences.component.html'
})
export class AgencesComponent implements OnInit {
  agences: Agence[] = [];
  isLoading = false;

  constructor(
    private agenceService: AgenceService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est un gestionnaire
    if (!this.authService.isGestionnaire()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadAgences();
  }

  loadAgences(): void {
    this.isLoading = true;
    this.agenceService.getAllAgences().subscribe({
      next: (data: Agence[]) => {
        this.agences = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement agences:', err);
        this.isLoading = false;
      }
    });
  }

  editAgence(id?: number): void {
    if (!id) return;
    this.router.navigate(['/edit-agence', id]);
  }

  deleteAgence(id?: number): void {
    if (!id) return;
    if (!confirm('Confirmer la suppression de cette agence ?')) return;
    this.agenceService.deleteAgence(id).subscribe({
      next: () => {
        this.loadAgences();
      },
      error: (err) => {
        console.error('Erreur suppression agence:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }

  onCardHover(event: MouseEvent, isEnter: boolean): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = isEnter ? 'translateY(-5px)' : 'translateY(0)';
    }
  }
}
