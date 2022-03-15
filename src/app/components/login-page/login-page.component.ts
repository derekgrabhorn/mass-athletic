import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  providers: []
})

export class LoginPageComponent implements OnInit {

  public user: User;

  constructor(private authenticate: AuthenticationService, private router: Router) {
    this.user = new User();
  }

  validateLogin() {
      this.authenticate.validateLogin(this.user);
  }
  
  ngOnInit() {
    if(this.authenticate.isUserLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }
}