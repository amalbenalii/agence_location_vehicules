import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8090/api/utilisateurs';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, updates);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/password`, {
      currentPassword,
      newPassword
    });
  }
}
