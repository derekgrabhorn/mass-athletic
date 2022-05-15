import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http"
import { FormsModule } from "@angular/forms";

import { AppRoutingModule, routingComponents, ROUTING } from 'ui/app/app-routing.module';
import { AppComponent } from 'ui/app/app.component';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { CommonService } from "ui/app/services/common.service";
import { NavComponent } from './components/nav/nav.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { CookieService } from 'ngx-cookie-service';
import { SecondsDhmsPipe } from './pipes/seconds-dhms.pipe';
import { NewWorkoutComponent } from './components/new-workout/new-workout.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NavComponent,
    SecondsDhmsPipe,
    NewWorkoutComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    ROUTING,
    ChartsModule
  ],
  providers: [
    ThemeService,
    CookieService,
    CommonService,
    AuthenticationService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
