import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule } from '../models/vehicule';
import {Categorievehicule} from "../models/categorievehicule";

export interface PaginationResponse {
  content: Vehicule[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) { 
    // L'intercepteur HTTP ajoute automatiquement le token
  }

  // ========== VÉHICULES (ProduitController) ==========

  // GET /api/vehicules
  getVehicules(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/vehicules`);
  }

  // GET /api/vehicules/paginated
  getVehiculesPaginated(page: number = 0, size: number = 6, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PaginationResponse> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    };
    return this.http.get<PaginationResponse>(`${this.apiUrl}/vehicules/paginated`, { params });
  }

  // GET /api/vehicules/available/paginated
  getAvailableVehiculesPaginated(page: number = 0, size: number = 6, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PaginationResponse> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    };
    return this.http.get<PaginationResponse>(`${this.apiUrl}/vehicules/available/paginated`, { params });
  }

  // GET /api/vehicules/search/paginated
  searchVehiculesPaginated(keyword: string, page: number = 0, size: number = 6, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PaginationResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    };
    return this.http.get<PaginationResponse>(`${this.apiUrl}/vehicules/search/paginated`, { params });
  }

  // GET /api/vehicules/available/search/paginated
  searchAvailableVehiculesPaginated(keyword: string, page: number = 0, size: number = 6, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PaginationResponse> {
    const params = {
      keyword: keyword,
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    };
    return this.http.get<PaginationResponse>(`${this.apiUrl}/vehicules/available/search/paginated`, { params });
  }

  // GET /api/vehicules/{id}
  getVehicule(id: number): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.apiUrl}/vehicules/${id}`);
  }

  // GET /api/vehicules/categorie/{id}
  getVehiculesByCategorie(idCategorie: number): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/vehicules/categorie/${idCategorie}`);
  }

  // GET /api/vehicules/marque?marque={marque}
  getVehiculesByMarque(marque: string): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/vehicules/marque?marque=${marque}`);
  }

  // GET /api/vehicules/statut/{statut}
  getVehiculesByStatut(statut: string): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/vehicules/statut/${statut}`);
  }

  // POST /api/vehicules
  addVehicule(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(`${this.apiUrl}/vehicules`, vehicule);
  }

  // PUT /api/vehicules
  updateVehicule(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/vehicules`, vehicule);
  }

  // DELETE /api/vehicules/{id}
  deleteVehicule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehicules/${id}`);
  }

  // ========== CATÉGORIES (CategorieController) ==========

  // GET /api/categories
  getCategories(): Observable<Categorievehicule[]> {
    return this.http.get<Categorievehicule[]>(`${this.apiUrl}/categories`);
  }

  // GET /api/categories/{id}
  getCategorie(id: number): Observable<Categorievehicule> {
    return this.http.get<Categorievehicule>(`${this.apiUrl}/categories/${id}`);
  }

  // POST /api/categories
  addCategorie(categorie: Categorievehicule): Observable<Categorievehicule> {
    return this.http.post<Categorievehicule>(`${this.apiUrl}/categories`, categorie);
  }

  // PUT /api/categories
  updateCategorie(categorie: Categorievehicule): Observable<Categorievehicule> {
    return this.http.put<Categorievehicule>(`${this.apiUrl}/categories`, categorie);
  }

  // DELETE /api/categories/{id}
  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // ========== IMAGE UPLOAD ==========

  // POST /api/vehicules/{id}/image
  uploadVehiculeImage(id: number, file: File): Observable<{imageUrl: string}> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{imageUrl: string}>(`${this.apiUrl}/vehicules/${id}/image`, formData);
  }

  // DELETE /api/vehicules/{id}/image
  deleteVehiculeImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehicules/${id}/image`);
  }
}
