import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  providers: [ LoginService ]
})

export class LoginPageComponent implements OnInit {

  public user: User;

  constructor(private loginService: LoginService, private router: Router) {
    this.user = new User();
  }

  validateLogin() {
    if(this.user.username && this.user.password) {
      this.loginService.validateLogin(this.user).subscribe(result => {
        if(result['status'] === 'success') {
          this.router.navigate(['/home']);
        } else { alert('Wrong username password'); }
    }, err => {
      console.log('error is: ', err)
      });
    } 
  }
  
  ngOnInit() {
  }
}