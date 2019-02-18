import { Component, Input, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { Video } from '../../domain/entity';
import { AlertController } from 'ionic-angular';
import { VideoProvider } from '../../providers/video/video';
import { FavSelectComponent } from '../fav-select/fav-select';

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
export class VideoCardComponent implements OnInit {

  @Input()
  video: Video;
  @Input()
  showActionButton: boolean = false;
  @Input()
  onlyShowCover: boolean = true;

  @Output()
  private afterDelete = new EventEmitter();

  @ViewChild(FavSelectComponent)
  favSelect: FavSelectComponent;

  constructor(
    private alertCtrl: AlertController,
    private videoProvider: VideoProvider
  ) {
    
  }

  ngOnInit(): void {
 
  }

  delete(): void {
    const confirm = this.alertCtrl.create({
      title: '删除视频',
      message: '删除后会将源文件也删除，确认操作吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确认',
          handler: () => {
            this.videoProvider.deleteVideo(this.video.id)
              .then(x => {
                this.afterDelete.emit();
              });
          }
        }
      ]
    });
    confirm.present();
  }

  play(): void {
    this.videoProvider.playCurrentVideo()
      .subscribe(x => {
        window.location.href = 'nplayer-ftp://' + encodeURI(this.video.ftpPath.replace("ftp://", ""));
      });
  }

  addToFav(): void {
    this.favSelect.open();
  }
}
