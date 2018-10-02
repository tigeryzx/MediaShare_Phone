import { NgModule } from '@angular/core';
import { FavSelectComponent } from './fav-select/fav-select';
import { VideoCardComponent } from './video-card/video-card';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [FavSelectComponent, VideoCardComponent],
	imports: [IonicModule],
	exports: [FavSelectComponent, VideoCardComponent]
})
export class ComponentsModule { }
