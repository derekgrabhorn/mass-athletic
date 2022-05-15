import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  isVisible: boolean;

  constructor() { this.isVisible = false; }

  hide() {
    this.isVisible = false;
  }

  show() {
    this.isVisible = true;
  }

  toggle() {
    this.isVisible = !this.isVisible;
  }
}
