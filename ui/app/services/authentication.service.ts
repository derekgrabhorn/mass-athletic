import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'ui/models/user.model';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from './nav.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isLoggedIn: boolean;
  private userName: string;
  public userId: string;

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService,
              public navService: NavService){
    this.cookieService.set('authenticated', 'false');
  }

  validateLogin(user: User) {
    return this.http.post('/api/user/login', {
      username: user.username,
      password: user.password
    }).subscribe(result => {
      if(result['status'] === 'success') {
        this.cookieService.set('authenticated', 'true');
        this.cookieService.set('userId', result['userId']);
        this.navService.show();
        this.router.navigate(['/home']);
      } else { alert('Wrong username password'); }
    }, err => { console.log('error is: ', err) });
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
