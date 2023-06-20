import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  isVisible: boolean;
  isSettingsAccessed: boolean = false;

  constructor() { this.isVisible = false; }

  hide() {
    this.isVisible = false;
  }

  show() {
    this.isVisible = true;
  }
}
