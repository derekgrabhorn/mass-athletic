import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { User } from 'ui/models/user.model';
import { NavService } from './nav.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isLoggedIn: boolean;
  private userName: string;
  public userId: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    public navService: NavService,
    public UserService: UserService) {
    this.checkAuthenticationStatus();
  }

  checkAuthenticationStatus(): void {
    const isAuthenticated = this.cookieService.get('authenticated') === 'true';
    if (isAuthenticated) {
      const userId = this.cookieService.get('userId');
      const firstName = this.cookieService.get('firstName');
      const lastName = this.cookieService.get('lastName');
      this.UserService.setCookieData(userId, firstName, lastName);
      this.navService.show();
    }
  }

  async createAndLogin(user: User, endpoint: string): Promise<string> {
    try {
      const result = await this.http.post(endpoint, {
        username: user.username,
        password: user.password
      }).toPromise();
      if (result['status'] === 'success') {
        this.cookieService.set('authenticated', 'true');
        this.cookieService.set('userId', result['userId']);
        this.cookieService.set('firstName', result['firstName']);
        this.cookieService.set('lastName', result['lastName']);
        this.UserService.setCookieData(result['userId'], result['firstName'], result['lastName']);
        this.navService.show();
        this.router.navigate(['/home']);
        return 'success';
      } else {
        return result['message'];
      }
    } catch (err) {
      return err['error']['message'];
    }
  }
  
  isUserLoggedIn(): boolean {
    return this.cookieService.get('authenticated') === 'true' ? true : false;
  }

  isAdminUser(): boolean {
    return this.userName == 'Admin' ? true : false;
  }
  
  logoutUser(): void {
    this.cookieService.set('authenticated', 'false');
  }

}
