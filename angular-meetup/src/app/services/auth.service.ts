import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { User } from '../Interfaces/user';
import { Meetup } from '../Interfaces/meetup';
import { Observable, Subject } from 'rxjs';
import { Subscribe } from '../Interfaces/subscribe';
import { Role } from '../Interfaces/role';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAdmin = new Subject<boolean>();
  public isLogged = new Subject<boolean>();
  public isFiltered: boolean = false;
  public isOnAdminPage: boolean = false;
  public allroles: Role[] = [];
  public allMeetups: Meetup[] = [];
  public filteredMeetups: Meetup[] = [];
  public editedMeetup: Meetup | null;
  public isEdited: boolean = false;

  baseUrl: string = `${environment.backendOrigin}/auth`;

  constructor(private http: HttpClient, private routes: Router) {}

  openMyMeetups() {
    this.isFiltered = true;
  }
  openAllMeetups() {
    this.isFiltered = false;
  }

  filterMeetups(arr: Meetup[]): Meetup[] {
    return arr.filter((meetup: Meetup) => {
      if (this.user) {
        return meetup.users.some((user) => user.email === this.user?.email);
      } else {
        return false;
      }
    });
  }

  //! login

  login(
    email: string | null,
    password: string | null
  ): Observable<{
    token: string;
  }> {
    this.isOnAdminPage = false;
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

  logout(): void {
    this.isOnAdminPage = false;
    localStorage.removeItem('del_meetups_auth_token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLogged');
    this.routes.navigate(['login']);
    this.isLogged.next(false);
    this.isAdmin.next(false);
  }

  //! routes

  goToRegisterPage(): void {
    this.isOnAdminPage = false;
    this.routes.navigate(['register']);
  }
  goToLoginPage(): void {
    this.isOnAdminPage = false;
    this.routes.navigate(['login']);
  }
  goToAdminPage(): void {
    this.isOnAdminPage = true;
    this.routes.navigate(['admin']);
  }
  goToDashboard(): void {
    this.isOnAdminPage = false;
    this.routes.navigate(['dashboard']);
  }

  goToAddNewMeetup(): void {
    this.isOnAdminPage = false;
    this.isEdited = false;
    this.routes.navigate(['meetupform']);
  }
  //! register

  register(
    email: string | null,
    password: string | null,
    fio: string | null
  ): Observable<{
    token: string;
  }> {
    this.isOnAdminPage = false;
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/registration`, {
        email: email,
        password: password,
        fio: fio,
      })
      .pipe(
        map((res) => {
          if (res.token) {
            this.isLogged.next(true);
            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('del_meetups_auth_token', res.token);
            this.routes.navigate(['dashboard']);
          }
          return res;
        })
      );
  }

  //! get data from server

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.backendOrigin}/user`);
  }
  getMeetups(): Observable<Meetup[]> {
    return this.http.get<Meetup[]>(`${environment.backendOrigin}/meetup`);
  }
  getRoles(): void {
    this.http
      .get<Role[]>(`${environment.backendOrigin}/role`)
      .subscribe((data) => {
        this.allroles = data;
      });
  }

  //! subscribe on meetup

  subscribeOnMeetup(
    meetupId: number,
    userId: number | undefined
  ): Observable<Subscribe> {
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

  //! unsubscribe from meetup

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

  //! meetup

  createMeetup(
    name: string | null,
    date: string | null,
    time: string | null,
    duration: string | null,
    location: string | null,
    description: string | null,
    target_audience: string | null,
    need_to_know: string | null,
    will_happen: string | null,
    reason_to_come: string | null
  ) {
    const isoDate: string = new Date(date + ' ' + time).toISOString();
    return this.http.post(`${environment.backendOrigin}/meetup`, {
      name: name,
      description: description,
      time: isoDate,
      duration: duration,
      location: location,
      target_audience: target_audience,
      need_to_know: need_to_know,
      will_happen: will_happen,
      reason_to_come: reason_to_come,
    });
  }

  editMeetup() {
    this.isEdited = true;
    this.routes.navigate(['meetupform']);
  }

  saveChanges(
    id: number,
    name: string | null,
    date: string | null,
    time: string | null,
    duration: string | null,
    location: string | null,
    description: string | null,
    target_audience: string | null,
    need_to_know: string | null,
    will_happen: string | null,
    reason_to_come: string | null
  ) {
    const isoDate: string = new Date(date + ' ' + time).toISOString();
    return this.http.put(`${environment.backendOrigin}/meetup/${id}`, {
      name: name,
      description: description,
      time: isoDate,
      duration: duration,
      location: location,
      target_audience: target_audience,
      need_to_know: need_to_know,
      will_happen: will_happen,
      reason_to_come: reason_to_come,
    });
  }

  deleteMeetup(id: number) {
    return this.http.delete(`${environment.backendOrigin}/meetup/${id}`);
  }

  //! delete / edit user

  deleteUser(user: User) {
    return this.http
      .delete(`${environment.backendOrigin}/user/${user.id}`)
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  editUserRole(name: string, id?: number) {
    return this.http.post(`${environment.backendOrigin}/user/role`, {
      names: [name],
      userId: id,
    });
  }

  editUserData(id: number, email: string, password?: string) {
    if (password) {
      return this.http.put(`${environment.backendOrigin}/user/${id}`, {
        email: email,
        password: password,
      });
    } else {
      return this.http.put(`${environment.backendOrigin}/user/${id}`, {
        email: email,
      });
    }
  }

  //! refresh

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }
}
