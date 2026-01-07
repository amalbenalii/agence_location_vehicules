import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  isEditing = false;
  updatedUser = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: ''
  };
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    public authService: AuthService, 
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.updatedUser = {
        nom: this.currentUser.nom,
        prenom: this.currentUser.prenom,
        email: this.currentUser.email,
        telephone: this.currentUser.telephone || '',
        adresse: this.currentUser.adresse || ''
      };
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';
  }

  updateProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // TODO: Appeler le service pour mettre à jour le profil
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Profil mis à jour avec succès!';
      this.isEditing = false;
      // Mettre à jour les informations locales
      this.currentUser = { ...this.currentUser, ...this.updatedUser };
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.errorMessage = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.utilisateurService.changePassword(
      this.passwordForm.currentPassword,
      this.passwordForm.newPassword
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Mot de passe changé avec succès!';
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur lors du changement de mot de passe';
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    // Réinitialiser avec les valeurs actuelles
    if (this.currentUser) {
      this.updatedUser = {
        nom: this.currentUser.nom,
        prenom: this.currentUser.prenom,
        email: this.currentUser.email,
        telephone: this.currentUser.telephone || '',
        adresse: this.currentUser.adresse || ''
      };
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
