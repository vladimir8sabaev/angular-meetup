import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    fio: FormControl<string | null>;
  }>;
  isAvailable: boolean = true;
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ],
      ],
      fio: ['', [Validators.required]],
    });
    this.registerForm.valueChanges.subscribe(() => (this.isAvailable = true));
  }
  register() {
    this.authService
      .register(
        this.registerForm.value.email || '',
        this.registerForm.value.password || '',
        this.registerForm.value.fio || ''
      )
      .subscribe((data) => console.log(data));
  }
  goToLoginPage() {
    this.authService.goToLoginPage();
  }
}
