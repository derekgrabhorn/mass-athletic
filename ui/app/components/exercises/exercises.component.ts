import { Component, OnInit } from '@angular/core';
import { DataService } from 'ui/app/services/data.service';
import { WorkoutsService } from 'ui/app/services/workouts.service';
import { ExercisesService } from 'ui/app/services/exercises.service';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {

  exerciseList = [];
  muscleGroups: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  muscleNames: string[];
  isModalOpen = false;
  isDropdownOpen = false;
  newExercise = {
    "name": "",
    "group": "",
    "primaryMuscles": [],
    "secondaryMuscles": []
  };

  constructor(
    private workoutsService: WorkoutsService,
    public dataService: DataService,
    private exerciseService: ExercisesService) { }

  ngOnInit() {
    this.workoutsService.getAllExercises().subscribe((result: Array<any>) => {
      this.exerciseList = result;
    });

    this.dataService.muscleGroups.subscribe(data => {
      this.muscleGroups = data;
    });

    this.dataService.muscles.subscribe(data => {
      this.primaryMuscles = data;
      this.secondaryMuscles = data;
    })

    
  }

  clearExerciseObject() {
    this.newExercise = {
      "name": "",
      "group": "",
      "primaryMuscles": [],
      "secondaryMuscles": []
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.clearExerciseObject();
  }

  saveExercise() {
    this.exerciseService.saveExercise(this.newExercise).subscribe(result => {
      this.closeModal();
    })
  }

  selectGroup(muscleGroupSelected) {
    this.newExercise.group = muscleGroupSelected;
    this.toggleDropdown();
  }

}
