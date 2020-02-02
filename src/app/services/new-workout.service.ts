import { Injectable } from '@angular/core';

export interface newWorkout {
  title: string;
  description: string;
  date: Date;
  exercises: Array<Exercises>;
}

export interface Exercises {
  name: string;
  muscleGroup: string;
  reps: number;
  sets: number;
  type: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewWorkoutService {

  constructor() { }
}
