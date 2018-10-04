import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserInfo, LoginInfo, ApiResult } from '../../domain/entity';
import { USER_LOGIN } from '../api';
import { map } from "rxjs/operators";
import { LocalStorgeProvider } from '../local-storge/local-storage';
import { USER_INFO, SETTING_THEME } from '../local-storge/local-storage.namespace';
import { SettingsProvider } from '../settings/settings';

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
    private http: HttpClient,
    private localStorage: LocalStorgeProvider,
    private settingsProvider:SettingsProvider) {
    console.log('Hello UserProvider Provider');
  }

  login(loginInfo: LoginInfo): Observable<UserInfo> {
    return this.http.post<ApiResult<UserInfo>>(USER_LOGIN, loginInfo, httpOptions)
      .pipe(
        map(result => {
          var userInfo = result.result;
          var expireDate = new Date();
          expireDate.setSeconds(expireDate.getSeconds() + userInfo.expireInSeconds - 10);
          userInfo.expireDate = expireDate;
          return userInfo;
        })
      );
  }

  logout(): void {
    //切换回去普通主题
    this.settingsProvider.setTheme(this.settingsProvider.LIGHT_THEME_NAME);

    this.localStorage.clear(USER_INFO);
    this.localStorage.clear(SETTING_THEME);
  }
}
