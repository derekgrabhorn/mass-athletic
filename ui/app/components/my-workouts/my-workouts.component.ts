import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { WorkoutsService } from 'ui/app/services/workouts.service';

import { Muscle, MuscleGroups } from 'ui/models/enums';
import { Workout } from 'ui/models/interfaces'; 

@Component({
  selector: 'app-my-workouts',
  templateUrl: './my-workouts.component.html',
  styleUrls: ['./my-workouts.component.css'],
  providers: [
    { provide: WorkoutsService, useClass: WorkoutsService }
  ]
})
export class MyWorkoutsComponent implements OnInit {

  workoutsArray: Array<any>;
  activeContent;
  activeExercise;
  modalStatus: Boolean;

  constructor(
    private workoutService: WorkoutsService,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.workoutService.getAllWorkouts().subscribe(result => {
      this.workoutsArray = result['workouts'];
      this.workoutsArray.forEach((workout) => {
        workout.status = false;
        let workoutDate = new Date(workout.start);
        workout.date = workoutDate.getTime() / 1000;
      })
    })
  }

  newWorkout() {
    // let creationDate = new Date();

    // let newWorkout: Workout =  {
    //   userId: this.cookieService.get('userId'),
    //   name: 'workout1',
    //   start: creationDate,
    //   end: creationDate,
    //   duration: Math.abs(creationDate.getTime() - creationDate.getTime()) / 1000,
    //   exercises: [{
    //     name: 'Pec Fly',
    //     muscleGroup: MuscleGroups.Legs,
    //     primaryMuscle: Muscle.Pecs,
    //     secondaryMuscle: [Muscle.Triceps],
    //     sets: [{
    //       reps: 1,
    //       weight: 225,
    //       oneRepMax: true
    //     }]
    //   }
    //   ]
    // };

    // this.workoutService.writeWorkout(newWorkout);

    this.modalStatus = true;
  }

  activate(thisWorkout: any) {
    thisWorkout.status = !thisWorkout.status;
    this.activeExercise = undefined;
    this.activeContent = thisWorkout;
    //this.activeContent.exercises = Object.keys(thisWorkout.exercises);
  }

  selectExercise(exercise: any) {
    this.activeExercise = exercise;
  }

}