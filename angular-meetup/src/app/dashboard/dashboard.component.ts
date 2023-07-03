import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Meetup } from '../Interfaces/meetup';
import { User } from '../Interfaces/user';
import { Observer, Subject, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}
  timeToUpdate = interval(30000);
  sub: Subscription;
  allMeetups: Meetup[];
  filteredMeetups: Meetup[];

  searchText: string = '';

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
    this.sub = this.timeToUpdate.subscribe(() => {
      this.getMeetups();
      console.log('data updated');
    });
    this.authService.refresh.subscribe(() => {
      this.getMeetups();
    });
  }
  ngOnDestroy() {
    console.log('unsubbed');
    this.sub.unsubscribe();
  }

  addNew() {
    this.authService.isEdited = false;
    this.authService.editedMeetup = null;
    this.authService.goToAddNewMeetup();
  }

  searchMeetup(searchValue: string) {
    this.searchText = searchValue;
    console.log(this.searchText);
  }
}
