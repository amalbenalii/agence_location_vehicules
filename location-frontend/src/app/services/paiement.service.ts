import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:8090/api/paiements';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getPaiementByReservation(reservationId: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/reservation/${reservationId}`, { headers: this.getHeaders() });
  }

  getPaiementsByStatut(statut: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/statut/${statut}`, { headers: this.getHeaders() });
  }

  createPaiement(paiement: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(this.apiUrl, paiement, { headers: this.getHeaders() });
  }

  updatePaiement(id: number, paiement: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/${id}`, paiement, { headers: this.getHeaders() });
  }

  updateStatutPaiement(id: number, statut: string): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/${id}/statut?statut=${statut}`, {}, 
      { headers: this.getHeaders() });
  }

  confirmerPaiement(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/${id}/confirmer`, {}, { headers: this.getHeaders() });
  }

  annulerPaiement(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/${id}/annuler`, {}, { headers: this.getHeaders() });
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistiques`, { headers: this.getHeaders() });
  }

  getChiffreAffaires(periode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chiffre-affaires?periode=${periode}`, 
      { headers: this.getHeaders() });
  }
}
