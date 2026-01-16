import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { CandidateListComponent } from './pages/candidate-list/candidate-list';
import { AboutUsComponent } from '../../core/pages/about-us/about-us';
import { ContactUsComponent } from '../../core/pages/contact-us/contact-us';
import { LoginComponent } from './pages/login/login';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'candidates', component: CandidateListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPortalRoutingModule { }
