import { Component, Input } from '@angular/core';
import { Video } from '../../domain/entity';

/**
 * Generated class for the VideoCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'video-card',
  templateUrl: 'video-card.html'
})
export class VideoCardComponent {

  @Input()
  video: Video;

  @Input()
  showActionButton:boolean = false;

  constructor() {
    console.log('Hello VideoCardComponent Component');
  }

}
