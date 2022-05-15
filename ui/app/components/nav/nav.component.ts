import { Component, OnInit } from '@angular/core';
import { NavService } from 'ui/app/services/nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(public navService: NavService) { }
  ngOnInit() { }

}
