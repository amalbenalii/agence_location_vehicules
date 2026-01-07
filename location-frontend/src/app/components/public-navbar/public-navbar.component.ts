import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.css']
})
export class PublicNavbarComponent {

}
