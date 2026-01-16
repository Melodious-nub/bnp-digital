import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header/header';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top';
import { AboutUsComponent } from './pages/about-us/about-us';
import { ContactUsComponent } from './pages/contact-us/contact-us';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ScrollToTopComponent,
    AboutUsComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    ScrollToTopComponent,
    AboutUsComponent,
    ContactUsComponent
  ]
})
export class CoreModule { }
