import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VideoPageRequest, ApiResult, PageResult, Video } from '../../domain/entity';
import { VIDEO_GET_ALL, VIDEO_DELETE } from '../api';
import { map } from 'rxjs/operators';
import { HttpHelper } from '../../util/http-helper';
import { Subject } from 'rxjs/Subject';

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

  constructor(
    public http: HttpClient,
    private httpHelper: HttpHelper) {
    console.log('Hello VideoProvider Provider');
  }

  loadVideoList(videoPageRequest: VideoPageRequest): void {
    var params = this.httpHelper.objectConvertToHttpParams(videoPageRequest);
    this.http.get<ApiResult<PageResult<Video>>>(VIDEO_GET_ALL, {
      params: params
    }).pipe(
      map(result => result.result)
    ).subscribe(result => {
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

  deleteVideo(videoId: number): Observable<ApiResult<any>> {
    return this.http.delete<ApiResult<any>>(VIDEO_DELETE, {
      params: {
        "id": videoId.toString()
      }
    });
  }
}
