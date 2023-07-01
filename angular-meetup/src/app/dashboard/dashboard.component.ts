import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Meetup } from '../Interfaces/meetup';
import { User } from '../Interfaces/user';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}
  allMeetups: Meetup[];
  filteredMeetups: Meetup[];
  getUsers() {
    this.authService.getUsers().subscribe((data) => console.log(data));
  }

  getMeetups() {
    this.authService.getMeetups().subscribe((data: Meetup[]) => {
      this.authService.allMeetups = data;
      this.authService.filteredMeetups = this.authService.filterMeetups(data);
      this.allMeetups = this.authService.allMeetups;
      this.filteredMeetups = this.authService.filteredMeetups;
    });
    this.allMeetups = this.authService.allMeetups;
    this.filteredMeetups = this.authService.filteredMeetups;
  }

  ngOnInit() {
    this.getMeetups();
    this.authService.refresh.subscribe(() => {
      this.getMeetups();
    });
  }

  addNew() {
    this.authService.isEdited = false;
    this.authService.editedMeetup = null;
    this.authService.goToAddNewMeetup();
  }
}
