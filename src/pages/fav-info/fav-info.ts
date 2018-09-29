import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, TextInput } from 'ionic-angular';
import { Favorite } from '../../domain/entity';
import { FavProvider } from '../../providers/fav/fav';

/**
 * Generated class for the FavInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fav-info',
  templateUrl: 'fav-info.html',
})
export class FavInfoPage {

  @ViewChild('favInput')
  favInput: TextInput;

  fav: Favorite;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private favProvider: FavProvider) {
    let fav = navParams.get('fav');
    if (fav)
      this.fav = Object.assign({}, navParams.get('fav') as Favorite);
    else
      this.fav = new Favorite();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavInfoPage');
  }

  save(): void {
    if (this.fav.id) {
      // 编辑
      this.favProvider.updateFav(this.fav, result => {
        this.navCtrl.pop();
      });
    } else {
      // 新增
      this.favProvider.createFav(this.fav.categoryName, result => {
        this.navCtrl.pop();
      });
    }
  }
}
