import { NgModule } from '@angular/core';
import { FavSelectComponent } from './fav-select/fav-select';
import { VideoCardComponent } from './video-card/video-card';
import { IonicModule } from 'ionic-angular';
import { XImgComponent } from './x-img/x-img';

@NgModule({
	declarations: [FavSelectComponent, VideoCardComponent,
    XImgComponent],
	imports: [IonicModule],
	exports: [FavSelectComponent, VideoCardComponent,
    XImgComponent]
})
export class ComponentsModule { }
