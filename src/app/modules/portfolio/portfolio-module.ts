import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing-module';


import { ProfileComponent } from './pages/profile/profile';
import { GalleryComponent } from './components/gallery/gallery';
import { VideoFeedComponent } from './components/video-feed/video-feed';

import { CoreModule } from '../../core/core-module';

@NgModule({
  declarations: [
    ProfileComponent,
    GalleryComponent,
    VideoFeedComponent
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    CoreModule
  ]
})
export class PortfolioModule { }
