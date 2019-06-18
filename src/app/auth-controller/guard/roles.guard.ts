import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.getUserLoggedIn()) {
      return true;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {

    let status = false;
    let myRole = this.authService.getRole();
    let roles = route.data['roles'] as Array<string>;

    for (let i = 0; i < myRole.length; i++) {
      if (!roles || roles.indexOf(myRole[i]) !== -1) {
        status = true;
      }
    }
    if (status) {
      return true;
    } else {
      this.router.navigate(['error404']); //или на страницу авторизации
      return false;
    }

  }
}
