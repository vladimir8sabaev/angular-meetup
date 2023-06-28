import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}
  isAdmin: boolean = Boolean(localStorage.getItem('isAdmin')) || false;
  isLogged: boolean = Boolean(localStorage.getItem('isLogged')) || false;
  ngOnInit() {
    this.authService.isLogged.subscribe((data) => {
      this.isLogged = data;
    });
    this.authService.isAdmin.subscribe((data) => {
      this.isAdmin = data;
    });
  }
  logout() {
    this.authService.logout();
  }
}
