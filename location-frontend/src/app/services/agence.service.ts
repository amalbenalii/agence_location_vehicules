import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agence } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {
  private apiUrl = 'http://localhost:8090/api/agences';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllAgences(): Observable<Agence[]> {
    return this.http.get<Agence[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAgenceById(id: number): Observable<Agence> {
    return this.http.get<Agence>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createAgence(agence: Agence): Observable<Agence> {
    return this.http.post<Agence>(this.apiUrl, agence, { headers: this.getHeaders() });
  }

  updateAgence(id: number, agence: Agence): Observable<Agence> {
    return this.http.put<Agence>(`${this.apiUrl}/${id}`, agence, { headers: this.getHeaders() });
  }

  deleteAgence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
