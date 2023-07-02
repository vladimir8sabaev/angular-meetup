import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Meetup } from '../Interfaces/meetup';

@Component({
  selector: 'app-meetupform',
  templateUrl: './meetupform.component.html',
  styleUrls: ['./meetupform.component.scss'],
})
export class MeetupformComponent {
  constructor(private fb: FormBuilder, public authService: AuthService) {}

  editedMeetup: Meetup | null;

  meetupForm!: FormGroup<{
    name: FormControl<string>;
    date: FormControl<string>;
    time: FormControl<string>;
    duration: FormControl<string>;
    location: FormControl<string>;
    description: FormControl<string>;
    target_audience: FormControl<string>;
    need_to_know: FormControl<string>;
    will_happen: FormControl<string>;
    reason_to_come: FormControl<string>;
  }>;

  initForm() {
    const date: string | undefined = this.authService.editedMeetup?.time;
    let finalDate: string = '';
    let finalTime: string = '';
    if (date) {
      const normalDate = new Date(date);
      finalDate = date.slice(0, 10);
      finalTime = `${normalDate.getHours()}:${
        (normalDate.getMinutes() < 10 ? '0' : '') + normalDate.getMinutes()
      }`;
    }

    this.meetupForm = this.fb.nonNullable.group({
      name: [
        `${this.authService.editedMeetup?.name || ''}`,
        [Validators.required],
      ],
      date: [finalDate, [Validators.required]],
      time: [finalTime, [Validators.required]],
      duration: [
        `${this.authService.editedMeetup?.duration || ''}`,
        [Validators.required],
      ],
      location: [
        `${this.authService.editedMeetup?.location || ''}`,
        [Validators.required],
      ],
      description: [
        `${this.authService.editedMeetup?.description || ''}`,
        [Validators.required],
      ],
      target_audience: [
        `${this.authService.editedMeetup?.target_audience || ''}`,
        [Validators.required],
      ],
      need_to_know: [
        `${this.authService.editedMeetup?.need_to_know || ''}`,
        [Validators.required],
      ],
      will_happen: [
        `${this.authService.editedMeetup?.will_happen || ''}`,
        [Validators.required],
      ],
      reason_to_come: [
        `${this.authService.editedMeetup?.reason_to_come || ''}`,
        [Validators.required],
      ],
    });
  }
  ngOnInit() {
    this.initForm();
    this.editedMeetup = this.authService.editedMeetup;
  }
  createMeetup() {
    this.authService
      .createMeetup(
        this.meetupForm.value.name || '',
        this.meetupForm.value.date || '',
        this.meetupForm.value.time || '',
        this.meetupForm.value.duration || '',
        this.meetupForm.value.location || '',
        this.meetupForm.value.description || '',
        this.meetupForm.value.target_audience || '',
        this.meetupForm.value.need_to_know || '',
        this.meetupForm.value.will_happen || '',
        this.meetupForm.value.reason_to_come || ''
      )
      .subscribe((data) => {
        console.log(data);
      });
    alert('Meetup has been created!');
    this.authService.goToDashboard();
  }

  saveChanges() {
    this.authService
      .saveChanges(
        this.authService.editedMeetup!.id,
        this.meetupForm.value.name || '',
        this.meetupForm.value.date || '',
        this.meetupForm.value.time || '',
        this.meetupForm.value.duration || '',
        this.meetupForm.value.location || '',
        this.meetupForm.value.description || '',
        this.meetupForm.value.target_audience || '',
        this.meetupForm.value.need_to_know || '',
        this.meetupForm.value.will_happen || '',
        this.meetupForm.value.reason_to_come || ''
      )
      .subscribe((data) => {
        console.log(data);
      });
    alert('Meetup has been changed!');
    this.authService.goToDashboard();
  }

  cancelCreation() {
    this.authService.isEdited = false;
    this.meetupForm.reset();
    this.authService.goToDashboard();
  }

  deleteMeetup() {
    this.authService
      .deleteMeetup(this.editedMeetup!.id)
      .subscribe((data) => console.log(data));
    alert('Meetup has been deleted!');
    this.authService.goToDashboard();
  }
}
