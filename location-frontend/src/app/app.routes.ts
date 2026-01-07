import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Routes publiques
  {
    path: '',
    loadComponent: () => import('./components/landing/landing.component')
      .then(m => m.LandingComponent)
  },
  {
    path: 'landing',
    loadComponent: () => import('./components/landing/landing.component')
      .then(m => m.LandingComponent)
  },
  {
    path: 'vehicule/:id',
    loadComponent: () => import('./components/vehicule-details/vehicule-details.component')
      .then(m => m.VehiculeDetailsComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component')
      .then(m => m.RegisterComponent)
  },

  // Routes protégées - Layout principal
  {
    path: '',
    loadComponent: () => import('./components/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component')
          .then(m => m.ProfileComponent)
      },

      // Véhicules
      {
        path: 'vehicules',
        loadComponent: () => import('./components/vehicules/vehicules.component')
          .then(m => m.VehiculesComponent)
      },
      {
        path: 'add-vehicule',
        loadComponent: () => import('./components/add-vehicule/add-vehicule.component')
          .then(m => m.AddVehiculeComponent),
        canActivate: [roleGuard(['GESTIONNAIRE'])]
      },
      {
        path: 'edit-vehicule/:id',
        loadComponent: () => import('./components/edit-vehicule/edit-vehicule.component')
          .then(m => m.EditVehiculeComponent),
        canActivate: [roleGuard(['GESTIONNAIRE'])]
      },

      // Catégories
      {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories.component')
          .then(m => m.CategoriesComponent)
      },
      {
        path: 'add-categorie',
        loadComponent: () => import('./components/add-categorie/add-categorie.component')
          .then(m => m.AddCategorieComponent),
        canActivate: [roleGuard(['GESTIONNAIRE'])]
      },
      {
        path: 'edit-categorie/:id',
        loadComponent: () => import('./components/edit-categorie/edit-categorie.component')
          .then(m => m.EditCategorieComponent),
        canActivate: [roleGuard(['GESTIONNAIRE'])]
      },

      // Réservations
      {
        path: 'reservations',
        loadComponent: () => import('./components/reservations/reservations.component')
          .then(m => m.ReservationsComponent)
      },
      {
        path: 'add-reservation',
        loadComponent: () => import('./components/add-reservation/add-reservation.component')
          .then(m => m.AddReservationComponent),
        canActivate: [roleGuard(['CLIENT'])]
      },
      {
        path: 'edit-reservation/:id',
        loadComponent: () => import('./components/edit-reservation/edit-reservation.component')
          .then(m => m.EditReservationComponent),
        canActivate: [roleGuard(['CLIENT'])]
      },
      {
        path: 'payment/:id',
        loadComponent: () => import('./components/payment/payment.component')
          .then(m => m.PaymentComponent),
        canActivate: [roleGuard(['CLIENT'])]
      },

      // Agences (uniquement pour gestionnaires)
      {
        path: 'agences',
        loadComponent: () => import('./components/agences/agences.component')
          .then(m => m.AgencesComponent),
        canActivate: [roleGuard(['GESTIONNAIRE'])]
      },
      {
        path: 'edit-agence/:id',
        loadComponent: () => import('./components/add-agence/add-agence.component')
          .then(m => m.AddAgenceComponent),
        canActivate: [roleGuard(['GESTIONNAIRE'])]
      },
      {
        path: 'add-agence',
        loadComponent: () => import('./components/add-agence/add-agence.component')
          .then(m => m.AddAgenceComponent),
        canActivate: [roleGuard(['GESTIONNAIRE'])]
      }
    ]
  },

  // Route par défaut
  {
    path: '**',
    redirectTo: ''
  }
];
