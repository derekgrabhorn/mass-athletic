import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-new-workout',
  templateUrl: './new-workout.component.html',
  styleUrls: ['./new-workout.component.css']
})
export class NewWorkoutComponent implements OnInit {

  workoutTimer: number = 0;
  private _timerSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    this._timerSubscription = timer(0,1000).subscribe(elapsed => {
      this.workoutTimer = elapsed;
    })
  }

  ngOnDestroy() {
    this._timerSubscription.unsubscribe();
  }

}
