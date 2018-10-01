import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, Content, FabContainer } from 'ionic-angular';
import { VideoInfoPage } from '../video-info/video-info';
import { VideoProvider } from '../../providers/video/video';
import { VideoPageRequest, Video, Favorite, LuckVideoRequest } from '../../domain/entity';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
export class VideoListPage implements OnDestroy {

  @ViewChild(Content)
  content: Content;

  @ViewChild(FabContainer)
  fabContainer: FabContainer;

  title: string = '所有视频';
  videoPageRequest: VideoPageRequest = new VideoPageRequest();
  showSearchBox: boolean = false;
  searchInput: string;
  infiniteScroll: any = null;
  enableScrollLoad: boolean = true;

  videoList: Video[] = [];
  videoTotalCount: number = 0;

  private searchTerms$ = new Subject<string>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private videoProvider: VideoProvider) {
    const loadType = navParams.get('type');
    const fav: Favorite = navParams.get('fav');

    if (fav) {
      // 收藏分类
      this.title = fav.categoryName;
      this.videoPageRequest.favId = fav.id;
    } else if (loadType) {
      if (loadType == 'hot') {
        this.title = '经常看的';
        this.videoPageRequest.isHotPlay = true;
      } else if (loadType == 'last') {
        this.title = '最近播放';
        this.videoPageRequest.isLatePlay = true;
      } else if (loadType == 'history') {
        this.title = '最近查看';
        this.videoPageRequest.isHistoryView = true;
      }
    }

  }

  ngOnDestroy(): void {
    this.videoProvider.clearVideoList();
    console.log('OnDestroy video list');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoListPage');
    this.videoProvider.videoList$
      .subscribe(videoList => {
        this.videoList = videoList;
        this.scrollComplete();
      });
    this.videoProvider.videoTotalCount$
      .subscribe(videoTotalCount => {
        this.videoTotalCount = videoTotalCount;
      });

    this.searchTerms$.pipe(
      // 延时以防止频繁请求
      debounceTime(500),
      // 舍弃那些参数没有变化的请求
      distinctUntilChanged()
    ).subscribe((keyword: string) => {
      console.log(keyword);
      this.videoProvider.clearVideoList();
      this.loadPageData();
    });
    this.videoProvider.loadVideoList(this.videoPageRequest);
  }

  scrollComplete(): void {
    if (this.infiniteScroll) {
      this.infiniteScroll.complete();
      this.infiniteScroll = null;
    }
    this.enableScrollLoad = this.videoList.length <= this.videoTotalCount;
  }

  loadPageData(): void {
    if (this.videoTotalCount != 0 && this.videoList.length == this.videoTotalCount) {
      this.scrollComplete();
      return;
    }
    this.videoPageRequest.skipCount = this.videoList.length;
    this.videoPageRequest.videoName = this.searchInput;
    this.videoProvider.loadVideoList(this.videoPageRequest);
  }

  showVideoInfo(video): void {
    this.videoProvider.setCurrentVideo(video);
    this.navCtrl.push(VideoInfoPage);
  }

  getLuckVideo(): void {
    let luckParam = new LuckVideoRequest();
    if (this.videoPageRequest.favId) {
      luckParam.favId = this.videoPageRequest.favId;
      luckParam.inSingleFav = true;
    } else {
      luckParam.inAllVideo = true;
    }
    this.videoProvider.getLuckVideo(luckParam)
      .subscribe(video => {
        this.videoProvider.setCurrentVideo(video);
        this.navCtrl.push(VideoInfoPage);
      });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    this.infiniteScroll = infiniteScroll;
    this.loadPageData();
  }

  goToTop(): void {
    this.fabContainer.close();
    this.content.scrollToTop();
  }

  onInput($event): void {
    this.searchTerms$.next(this.searchInput);
  }

  onCancel($event): void {

  }

  toggleSearchBox(): void {
    this.showSearchBox = !this.showSearchBox;
  }

}

