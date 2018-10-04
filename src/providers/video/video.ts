import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VideoPageRequest, ApiResult, PageResult, Video, VideoCoverSetting, LuckVideoRequest, VideoViewRequest } from '../../domain/entity';
import { VIDEO_GET_ALL, VIDEO_DELETE, VIDEO_SET_COVER, IMG_GETIMAGE, VIDEO_GET_LUCKVIDEO, VIDEO_VIEW_RECORD } from '../api';
import { map } from 'rxjs/operators';
import { HttpHelper } from '../../util/http-helper';
import { Subject } from 'rxjs/Subject';
import { ENV } from "@app/env";

/*
  Generated class for the VideoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VideoProvider {

  public videoList$: Subject<Video[]> = new Subject<Video[]>();
  public videoTotalCount$: Subject<number> = new Subject<number>();

  private videoList: Video[] = [];
  private videoTotalCount: number = 0;
  private currentVideo: Video = null;

  constructor(
    private http: HttpClient,
    private httpHelper: HttpHelper) {
    console.log('Hello VideoProvider Provider');
  }

  setCurrentVideo(video: Video): void {
    // 如果缓存有优先取之，为的是在内容页设置会在列表显示时进行同步
    var existsVideo = this.videoList.find(x => x.id == video.id);
    if (existsVideo)
      video = existsVideo;
    this.currentVideo = video;
  }

  getCurrentVideo(): Video {
    return this.currentVideo;
  }

  loadVideoList(videoPageRequest: VideoPageRequest): void {
    var params = this.httpHelper.objectConvertToHttpParams(videoPageRequest);
    this.http.get<ApiResult<PageResult<Video>>>(VIDEO_GET_ALL, {
      params: params
    }).pipe(
      map(result => result.result)
    ).subscribe(result => {

      // 设定图片URL信息
      if (result.items && result.items.length > 0) {
        result.items.forEach(video => {
          this.handleVideo(video);
        });
      }

      this.videoList.push(...result.items);
      this.videoTotalCount = result.totalCount;

      this.videoList$.next(this.videoList);
      this.videoTotalCount$.next(this.videoTotalCount);
    });
  }

  clearVideoList(): void {
    this.videoList = [];
    this.videoTotalCount = 0;

    this.videoList$.next(this.videoList);
    this.videoTotalCount$.next(this.videoTotalCount);
  }

  getAllVideo(videoPageRequest: VideoPageRequest): Observable<PageResult<Video>> {
    var params = this.httpHelper.objectConvertToHttpParams(videoPageRequest);
    return this.http.get<ApiResult<PageResult<Video>>>(VIDEO_GET_ALL, {
      params: params
    }).pipe(
      map(result => result.result)
    );
  }

  deleteVideo(videoId: number): Promise<ApiResult<any>> {
    return new Promise<ApiResult<any>>(resolve => {
      this.http.delete<ApiResult<any>>(VIDEO_DELETE, {
        params: {
          "id": videoId.toString()
        }
      }).subscribe(x => {
        var delVideo = this.videoList.find(x => x.id == videoId);
        // 可能不存在于列表因为有可能直接查看内容页
        if (delVideo) {
          var delVideoIndex = this.videoList.indexOf(delVideo);
          this.videoList.splice(delVideoIndex, 1);
        }
        resolve();
      });
    });
  }

  setVideoCover(videoCoverSetting: VideoCoverSetting): void {
    this.http.post<ApiResult<Video>>(VIDEO_SET_COVER, videoCoverSetting)
      .pipe(
        map(result => result.result)
      )
      .subscribe(video => {
        this.currentVideo.coverUrl = this.getVideoImageUrl(videoCoverSetting.imageId, true);
      });
  }

  getVideoImageUrl(imageId: number, isSmall: boolean): string {
    let url = IMG_GETIMAGE + `?imageId=${imageId}`;
    if (isSmall) {
      var maxWidth = window.document.body.clientWidth;
      url += `&maxWidth=${maxWidth}`;
    }
    // 开发环境中使用测试图片
    if (ENV.mode == 'dev')
      url = '../../assets/imgs/video-default.png';
    return url;
  }

  getLuckVideo(param: LuckVideoRequest): Observable<Video> {
    var params = this.httpHelper.objectConvertToHttpParams(param);
    return this.http.get<ApiResult<Video>>(VIDEO_GET_LUCKVIDEO, {
      params: params
    }).pipe(
      map(x => this.handleVideo(x.result))
    );
  }

  viewCurrentVideo(): Observable<any> {
    var param = new VideoViewRequest();
    param.videoId = this.currentVideo.id;
    param.isPlay = false;
    return this.http.post<ApiResult<any>>(VIDEO_VIEW_RECORD, param);
  }

  playCurrentVideo(): Observable<any> {
    var param = new VideoViewRequest();
    param.videoId = this.currentVideo.id;
    param.isPlay = true;
    return this.http.post<ApiResult<any>>(VIDEO_VIEW_RECORD, param);
  }

  private handleVideo(video: Video): Video {
    if (video.images && video.images.length > 0) {
      video.images.forEach(img => {
        img.url = this.getVideoImageUrl(img.id, true);
        img.bigUrl = this.getVideoImageUrl(img.id, false);
        if (img.isCover)
          video.coverUrl = img.url;
      });
    }
    return video;
  }
}
