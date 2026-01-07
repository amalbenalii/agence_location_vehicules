import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8090/api/reservations';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getReservationsByClient(clientId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/client/${clientId}`, { headers: this.getHeaders() });
  }

  getReservationsByVehicule(vehiculeId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/vehicule/${vehiculeId}`, { headers: this.getHeaders() });
  }

  checkDisponibilite(vehiculeId: number, dateDebut: string, dateFin: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/disponibilites?vehiculeId=${vehiculeId}&dateDebut=${dateDebut}&dateFin=${dateFin}`, 
      { headers: this.getHeaders() });
  }

  getReservationsByStatut(statut: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/statut/${statut}`, { headers: this.getHeaders() });
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation, { headers: this.getHeaders() });
  }

  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation, { headers: this.getHeaders() });
  }

  updateStatutReservation(id: number, statut: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/statut?statut=${statut}`, {}, 
      { headers: this.getHeaders() });
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistiques`, { headers: this.getHeaders() });
  }
}
