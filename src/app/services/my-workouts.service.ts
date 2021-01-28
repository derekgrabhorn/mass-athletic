import { Injectable } from '@angular/core';
import { NewWorkoutService, newWorkout } from './new-workout.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MyWorkoutsService implements NewWorkoutService {
s
  isLoggedIn;

  constructor(private http: HttpClients) { }

  getWorkout() {
    const workout: newWorkout[] = [
      {
        title: `First Workout`,
        description: `This is a test workout for the new app`,
        date: new Date,
        exercises: [
          {
            name: `Pec Fly`,
            muscleGroup: `Chest`,
            reps: 5,
            sets: 4,
            type: `Normal Lift`,
            completed: true
          }
        ]
      }
    ] 
    return workout;
  }

  retrieveOneRepMaxStats(user: User, muscleGroup_1: String, muscleGroup_2: String, muscleGroup_3: String) {
    return this.http.post('/api/user/stats', {
      username: user.username,
      collection: "workouts",
      firstWorkout: muscleGroup_1,
      secondWorkout: muscleGroup_2,
      thirdWorkout: muscleGroup_3
    }).subscribe(result => {
      if(result['status'] === 'success') {
        this.isLoggedIn = true;
        //this.router.navigate(['/home']);
      } else { alert('Wrong username password'); }
    }, err => { console.log('error is: ', err) });
  }
}
