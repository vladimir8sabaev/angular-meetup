import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../Interfaces/user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Role } from '../Interfaces/role';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  isEdited: boolean = false;
  allRoles: Role[] = [];
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  @Input() user: User;
  userForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    role: FormControl<string | null>;
  }>;
  changeUser() {
    this.isEdited = true;
    this.userForm.get('email')?.enable();
    this.userForm.get('password')?.enable();
    this.userForm.get('role')?.enable();
  }
  saveChangedUser() {
    this.isEdited = false;
    this.userForm.get('email')?.disable();
    this.userForm.get('password')?.disable();
    this.userForm.get('role')?.disable();
  }
  initForm() {
    this.authService.getRoles().subscribe((data) => {
      this.allRoles = data;
      console.log('all roles:', this.allRoles);
    });
    this.userForm = this.fb.group({
      email: [
        { value: `${this.user.email}`, disabled: true },
        [Validators.required, Validators.email],
      ],
      password: [
        { value: `${this.user.password}`, disabled: true },
        [Validators.required],
      ],
      role: [{ value: '', disabled: true }, [Validators.required]],
    });
  }
  ngOnInit() {
    this.initForm();
    console.log(this.user.roles[0].name);
  }
  deleteUser(user: User) {
    alert('Turn this method on in user component ts!');
    // this.authService.deleteUser(user).subscribe((data) => console.log(data));
  }
}
