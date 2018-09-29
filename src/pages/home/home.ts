import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { VideoListPage } from '../video-list/video-list';
import { FavListPage } from '../fav-list/fav-list';
import { LocalStorgeProvider } from '../../providers/local-storge/local-storage';
import { USER_INFO } from '../../providers/local-storge/local-storage.namespace';

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
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
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
    this.navCtrl.push(VideoListPage, { title: '所有视频' });
  }

  favList(): void {
    this.navCtrl.push(FavListPage);
  }
}
