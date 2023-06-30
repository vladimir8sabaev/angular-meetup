import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-meetupform',
  templateUrl: './meetupform.component.html',
  styleUrls: ['./meetupform.component.scss'],
})
export class MeetupformComponent {
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  meetupForm!: FormGroup<{
    name: FormControl<string | null>;
    date: FormControl<string | null>;
    time: FormControl<string | null>;
    duration: FormControl<string | null>;
    location: FormControl<string | null>;
    description: FormControl<string | null>;
    target_audience: FormControl<string | null>;
    need_to_know: FormControl<string | null>;
    will_happen: FormControl<string | null>;
    reason_to_come: FormControl<string | null>;
  }>;

  initForm() {
    this.meetupForm = this.fb.group({
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      target_audience: ['', [Validators.required]],
      need_to_know: ['', [Validators.required]],
      will_happen: ['', [Validators.required]],
      reason_to_come: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.initForm();
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
  }
}

let date = '2017-06-01';
let time = '15:30';
let sum = new Date(date + ' ' + time);
console.log(sum.toISOString());
