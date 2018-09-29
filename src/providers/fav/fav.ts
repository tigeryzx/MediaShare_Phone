import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite, PageResult, ApiResult, FavoriteVideoChangeRequest } from '../../domain/entity';
import { map } from 'rxjs/operators';
import { FAV_GET_ALL, FAV_CREATE, FAV_UPDATE, FAV_DELETE, FAV_LIKE_VIDEO, FAV_UNLIKE_VIDEO } from '../api';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the FavProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavProvider {

  private favList: Favorite[] = [];
  favList$: Subject<Favorite[]> = new Subject<Favorite[]>();

  constructor(private http: HttpClient) {
    console.log('Hello FavProvider Provider');
  }

  loadFavList(): void {
    this.http.get<ApiResult<PageResult<Favorite>>>(FAV_GET_ALL)
      .pipe(
        map(result => result.result)
      ).subscribe(result => {
        this.favList = result.items;
        this.favList$.next(this.favList);
      });
  }

  createFav(favName: string, callback: (result: ApiResult<any>) => void): void {
    this.http.post<ApiResult<any>>(FAV_CREATE + `?favName=${favName}`, null)
      .subscribe(result => {
        if (callback)
          callback(result);
        this.loadFavList();
      });
  }

  updateFav(fav: Favorite, callback: (result: ApiResult<any>) => void): void {
    this.http.put<ApiResult<any>>(FAV_UPDATE, fav)
      .subscribe(result => {
        if (callback)
          callback(result);
        this.loadFavList();
      })
  }

  deleteFav(favid: number): void {
    this.http.delete<ApiResult<any>>(FAV_DELETE, {
      params: { "id": `${favid}` }
    }).subscribe(result => {
      this.loadFavList();
    });
  }

  likeVideo(favoriteVideoChangeRequest: FavoriteVideoChangeRequest): Observable<ApiResult<any>> {
    return this.http.post<ApiResult<any>>(FAV_LIKE_VIDEO, favoriteVideoChangeRequest);
  }

  unLikeVideo(favoriteVideoChangeRequest: FavoriteVideoChangeRequest): Observable<ApiResult<any>> {
    return this.http.post<ApiResult<any>>(FAV_UNLIKE_VIDEO, favoriteVideoChangeRequest);
  }
}
