import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  isLoading = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.currentUser = this.authService.getCurrentUser();
      this.redirectBasedOnRole();
    } else {
      this.isLoading = false;
    }
  }

  redirectBasedOnRole(): void {
    const role = this.currentUser?.role;
    
    if (role === 'CLIENT' || role === 'GESTIONNAIRE') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
