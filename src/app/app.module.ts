import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http"
import { FormsModule } from "@angular/forms";

import { AppRoutingModule, routingComponents, ROUTING } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ChartsModule } from 'ng2-charts';

import { CommonService } from "src/app/services/common.service";
import { NavComponent } from './components/nav/nav.component';
import { StatsComponent } from './components/stats/stats.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NavComponent,
    StatsComponent,
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
    CommonService,
    AuthenticationService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
