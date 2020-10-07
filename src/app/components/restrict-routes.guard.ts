import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {take, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestrictRoutesGuard implements CanActivate {
  constructor(private oAuth: AngularFireAuth, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.oAuth.authState
      .pipe(
        map(user => {
          if (!user) {
            this.router.navigate(['']);
            return false;
          }
          return true;
        })
      );
  }

}
