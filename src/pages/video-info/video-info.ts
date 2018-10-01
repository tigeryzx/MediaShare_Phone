import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
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
export class VideoInfoPage {

  @ViewChild(FavSelectComponent)
  favSelect: FavSelectComponent;

  currentVideo: Video;

  favs: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
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
            this.videoProvider.deleteVideo(this.currentVideo.id)
              .then(x => {
                this.navCtrl.pop();
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
        window.location.href = 'nplayer-ftp://' + encodeURI(this.currentVideo.ftpPath.replace("ftp://", ""));
      });
  }

  addToFav(): void {
    this.favSelect.open();
  }
}
