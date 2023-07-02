import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
  isAdmin: boolean =
    Boolean(
      localStorage.getItem('del_meetups_auth_token') &&
        this.authService.user?.roles.some((item: any) => item.name === 'ADMIN')
    ) || false;
  isLogged: boolean =
    Boolean(localStorage.getItem('del_meetups_auth_token')) || false;
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
  admin() {
    this.authService.goToAdminPage();
  }
  dashboard() {
    this.authService.goToDashboard();
  }
  openMyMeetups() {
    this.dashboard();
    this.authService.openMyMeetups();
  }
  openAllMeetups() {
    this.dashboard();
    this.authService.openAllMeetups();
  }
}
