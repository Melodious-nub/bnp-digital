import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPortalRoutingModule } from './main-portal-routing-module';
import { LandingComponent } from './pages/landing/landing';
import { MapComponent } from './components/map/map';
import { CandidateListComponent } from './pages/candidate-list/candidate-list';
import { LoginComponent } from './pages/login/login';
import { PhotoFrameComponent } from './pages/photo-frame/photo-frame';
import { ReformPlanComponent } from './pages/reform-plan/reform-plan';

import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core-module';

@NgModule({
  declarations: [
    LandingComponent,
    MapComponent,
    CandidateListComponent,
    LoginComponent,
    PhotoFrameComponent,
    ReformPlanComponent
  ],
  imports: [
    CommonModule,
    MainPortalRoutingModule,
    FormsModule,
    CoreModule
  ]
})
export class MainPortalModule { }
