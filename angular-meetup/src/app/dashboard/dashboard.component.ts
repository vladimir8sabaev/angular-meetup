import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Meetup } from '../Interfaces/meetup';
import { User } from '../Interfaces/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}
  allMeetups: Meetup[] = [];
  filteredMeetups: Meetup[] = [];
  getUsers() {
    this.authService.getUsers().subscribe((data) => console.log(data));
  }
  // filterMeetups(all: boolean): void {
  //   if (all) {
  //     this.filteredMeetups = [...this.allMeetups];
  //   } else {
  //     this.filteredMeetups = this.allMeetups.filter((meetup: Meetup) => {
  //       if (this.authService.user) {
  //         console.log(this.authService.user);
  //         return meetup.users.some(
  //           (user) => user.email === this.authService.user?.email
  //         );
  //       } else {
  //         return false;
  //       }
  //     });
  //   }
  //   console.log(this.filteredMeetups);
  // }

  getMeetups() {
    this.authService.getMeetups().subscribe((data: Meetup[]) => {
      this.allMeetups = data;
      console.log(data);
    });
  }

  ngOnInit() {
    this.getMeetups();
    //this.filterMeetups(true);
    this.authService.refresh.subscribe(() => {
      this.getMeetups();
    });
    console.log(this.authService.user?.roles[0].name);
  }
}
