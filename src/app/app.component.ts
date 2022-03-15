import { Component } from '@angular/core';

import { CommonService } from "./services/common.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mass-athletic';

  constructor(private newService: CommonService ) {}
    Repdata;
    valbutton = 'Save';
    errorMessage;
    id;
    name;

    ngOnInit() {
    // this.newService.GetUser().subscribe(data => this.Repdata = data)
  }

  // onSave = (user, isValid: boolean) => {
  //   user.mode = this.valbutton;
  //   this.newService.saveUser(user)
  //   .subscribe(data => {alert(data.data);
    
  //   this.ngOnInit();
  // }
  // , error => this.errorMessage = error )
  // }

  edit = (kk) => {
    this.id = kk._id;
    this.name = kk.name;
    this.valbutton = 'Update';
  }

  delete = function(id) {
    this.newService.deleteUser(id)
      .subscribe(data => { alert(data.data) ; this.ngOnInit();}, error => this.errorMessage = error )
  }

}
