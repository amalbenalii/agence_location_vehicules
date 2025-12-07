import { Routes } from '@angular/router';

export const routes: Routes = [
  // Véhicules
  {
    path: 'vehicules',
    loadComponent: () => import('./components/vehicules/vehicules.component')
      .then(m => m.VehiculesComponent)
  },
  {
    path: 'add-vehicule',
    loadComponent: () => import('./components/add-vehicule/add-vehicule.component')
      .then(m => m.AddVehiculeComponent)
  },
  {
    path: 'edit-vehicule/:id',
    loadComponent: () => import('./components/edit-vehicule/edit-vehicule.component')
      .then(m => m.EditVehiculeComponent)
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
      .then(m => m.AddCategorieComponent)
  },
  {
    path: 'edit-categorie/:id',
    loadComponent: () => import('./components/edit-categorie/edit-categorie.component')
      .then(m => m.EditCategorieComponent)
  },

  // Routes par défaut
  {
    path: '',
    redirectTo: '/vehicules',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/vehicules'
  }
];
