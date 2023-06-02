import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'ui/app/services/authentication.service';
import { User } from 'ui/models/user.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  providers: []
})

export class LoginPageComponent implements OnInit {

  public user: User;
  private errorResponse: string = null;

  constructor(
    private authenticate: AuthenticationService, 
    private router: Router) {
    this.user = new User();
  }

  async accountAction(actionType: string) {
    let endpoint = (
      actionType == 'login' ? '/api/user/login':
      actionType == 'create' ? '/api/user/create':
      null
    )
    try {
      const result = await this.authenticate.createAndLogin(this.user, endpoint);
      if (result !== 'success') {
        this.errorResponse = result;
      }
    } catch (err) {
      this.errorResponse = err;
    }
  }

  closeError() {
    this.errorResponse = null;
  }
  
  ngOnInit() {
    if(this.authenticate.isUserLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }
}