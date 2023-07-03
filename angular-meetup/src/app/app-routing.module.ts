import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { loginGuard } from './guards/login.guard';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { MeetupformComponent } from './meetupform/meetupform.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [loginGuard],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  {
    path: 'meetupform',
    component: MeetupformComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [loginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
