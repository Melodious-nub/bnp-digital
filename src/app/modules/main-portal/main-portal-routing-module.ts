import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { CandidateListComponent } from './pages/candidate-list/candidate-list';
import { LoginComponent } from './pages/login/login';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'candidates', component: CandidateListComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPortalRoutingModule { }
