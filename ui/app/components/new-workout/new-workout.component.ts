import { Component, OnInit, ElementRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Workout, Exercise, Set, DefaultExercise } from '../../../models/interfaces';
import { CookieService } from 'ngx-cookie-service';
import { Muscle, MuscleGroups } from 'ui/models/enums';
import { WorkoutsService } from 'ui/app/services/workouts.service';
import { Router } from '@angular/router';
import 'boxicons';

@Component({
  selector: 'app-new-workout',
  templateUrl: './new-workout.component.html',
  styleUrls: ['./new-workout.component.css']
})
export class NewWorkoutComponent implements OnInit {

  setRepsInput;
  setWeightInput;
  setWorkoutNameInput;
  tempStoreReps;
  tempStoreWeight;
  newExercise: Exercise;
  isDropdownActive: boolean;
  isNewExercise: boolean = false;
  masterExerciseList: Array<DefaultExercise> = [];
  workoutTimer: number = 0;
  private _timerSubscription: Subscription;
  workout: Workout = {
    status: 'inactive',
    userId: this.cookieService.get('userId'),
    name: 'Workout Name',
    start: new Date(),
    end: null,
    duration: null,
    exercises: []
  };

  constructor(private cookieService: CookieService, private workoutsService: WorkoutsService, private router: Router) {}

  ngOnInit() {
    this._timerSubscription = timer(0,1000).subscribe(elapsed => {
      this.workoutTimer = elapsed;
    });

    this.workoutsService.getAllExercises().subscribe((result: Array<any>) => {
      result.forEach((workout) => {
        this.masterExerciseList.push(workout);
      })
    });
  }

  ngOnDestroy() {
    this._timerSubscription.unsubscribe();
  }

  editWorkoutName() {
    this.workout.status = 'editing-name';
  }

  saveWorkoutName() {
    this.workout.name = this.setWorkoutNameInput;
    this.setWorkoutNameInput = '';
    this.workout.status = 'inactive'
  }

  addSet(exercise) {
    let newSequential = exercise.sets[exercise.sets.length-1].number + 1;
    exercise.sets.push({active: true, number: newSequential, reps: 1, weight: 100});
  }

  addExercise() {
    this.isNewExercise = true;
  }

  changeActiveStatus(exercise) {
    exercise.active = !exercise.active;
  }

  deleteExercise(exercise) {
    let index = this.workout.exercises.indexOf(exercise);
    if (index > -1) {
      this.workout.exercises.splice(index, 1);
    }
  }

  setNewExercise(exercise) {
    this.newExercise = {...exercise};
    this.newExercise.active = true;
  }

  changeDropdownStatus() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  addNewSet() {
    let newSetNumber: number;

    if (!this.newExercise.sets) {
      this.newExercise.sets = [];
    }

    if (this.newExercise.sets.length > 0) {
      // newSetNumber = this.newExercise.sets.at(-1).number+1;
    } else {
      newSetNumber = 1;
    }

    this.newExercise.sets.push({
      status: 'inactive',
      number: newSetNumber,
      reps: 0,
      weight: 0,
      oneRepMax: false
    })
  }

  closeNewExerciseModal() {
    this.isNewExercise = false;
    this.newExercise = null;
  }

  saveNewExercise() {
    this.workout.exercises.push(this.newExercise);
    this.closeNewExerciseModal();
  }

  saveWorkout() {
    this.workout.end = new Date();
    this.workout.duration = this.workoutTimer;
    this.workoutsService.saveNewWorkout(this.workout).subscribe((result => {
      if (result['status'] === 'success') {
        this.router.navigate(['/home'])
      } else {
        console.log(result);
      }
    }));
  }

  deleteSet(setToDelete) {
    let index = this.newExercise.sets.indexOf(setToDelete);
    this.newExercise.sets.splice(index, 1);
  }

  editSet(setToEdit) {
    this.tempStoreReps = setToEdit.reps;
    this.tempStoreWeight = setToEdit.weight;

    this.newExercise.sets.forEach((entry) => {
      if (entry !== setToEdit) {
        entry.status='inactive'
      } else {
        entry.status='active'
      }
    });

    this.setRepsInput = setToEdit.reps;
    this.setWeightInput = setToEdit.weight;
  }

  saveSet(setToSave) {
    setToSave.status = 'inactive';
    setToSave.reps = this.setRepsInput;
    setToSave.weight = this.setWeightInput;
  }

  cancelSetEdit(set) {
    set.status = 'inactive';
    set.reps = this.tempStoreReps;
    set.weight = this.tempStoreWeight;
  }
}
