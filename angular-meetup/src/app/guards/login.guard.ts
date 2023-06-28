import { CanActivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export const loginGuard: CanActivateFn = (
  route,
  state
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  if (localStorage.getItem('del_meetups_auth_token')) {
    return true;
  } else {
    return false;
  }
};
