import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { Workout } from 'ui/models/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {

  isLoggedIn;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService) { }

  saveNewWorkout(workout: Workout) {
    return this.http.post('/api/user/addWorkout', {
      ...workout
    });
  }

  getAllWorkouts(): Observable<any> {
    return this.http.post('/api/user/getWorkouts', {
      userId: this.cookieService.get('userId')
    });
  }

  getStats(pastNineMonths: Array<number>): Observable<any> {
    return this.http.post('/api/stats/getAll', {
      userId: this.cookieService.get('userId'),
      ormTimeframe: pastNineMonths
    })
  }

  getAllExercises() {
    return this.http.post('/api/stats/getExercises', {
      userId: this.cookieService.get('userId')
    });
  }
}
