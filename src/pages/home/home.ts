import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { VideoListPage } from '../video-list/video-list';
import { FavListPage } from '../fav-list/fav-list';
import { LocalStorgeProvider } from '../../providers/local-storge/local-storage';
import { USER_INFO } from '../../providers/local-storge/local-storage.namespace';
import { LuckVideoRequest } from '../../domain/entity';
import { VideoProvider } from '../../providers/video/video';
import { VideoInfoPage } from '../video-info/video-info';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public localStorage: LocalStorgeProvider,
    private videoProvider: VideoProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  powerOff(): void {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '多少久后关闭系统(秒)?',
      inputs: [
        {
          name: '秒(s)',
          placeholder: '请输入秒数',
          value:'10'
        }
      ],
      buttons: [
        {
          text: '取消',
          handler: () => {

          }
        },
        {
          text: '确认',
          handler: () => {

          }
        }
      ]
    });
    confirm.present();
  }

  longout(): void {

    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '是否确认退出?',
      buttons: [
        {
          text: '取消',
          handler: () => {

          }
        },
        {
          text: '注销',
          handler: () => {
            this.localStorage.clear(USER_INFO);
            this.navCtrl.setPages([{
              page: LoginPage
            }]);
          }
        }
      ]
    });
    confirm.present();
  }

  videoList(): void {
    this.openVideoList(null);
  }

  videoListByHot(): void {
    this.openVideoList('hot');
  }

  videoListByLast(): void {
    this.openVideoList('last');
  }

  videoListByHistory(): void {
    this.openVideoList('history');
  }

  private openVideoList(loadType: string): void {
    this.navCtrl.push(VideoListPage, {
      type: loadType
    });
  }

  favList(): void {
    this.navCtrl.push(FavListPage);
  }

  getLuckVideo(): void {
    let luckParam = new LuckVideoRequest();
    luckParam.inAllVideo = true;
    this.videoProvider.getLuckVideo(luckParam)
      .subscribe(video => {
        this.videoProvider.setCurrentVideo(video);
        this.navCtrl.push(VideoInfoPage);
      });
  }
}
