import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicNavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          const user = response.user;
          
          if (user.role === 'CLIENT' || user.role === 'GESTIONNAIRE') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la connexion. Vérifiez vos identifiants.';
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
