import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { CandidateListComponent } from './pages/candidate-list/candidate-list';
import { AboutUsComponent } from '../../core/pages/about-us/about-us';
import { ContactUsComponent } from '../../core/pages/contact-us/contact-us';
import { LoginComponent } from './pages/login/login';
import { PhotoFrameComponent } from './pages/photo-frame/photo-frame';

const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Vote BNP - Home' },
  { path: 'candidates', component: CandidateListComponent, title: 'Vote BNP - Candidates' },
  { path: 'login', component: LoginComponent, title: 'Vote BNP - Login' },
  { path: 'about-us', component: AboutUsComponent, title: 'Vote BNP - About Us' },
  { path: 'contact-us', component: ContactUsComponent, title: 'Vote BNP - Contact Us' },
  { path: 'frame-editor', component: PhotoFrameComponent, title: 'Vote BNP - Photo Frame Editor' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPortalRoutingModule { }
