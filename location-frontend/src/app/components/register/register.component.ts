import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicNavbarComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      telephone: [''],
      adresse: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('motDePasse');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Vérifier que les mots de passe correspondent
      if (this.registerForm.errors?.['passwordMismatch']) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.registerForm.value;
      
      // Vérifier que le mot de passe est bien présent
      if (!formValue.motDePasse || formValue.motDePasse.trim() === '') {
        this.isLoading = false;
        this.errorMessage = 'Le mot de passe est requis';
        return;
      }

      const registerData = {
        nom: formValue.nom.trim(),
        prenom: formValue.prenom.trim(),
        email: formValue.email.trim(),
        motDePasse: formValue.motDePasse,
        telephone: formValue.telephone?.trim() || null,
        adresse: formValue.adresse?.trim() || null,
        role: 'CLIENT' as const
      };

      console.log('Données d\'inscription:', { ...registerData, motDePasse: '***' }); // Log sans le mot de passe

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur inscription:', error);
          this.errorMessage = error.error?.message || error.error?.error || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
