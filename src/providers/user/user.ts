import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserInfo, LoginInfo, ApiResult } from '../../domain/entity';
import { USER_LOGIN } from '../api';
import { map } from "rxjs/operators";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserProvider {

  constructor(
    private http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  login(loginInfo: LoginInfo): Observable<UserInfo> {
    return this.http.post<ApiResult<UserInfo>>(USER_LOGIN, loginInfo, httpOptions)
      .pipe(
        map(result => result.result)
      );
  }
}
