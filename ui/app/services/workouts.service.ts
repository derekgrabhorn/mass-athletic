import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { Workout } from 'ui/models/interfaces';
import { MuscleGroups } from 'ui/models/enums';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {

  isLoggedIn;

  constructor(private http: HttpClient,
              private cookieService: CookieService          
  ) {}

  writeWorkout(workout: Workout) {
    return this.http.post('/api/user/addWorkout', {
      ...workout
    }).subscribe(result => {
      if(result['status'] === 'success') {
      }
    })
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
}
