import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private cookieService: CookieService, 
    private http: HttpClient) { }

  private _userData: any = {
    userId: null,
    firstName: null,
    lastName: null,
    measurementSystem: null
  };

  setCookieData(id, first, last) {
    this.userId = id;
    this.firstName = first;
    this.lastName = last;
  }

  getUserData = async () => {
    try {
      const result = await this.http.post('/api/user/getProfile', {
        userId: this.cookieService.get('userId'),
      }).toPromise();
      if (result['status'] === 'success') {
        this.measurementSystem = result['systemUsed'];
      }
    } catch (err) {
      throw err;
    }
  }

  get allUserData() {
    return this._userData;
  }

  get userId() {
    return this._userData.userId
  }

  set userId(id) {
    this._userData.userId = id;
  }

  set firstName(name) {
    this._userData.firstName = name;
  }

  get firstName() {
    return this._userData.firstName;
  }

  set lastName(name) {
    this._userData.lastName = name;
  }

  get lastName() {
    return this._userData.lastName;
  }

  set measurementSystem(system) {
    this._userData.measurementSystem = system;
  }

  get measurementSystem() {
    return this._userData.measurementSystem;
  }

}
