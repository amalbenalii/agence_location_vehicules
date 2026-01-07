import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehiculeService } from '../../services/vehicule.service';
import { AuthService } from '../../services/auth.service';
import { Vehicule } from '../../models/vehicule';

@Component({
  selector: 'app-vehicule-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicule-details.component.html',
  styleUrls: ['./vehicule-details.component.css']
})
export class VehiculeDetailsComponent implements OnInit {
  vehicule: Vehicule | null = null;
  isLoading = false;
  vehiculeId: number | null = null;

  constructor(
    private vehiculeService: VehiculeService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      this.vehiculeId = idStr ? Number(idStr) : null;

      if (!this.vehiculeId || isNaN(this.vehiculeId)) {
        alert('Identifiant de véhicule invalide.');
        this.router.navigate(['/vehicules']);
        return;
      }

      this.loadVehicule();
    });
  }

  loadVehicule(): void {
    if (!this.vehiculeId) return;

    this.isLoading = true;
    this.vehiculeService.getVehicule(this.vehiculeId).subscribe({
      next: (vehicule) => {
        this.vehicule = vehicule;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur chargement véhicule:', error);
        if (error?.status === 404) {
          alert('Véhicule introuvable.');
        } else {
          alert('Erreur lors du chargement du véhicule.');
        }
        this.router.navigate(['/vehicules']);
      }
    });
  }

  reserveVehicule(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.authService.isClient()) {
      this.router.navigate(['/add-reservation'], { 
        queryParams: { vehiculeId: this.vehiculeId } 
      });
    } else {
      alert('Seuls les clients peuvent réserver un véhicule.');
    }
  }

  deleteVehicule(): void {
    if (!this.vehiculeId) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.vehiculeService.deleteVehicule(this.vehiculeId).subscribe({
        next: () => {
          alert('Véhicule supprimé avec succès');
          this.router.navigate(['/vehicules']);
        },
        error: (error: any) => {
          alert('Erreur lors de la suppression: ' + (error.error?.message || 'Erreur inconnue'));
        }
      });
    }
  }

  goBack(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/vehicules']);
    } else {
      this.router.navigate(['/']);
    }
  }

  getImageFilename(): string {
    if (!this.vehicule?.imageUrl) return '';
    // Extract filename from URL like "/uploads/filename.jpg"
    return this.vehicule.imageUrl.substring(this.vehicule.imageUrl.lastIndexOf('/') + 1);
  }

  onImageError(event: any): void {
    console.error('Image failed to load:', this.vehicule?.imageUrl);
    console.log('Trying alternative URL...');
    
    // Try alternative URL format
    if (this.vehicule?.imageUrl) {
      const filename = this.getImageFilename();
      const alternativeUrl = `http://localhost:8090/api/vehicules/images/${filename}`;
      console.log('Trying alternative URL:', alternativeUrl);
      
      // Update the background image
      const element = event.target;
      element.style.backgroundImage = `url(${alternativeUrl})`;
    }
  }
}
