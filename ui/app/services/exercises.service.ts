import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  saveExercise(exerciseData): Observable<any> {
    return this.http.post('/api/user/saveExercise', {
      userId: this.cookieService.get('userId'),
      data: exerciseData
    }).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        throw err;
      })
    );
  }
}
