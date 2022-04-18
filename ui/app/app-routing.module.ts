import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'ui/app/services/auth-guard.service';

import { HomepageComponent } from 'ui/app/components/homepage/homepage.component';
import { MyWorkoutsComponent } from 'ui/app/components/my-workouts/my-workouts.component';
import { ExercisesComponent } from 'ui/app/components/exercises/exercises.component';
import { SettingsComponent } from 'ui/app/components/settings/settings.component';
import { ErrorPageComponent } from 'ui/app/components/error-page/error-page.component';
import { LoginPageComponent } from 'ui/app/components/login-page/login-page.component';
import { NewWorkoutComponent } from './components/new-workout/new-workout.component';

const routes: Routes = [
  { path: '',
    component: LoginPageComponent
  },
  { path: 'home',
    component: HomepageComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'my-workouts', 
    component: MyWorkoutsComponent,
    canActivate: [AuthGuardService] 
  },
  { path: 'exercises', 
    component: ExercisesComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'settings', 
    component: SettingsComponent,
    canActivate: [AuthGuardService] 
  },
  {
    path: 'new-workout',
    component: NewWorkoutComponent,
    canActivate: [AuthGuardService]
  },
  { path: '**',  
    component: ErrorPageComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RouterModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);

export const routingComponents = [
  HomepageComponent,
  MyWorkoutsComponent,
  ExercisesComponent,
  SettingsComponent,
  ErrorPageComponent,
  LoginPageComponent
]
