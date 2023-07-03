import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../Interfaces/user';
import { interval } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(public authService: AuthService) {}

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
    const timeToUpdate = interval(30000);
    timeToUpdate.subscribe(() => {
      this.authService.getRoles();
      this.getUsers();
    });
    this.authService.refresh.subscribe(() => {
      this.getUsers();
    });
  }
}
