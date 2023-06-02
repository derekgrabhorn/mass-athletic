import { Component, OnInit } from '@angular/core';
import { UserService } from 'ui/app/services/user.service';
import { NavService } from 'ui/app/services/nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(
    public navService: NavService,
    public UserService: UserService) { }

  ngOnInit() { }

  viewSettings() {
    this.UserService.getUserData();
    this.navService.isSettingsAccessed = true;
  }
}
