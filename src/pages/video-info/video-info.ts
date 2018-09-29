import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { FavSelectComponent } from '../../components/fav-select/fav-select';
import { Video, Image } from '../../domain/entity';
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

    this.currentVideo = navParams.get('video') as Video;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoInfoPage');
  }

  showMenu(image: Image): void {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '设为封面',
          handler: () => {
            console.log('Destructive clicked');
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
              .subscribe(x => {
                this.navCtrl.pop();
                // TODO: 移除列表中的视频信息
              });
          }
        }
      ]
    });
    confirm.present();
  }

  play(): void {
    window.location.href = 'nplayer-ftp://' + encodeURI(this.currentVideo.ftpPath.replace("ftp://", ""));
  }

  addToFav(): void {
    this.favSelect.open();
  }
}
