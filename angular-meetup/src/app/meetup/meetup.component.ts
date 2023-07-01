import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meetup } from '../Interfaces/meetup';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { User } from '../Interfaces/user';
@Component({
  selector: 'app-meetup',
  templateUrl: './meetup.component.html',
  styleUrls: ['./meetup.component.scss'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MeetupComponent {
  constructor(private authService: AuthService) {}
  @Input() meetup: Meetup;
  state = 'collapsed';
  isSub: boolean = false;
  toggle(): void {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }
  subscribeOnMeetup() {
    if (this.authService.user) {
      this.authService
        .subscribeOnMeetup(this.meetup.id, this.authService.user.id)
        .subscribe((data) => console.log(data));
    }
  }
  cancelSubscribeOnMeetup() {
    if (this.authService.user) {
      this.authService
        .cancelSubscribeOnMeetup(this.meetup.id, this.authService.user.id)
        .subscribe((data) => console.log(data));
    }
  }
  checkOwner() {
    return this.meetup.owner.id === this.authService.user?.id;
  }
  editMeetup(meetup: Meetup) {
    this.authService.editedMeetup = meetup;
    console.log(meetup);
    this.authService.editMeetup();
  }

  ngOnInit() {
    if (
      this.meetup.users.filter((item) => {
        return item.id === this.authService.user?.id;
      }).length > 0
    ) {
      this.isSub = true;
    }

    console.log(this.authService.user?.id);
  }
}
