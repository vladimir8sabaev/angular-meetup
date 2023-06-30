import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../Interfaces/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(private authService: AuthService) {}

  allUsers: User[] = [];

  getUsers() {
    this.authService.getUsers().subscribe((data) => {
      this.allUsers = data;
      console.log(this.allUsers);
    });
  }

  ngOnInit() {
    this.authService.getRoles();
    this.getUsers();
    this.authService.refresh.subscribe(() => {
      this.getUsers();
    });
  }
}
