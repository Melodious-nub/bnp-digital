import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPortalRoutingModule } from './main-portal-routing-module';
import { LandingComponent } from './pages/landing/landing';
import { MapComponent } from './components/map/map';
import { CandidateListComponent } from './pages/candidate-list/candidate-list';
import { LoginComponent } from './pages/login/login';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LandingComponent,
    MapComponent,
    CandidateListComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    MainPortalRoutingModule,
    FormsModule
  ]
})
export class MainPortalModule { }
