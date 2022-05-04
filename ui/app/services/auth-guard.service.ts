import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authenticate: AuthenticationService) { }
  
  canActivate(route: ActivatedRouteSnapshot): boolean|UrlTree {
    if (this.authenticate.isUserLoggedIn()) {
      return true;
    } else {
      this.router.navigate([''], { queryParams: { returnUrl: route.url  }});
      return false;
    }
  }
}
