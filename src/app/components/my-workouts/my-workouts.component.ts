import { Component, OnInit } from '@angular/core';
import { MyWorkoutsService } from 'src/app/services/my-workouts.service';
import { NewWorkoutService, newWorkout } from 'src/app/services/new-workout.service';

@Component({
  selector: 'app-my-workouts',
  templateUrl: './my-workouts.component.html',
  styleUrls: ['./my-workouts.component.css'],
  providers: [
    { provide: MyWorkoutsService, useClass: MyWorkoutsService }
  ]
})
export class MyWorkoutsComponent implements OnInit {
  workouts: newWorkout[];
  constructor(private myWorkout: MyWorkoutsService) { 
  }

  ngOnInit() {
    this.workouts = this.myWorkout.getWorkout();
  }

  newWorkout(event: Event) {
    let newWorkout = new Object;
    
  }

}