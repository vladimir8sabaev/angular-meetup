import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  message: string;
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit() {
    this.initForm();
  }
  isRegistered: boolean = true;
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
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
        (data) => {
          console.log(data);
          console.log(this.authService.user);
        },
        (error: HttpErrorResponse) => {
          this.message = error.error.message;
          this.isRegistered = false;
        }
      );
  }
  goToRegisterPage() {
    this.authService.goToRegisterPage();
  }
}
