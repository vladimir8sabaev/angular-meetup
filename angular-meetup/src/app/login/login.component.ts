import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

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
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit() {
    this.initForm();
  }
  isRegistered: boolean = true;
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          // Validators.minLength(6),
          // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ],
      ],
    });
    this.loginForm.valueChanges.subscribe(() => (this.isRegistered = true));
  }
  login() {
    this.authService
      .login(
        this.loginForm.value.email || '',
        this.loginForm.value.password || ''
      )
      .subscribe(
        (data) => console.log(data),
        (error) => {
          console.log(error.message);
          this.isRegistered = false;
        }
      );
  }
  goToRegisterPage() {
    this.authService.goToRegisterPage();
  }
}
