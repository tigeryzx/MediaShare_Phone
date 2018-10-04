import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Content } from 'ionic-angular';
import { FavSelectComponent } from '../../components/fav-select/fav-select';
import { Video, Image, VideoCoverSetting } from '../../domain/entity';
import { VideoProvider } from '../../providers/video/video';

declare var PhotoSwipe: any;
declare var PhotoSwipeUI_Default: any;
declare var document: any;

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

  @ViewChild(Content)
  mainContent: Content;

  currentVideo: Video;

  favs: string[] = [];

  bigImgList: { src: string, w: number, h: number }[] = [];

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

    // 加载大图
    if (this.currentVideo.images && this.currentVideo.images.length > 0) {
      this.currentVideo.images.forEach(item => {
        this.bigImgList.push({
          w: item.width,
          h: item.height,
          src: item.bigUrl
        });
      });
    }
  }

  showBigImg(index: number): void {
    if (!this.bigImgList)
      return;

    var pswpElement = document.querySelectorAll('.pswp')[0];

    // define options (if needed)
    var options = {
      shareEl: false,
      fullscreenEl: false,
      index: index,
      //关闭图片动画效果
      getThumbBoundsFn: function (i) {
        // find thumbnail element
        var thumbnail = document.querySelector('.gallery-' + i);

        // get window scroll Y
        var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        // optionally get horizontal scroll

        // get position of element relative to viewport
        var rect = thumbnail.getBoundingClientRect();
        
        // w = width
        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }
    };

    // Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.bigImgList, options);
    gallery.init();
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
