import { NgModule } from '@angular/core';
import { FavSelectComponent } from './fav-select/fav-select';
import { VideoCardComponent } from './video-card/video-card';
@NgModule({
	declarations: [FavSelectComponent,
    VideoCardComponent],
	imports: [],
	exports: [FavSelectComponent,
    VideoCardComponent]
})
export class ComponentsModule {}
