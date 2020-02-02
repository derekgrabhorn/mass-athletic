import { Injectable } from '@angular/core';
import { NewWorkoutService, newWorkout } from './new-workout.service';

@Injectable({
  providedIn: 'root'
})
export class MyWorkoutsService implements NewWorkoutService {
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

  constructor() { }
}
