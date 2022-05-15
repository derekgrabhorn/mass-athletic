import { Component, OnInit } from '@angular/core';
import { WorkoutsService } from 'ui/app/services/workouts.service';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {

  exerciseList = [];

  constructor(private workoutsService: WorkoutsService) { }

  ngOnInit() {
    this.workoutsService.getAllExercises().subscribe((result: Array<any>) => {
      this.exerciseList = result;
    });
  }

}
