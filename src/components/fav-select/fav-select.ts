import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Favorite, Video, FavoriteVideoChangeRequest } from '../../domain/entity';
import { FavProvider } from '../../providers/fav/fav';

/**
 * Generated class for the FavSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'fav-select',
  templateUrl: 'fav-select.html'
})
export class FavSelectComponent implements AfterViewInit, OnDestroy {

  favs: Favorite[] = [];
  selFavs: number[] = [];

  @Input()
  video: Video;

  constructor(
    private favProvider: FavProvider,
    public alertCtrl: AlertController
  ) {

  }

  ngAfterViewInit(): void {
    this.initFav();
  }

  initFav() {
    if (this.video.favorite && this.video.favorite.length > 0) {
      this.selFavs = [];
      this.video.favorite.forEach(selfav => {
        this.selFavs.push(selfav.id);
      });
    }
  }

  ngOnDestroy(): void {

  }

  open(): void {
    this.favProvider.getFavList()
      .then(x => {
        this.favs = x;
        this.showFavList();
      });
  }

  showFavList(): void {
    let alert = this.alertCtrl.create();
    alert.setTitle('选择收藏夹');

    this.favs.forEach(fav => {
      let checked = this.selFavs.find(x => fav.id == x) != null;
      alert.addInput({ type: 'checkbox', label: fav.categoryName, value: fav.id.toString(), checked: checked });
    });

    alert.addButton('取消');
    alert.addButton({
      text: '确认',
      handler: (data: number[]) => {
        console.log('Checkbox data:', data);
        let param = new FavoriteVideoChangeRequest();
        param.videoId = this.video.id;

        // 处理新增的收藏
        let addFavIds: number[] = [];
        data.forEach(favId => {
          if (this.video.favorite && this.video.favorite.find(x => x.id == favId) != null)
            return;
          addFavIds.push(favId);
        });

        // 处理删除的收藏
        let delFavIds: number[] = [];
        if (this.video.favorite) {
          this.video.favorite.forEach(oldFav => {
            if (data.find(x => x == oldFav.id) == null) {
              delFavIds.push(oldFav.id);
            }
          });
        }

        if (addFavIds.length > 0) {
          param.favIds = addFavIds;
          this.favProvider.likeVideo(param)
            .subscribe(x => {
              if (!this.video.favorite)
                this.video.favorite = [];
              addFavIds.forEach(favId => {
                var fav = this.favs.find(fav => fav.id == favId);
                this.video.favorite.push(fav);
                this.initFav();
              });
            });
        }

        if (delFavIds.length > 0) {
          param.favIds = delFavIds;
          this.favProvider.unLikeVideo(param)
            .subscribe(x => {
              delFavIds.forEach(favId => {
                var delFav = this.video.favorite.find(fav => fav.id == favId);
                var favIndex = this.video.favorite.indexOf(delFav);
                this.video.favorite.splice(favIndex, 1);
                this.initFav();
              });
            });
        }

      }
    });

    alert.present();
  }
}
