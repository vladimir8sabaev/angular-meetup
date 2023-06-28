import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Meetup } from '../Interfaces/meetup';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}
  allMeetups: Meetup[] = [];
  getUsers() {
    this.authService.getUsers().subscribe((data) => console.log(data));
  }
  getMeetups() {
    this.authService.getMeetups().subscribe((data: Meetup[]) => {
      this.allMeetups = data;
      console.log(data);
    });
  }
  ngOnInit() {
    this.getMeetups();
    this.authService.refresh.subscribe(() => {
      this.getMeetups();
    });
    console.log(this.authService.user?.roles[0].name);
  }
}
