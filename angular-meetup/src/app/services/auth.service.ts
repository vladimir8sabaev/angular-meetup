import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { User } from '../Interfaces/user';
import { Meetup } from '../Interfaces/meetup';
import { Observable, Subject } from 'rxjs';
import { Subscribe } from '../Interfaces/subscribe';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAdmin = new Subject<boolean>();
  public isLogged = new Subject<boolean>();
  baseUrl: string = `${environment.backendOrigin}/auth`;
  constructor(private http: HttpClient, private routes: Router) {}

  //! login

  login(email: string | null, password: string | null) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((res) => {
          if (res.token) {
            this.isLogged.next(true);
            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('del_meetups_auth_token', res.token);
            if (this.user?.roles[0].name === 'ADMIN') {
              localStorage.setItem('isAdmin', 'true');
              this.isAdmin.next(true);
            }
            this.routes.navigate(['dashboard']);
          }
          return res;
        })
      );
  }

  //! parse token

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

  //! user getter

  public get user(): User | null {
    const token = localStorage.getItem('del_meetups_auth_token');
    if (token) {
      const user: User = this.parseJwt(token);
      return user;
    } else {
      return null;
    }
  }

  //! token getter

  public get token(): string | null {
    return localStorage.getItem('del_meetups_auth_token');
  }

  //! logout

  logout() {
    localStorage.removeItem('del_meetups_auth_token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLogged');
    this.routes.navigate(['login']);
    this.isLogged.next(false);
    this.isAdmin.next(false);
  }

  //! routes

  goToRegisterPage() {
    this.routes.navigate(['register']);
  }
  goToLoginPage() {
    this.routes.navigate(['login']);
  }

  //! register

  register(email: string | null, password: string | null, fio: string | null) {
    return this.http.post<User>(`${this.baseUrl}/registration`, {
      email: email,
      password: password,
      fio: fio,
    });
  }

  //! get data from server

  getUsers() {
    return this.http.get<User[]>(`${environment.backendOrigin}/user`);
  }
  getMeetups(): Observable<Meetup[]> {
    return this.http.get<Meetup[]>(`${environment.backendOrigin}/meetup`);
  }

  //! subscribe on meetup

  subscribeOnMeetup(meetupId: number, userId: number | undefined) {
    return this.http
      .put<Subscribe>(`${environment.backendOrigin}/meetup`, {
        idMeetup: meetupId,
        idUser: userId,
      })
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  cancelSubscribeOnMeetup(meetupId: number, userId: number | undefined) {
    return this.http
      .delete(`${environment.backendOrigin}/meetup`, {
        body: {
          idMeetup: meetupId,
          idUser: userId,
        },
      })
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  //! refresh

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }
}
