import { CanActivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export const adminGuard: CanActivateFn = (
  route,
  state
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  function parseJwt(token: string) {
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
  if (localStorage.getItem('del_meetups_auth_token')) {
    const token = localStorage.getItem('del_meetups_auth_token');
    if (
      token &&
      parseJwt(token).roles.some((item: any) => item.name === 'ADMIN')
    ) {
      return true;
    }
  }
  return false;
};
