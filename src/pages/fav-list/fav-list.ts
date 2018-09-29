import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FavInfoPage } from '../fav-info/fav-info';
import { VideoListPage } from '../video-list/video-list';
import { FavProvider } from '../../providers/fav/fav';
import { Favorite } from '../../domain/entity';

/**
 * Generated class for the FavListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fav-list',
  templateUrl: 'fav-list.html',
})
export class FavListPage {

  favs: Favorite[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public favProvider: FavProvider,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavListPage');
    this.favProvider.favList$
      .subscribe(favs => {
        this.favs = favs;
      });
    this.favProvider.loadFavList();
  }

  showFavInfo(fav: Favorite): void {
    this.navCtrl.push(FavInfoPage, {
      fav: fav
    });
  }

  showFavVideoList(fav: Favorite): void {
    this.navCtrl.push(VideoListPage, {
      fav: fav
    });
  }

  addNewFav(): void {
    this.navCtrl.push(FavInfoPage);
  }

  deleteFav(fav: Favorite): void {
    const confirm = this.alertCtrl.create({
      title: '删除确认',
      message: '删除后将不可恢复，确认操作吗?',
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
            this.favProvider.deleteFav(fav.id);
          }
        }
      ]
    });
    confirm.present();
  }
}
