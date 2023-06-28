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
  if (localStorage.getItem('isAdmin')) {
    return true;
  } else {
    return false;
  }
};
