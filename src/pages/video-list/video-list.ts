import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, FabContainer } from 'ionic-angular';
import { VideoInfoPage } from '../video-info/video-info';
import { VideoProvider } from '../../providers/video/video';
import { VideoPageRequest, PageResult, Video, Favorite } from '../../domain/entity';

/**
 * Generated class for the VideoListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
n */

@Component({
  selector: 'page-video-list',
  templateUrl: 'video-list.html',
})
export class VideoListPage {

  @ViewChild(Content)
  content: Content;

  @ViewChild(FabContainer)
  fabContainer: FabContainer;

  title: string;
  videoPageRequest: VideoPageRequest = new VideoPageRequest();
  videoPageResult: PageResult<Video>;
  showSearchBox: boolean = false;
  searchInput: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private videoProvider: VideoProvider) {
    const title = navParams.get('title');
    const fav: Favorite = navParams.get('fav');

    if (title) {
      // 所有视频
      this.title = navParams.get('title');
    } else if (fav) {
      // 收藏分类
      this.title = fav.categoryName;
      this.videoPageRequest.favId = fav.id;
    }

  }

  public get loadCount() {
    let total: number = this.videoPageRequest.skipCount;
    if (!this.videoPageResult)
      return 0;
    if (total > this.videoPageResult.totalCount)
      return this.videoPageResult.totalCount;
    else
      return total;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoListPage');
    this.loadPageData();
  }

  loadPageData(): Promise<any> {
    return new Promise((resolve) => {
      this.videoProvider.getAllVideo(this.videoPageRequest)
        .subscribe(result => {
          if (this.videoPageResult == null) {
            this.videoPageResult = result;
          } else {
            this.videoPageResult.items.push(...result.items);
          }
          // 翻页
          this.videoPageRequest.skipCount += this.videoPageRequest.maxResultCount;
          resolve();
        });

    });
  }

  showVideoInfo(video): void {
    this.navCtrl.push(VideoInfoPage, {
      video: video
    });
  }

  getLuckVideo(): void {
    this.navCtrl.push(VideoInfoPage);
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');
    return this.loadPageData();
  }

  goToTop(): void {
    this.fabContainer.close();
    this.content.scrollToTop();
  }

  onInput($event): void {
    this.videoPageRequest.videoName = this.searchInput;
    this.loadPageData();
  }

  onCancel($event): void {

  }

  toggleSearchBox(): void {
    this.showSearchBox = !this.showSearchBox;
  }
}

