import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../Interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = `${environment.backendOrigin}/auth`;
  constructor(private http: HttpClient, private routes: Router) {}
  login(email: string | null, password: string | null) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((res) => {
          if (res.token) {
            localStorage.setItem('del_meetups_auth_token', res.token);
            this.routes.navigate(['dashboard']);
          }
          return res;
        })
      );
  }
  parseJwt(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  public get user(): User | null {
    const token = localStorage.getItem('del_meetups_auth_token');
    if (token) {
      const user: User = this.parseJwt(token);
      return user;
    } else {
      return null;
    }
  }

  public get token(): string | null {
    return localStorage.getItem('del_meetups_auth_token');
  }

  logout() {
    localStorage.removeItem('del_meetups_auth_token');
    this.routes.navigate(['login']);
  }
  goToRegisterPage() {
    this.routes.navigate(['register']);
  }
  goToLoginPage() {
    this.routes.navigate(['login']);
  }
  register(email: string | null, password: string | null, fio: string | null) {
    return this.http.post<User>(`${this.baseUrl}/registration`, {
      email: email,
      password: password,
      fio: fio,
    });
  }

  getUsers() {
    return this.http.get<User[]>(`${environment.backendOrigin}/user`);
  }
}
