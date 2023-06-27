import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ],
      ],
    });
    this.subscribeForm();
  }
  subscribeForm() {
    this.loginForm.valueChanges.subscribe((value) =>
      console.log(`${value.email}: ${value.password}`)
    );
  }
  onSubmit() {
    console.log(this.loginForm);
  }
}
