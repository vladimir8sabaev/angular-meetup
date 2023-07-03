import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../Interfaces/user';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(public authService: AuthService) {}
  timeToUpdate = interval(30000);
  sub: Subscription;
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
    this.sub = this.timeToUpdate.subscribe(() => {
      this.authService.getRoles();
      this.getUsers();
    });
    this.authService.refresh.subscribe(() => {
      this.getUsers();
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
