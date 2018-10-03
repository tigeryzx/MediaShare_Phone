import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FavSelectComponent } from '../../components/fav-select/fav-select';
import { Video, Image, VideoCoverSetting } from '../../domain/entity';
import { VideoProvider } from '../../providers/video/video';

/**
 * Generated class for the VideoInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-video-info',
  templateUrl: 'video-info.html',
})
export class VideoInfoPage{

  @ViewChild(FavSelectComponent)
  favSelect: FavSelectComponent;

  currentVideo: Video;

  favs: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private videoProvider: VideoProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoInfoPage');
    this.currentVideo = this.videoProvider.getCurrentVideo();
    this.videoProvider.viewCurrentVideo().subscribe();
  }

  showMenu(image: Image): void {

    if (image.isStoryCascade)
      return;

    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '设为封面',
          handler: () => {
            console.log('Destructive clicked');
            var param = new VideoCoverSetting(this.currentVideo.id, image.id);
            this.videoProvider.setVideoCover(param);
          }
        }
      ]
    });
    actionSheet.present();
  }

  afterDelete(): void {
    this.navCtrl.pop();
  }
}
