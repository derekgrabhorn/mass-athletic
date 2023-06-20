import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataStore: { 
    muscleGroups: string[],
    muscles: string[]
  }

  private _muscleGroups: BehaviorSubject<string[]>;
  private _muscles: BehaviorSubject<string[]>;

  public readonly muscleGroups: Observable<string[]>;
  public readonly muscles: Observable<string[]>;

  constructor() { 
    this.dataStore = {
      muscleGroups: [],
      muscles: []
    };
    this._muscleGroups = new BehaviorSubject<string[]>([]);
    this._muscles = new BehaviorSubject<string[]>([]);
    this.muscleGroups = this._muscleGroups.asObservable();
    this.muscles = this._muscles.asObservable();
  }

  saveMuscleGroups(data): void {
    this.dataStore.muscleGroups = data;
    this._muscleGroups.next(Object.assign({}, this.dataStore).muscleGroups);
  }

  saveMuscleNames(data): void {
    this.dataStore.muscles = data;
    this._muscles.next(Object.assign({}, this.dataStore).muscles);
  }
}
