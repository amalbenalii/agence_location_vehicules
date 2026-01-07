import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieVehicule } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:8090/api/categories';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCategories(): Observable<CategorieVehicule[]> {
    return this.http.get<CategorieVehicule[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getCategorieById(id: number): Observable<CategorieVehicule> {
    return this.http.get<CategorieVehicule>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createCategorie(categorie: CategorieVehicule): Observable<CategorieVehicule> {
    return this.http.post<CategorieVehicule>(this.apiUrl, categorie, { headers: this.getHeaders() });
  }

  updateCategorie(id: number, categorie: CategorieVehicule): Observable<CategorieVehicule> {
    return this.http.put<CategorieVehicule>(`${this.apiUrl}/${id}`, categorie, { headers: this.getHeaders() });
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
